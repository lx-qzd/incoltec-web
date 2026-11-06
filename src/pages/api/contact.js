export const prerender = false;
import { createTransport, env, escapeHtml, fromAddress, makeToken, smtpConfigured } from '../../lib/mail.js';

/**
 * Handles every website form:
 *  - form_type=contact     → enquiry / sample / data-sheet request
 *  - form_type=newsletter  → newsletter sign-up request (notified to the team)
 *
 * Required environment variables (Vercel → Settings → Environment Variables):
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS   SMTP account used to send
 *   CONTACT_EMAIL                                 inbox that receives enquiries (default info@incoltec.com)
 * Optional:
 *   SMTP_SECURE=true                              for port 465
 *   NEWSLETTER_SECRET                             enables the newsletter (signs double opt-in links)
 *   NEWSLETTER_EMAIL                              inbox for confirmed sign-ups (default CONTACT_EMAIL)
 *   MAILJET_API_KEY, MAILJET_SECRET_KEY, MAILJET_LIST_ID   sync confirmed contacts to a Mailjet list
 *   TURNSTILE_SECRET_KEY                          enables Cloudflare Turnstile verification
 */


const REASONS = {
  sample: 'Sample request / Solicitud de muestra',
  datasheet: 'Technical data sheet / Ficha técnica',
  quote: 'Price / Presupuesto',
  formulation: 'Formulation support / Soporte de formulación',
  horeca: 'HORECA',
  catalogue: 'Catalogue / Catálogo',
  other: 'Other / Otro',
};

const MSG = {
  en: {
    missing: 'Please complete the required fields and accept the privacy policy.',
    email: 'Please enter a valid email address.',
    ok: 'Thank you. We have received your enquiry and will reply as soon as possible.',
    okNews: 'Almost done: we have sent you an email. Click the link in it to confirm your subscription.',
    spam: 'Your request could not be verified. Please try again.',
    unavailable: 'The form is temporarily unavailable. Please email info@incoltec.com.',
    error: 'Your enquiry could not be sent. Please try again or email info@incoltec.com.',
  },
  es: {
    missing: 'Completa los campos obligatorios y acepta la política de privacidad.',
    email: 'Introduce un email válido.',
    ok: 'Gracias. Hemos recibido tu consulta y te responderemos lo antes posible.',
    okNews: 'Casi listo: te hemos enviado un email. Pulsa el enlace para confirmar tu suscripción.',
    spam: 'No hemos podido verificar el envío. Inténtalo de nuevo.',
    unavailable: 'El formulario no está disponible temporalmente. Escríbenos a info@incoltec.com.',
    error: 'No se ha podido enviar la consulta. Inténtalo de nuevo o escríbenos a info@incoltec.com.',
  },
};

const json = (status, body) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const clean = (v, max = 500) =>
  String(v ?? '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
    .slice(0, max);


const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[a-z]{2,}$/i;

async function verifyTurnstile(token, ip) {
  const secret = env('TURNSTILE_SECRET_KEY');
  if (!secret) return true;
  if (!token) return false;
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set('remoteip', ip);
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
  const data = await res.json().catch(() => ({}));
  return data.success === true;
}

export const POST = async ({ request, clientAddress }) => {
  let lang = 'en';
  try {
    const data = await request.formData();
    lang = clean(data.get('lang'), 2) === 'es' ? 'es' : 'en';
    const m = MSG[lang];
    const type = clean(data.get('form_type'), 20) === 'newsletter' ? 'newsletter' : 'contact';

    // Honeypot: bots fill hidden fields. Pretend success so they don't retry.
    if (clean(data.get('bot_field')) || clean(data.get('_honey'))) {
      return json(200, { success: true, message: type === 'newsletter' ? m.okNews : m.ok });
    }
    // Submissions faster than 3 s after page load are almost always bots.
    const started = Number(data.get('started'));
    if (started && Date.now() - started < 3000) return json(400, { error: m.spam });

    if (!(await verifyTurnstile(clean(data.get('cf-turnstile-response'), 2048), clientAddress))) {
      return json(400, { error: m.spam });
    }

    const email = clean(data.get('email'), 160);
    const privacy = data.get('privacy') === 'on';
    if (!email || !privacy) return json(400, { error: m.missing });
    if (!EMAIL_RE.test(email)) return json(400, { error: m.email });

    const fields = {
      type,
      lang,
      // Single line: the name is reused in the Reply-To header.
      name: clean(data.get('name'), 120).replace(/[\r\n\t]+/g, ' '),
      email,
      company: clean(data.get('company'), 160),
      phone: clean(data.get('phone'), 40),
      country: clean(data.get('country'), 80),
      reason: REASONS[clean(data.get('reason'), 20)] ?? '',
      product: clean(data.get('product'), 160),
      message: clean(data.get('message'), 4000),
      page: clean(data.get('page'), 500),
      privacy: 'Yes',
      commercial: data.get('commercial') === 'on' ? 'Yes' : 'No',
      submittedAt: new Date().toISOString(),
    };

    if (type === 'contact' && (!fields.name || !fields.reason || fields.message.length < 10)) {
      return json(400, { error: m.missing });
    }

    if (!smtpConfigured()) {
      console.error('[contact] SMTP is not configured (SMTP_HOST / SMTP_USER / SMTP_PASS).');
      return json(503, { error: m.unavailable });
    }
    const transporter = createTransport();

    if (type === 'newsletter') {
      // Double opt-in: nothing is stored until the subscriber clicks the signed link.
      const secret = env('NEWSLETTER_SECRET');
      if (!secret) {
        console.error('[newsletter] NEWSLETTER_SECRET is not set.');
        return json(503, { error: m.unavailable });
      }
      const origin = new URL(request.url).origin;
      const token = makeToken({ k: 'c', e: email, l: lang, t: Date.now(), c: fields.commercial }, secret);
      const link = `${origin}/api/newsletter?action=confirm&token=${encodeURIComponent(token)}`;
      const es = lang === 'es';
      await transporter.sendMail({
        from: fromAddress(),
        to: email,
        subject: es ? 'Confirma tu suscripción al boletín de Incoltec' : 'Confirm your subscription to the Incoltec newsletter',
        text: es
          ? `Hola:\n\nPara completar tu suscripción al boletín de Incoltec, abre este enlace (válido 7 días):\n${link}\n\nSi no lo has solicitado, ignora este mensaje y no recibirás nada más.\n\n${'Innovation Colour Technology S.L.'} · incoltec.com`
          : `Hello,\n\nTo complete your subscription to the Incoltec newsletter, open this link (valid for 7 days):\n${link}\n\nIf you did not request it, ignore this message and you will not hear from us again.\n\nInnovation Colour Technology S.L. · incoltec.com`,
        html: `<div style="font-family:Arial,sans-serif;font-size:15px;color:#1e1e1e;max-width:520px">
          <p>${es ? 'Hola:' : 'Hello,'}</p>
          <p>${es ? 'Para completar tu suscripción al boletín de Incoltec, confirma tu email:' : 'To complete your subscription to the Incoltec newsletter, please confirm your email:'}</p>
          <p><a href="${escapeHtml(link)}" style="display:inline-block;background:#e30066;color:#fff;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:bold">${es ? 'Confirmar suscripción' : 'Confirm subscription'}</a></p>
          <p style="font-size:13px;color:#555">${es ? 'El enlace es válido 7 días. Si no lo has solicitado, ignora este mensaje.' : 'The link is valid for 7 days. If you did not request it, ignore this message.'}</p>
          <p style="font-size:12px;color:#777">Innovation Colour Technology S.L. · <a href="https://incoltec.com" style="color:#777">incoltec.com</a></p>
        </div>`,
      });
      return json(200, { success: true, message: m.okNews });
    }

    const to = env('CONTACT_EMAIL') || 'info@incoltec.com';

    const labels = {
      type: 'Form', lang: 'Language', name: 'Name', email: 'Email', company: 'Company', phone: 'Phone',
      country: 'Country', reason: 'Reason', product: 'Product', message: 'Message', page: 'Page URL',
      privacy: 'Privacy policy accepted', commercial: 'Commercial communications accepted', submittedAt: 'Submitted at (UTC)',
    };
    const rows = Object.entries(fields).filter(([, v]) => v);
    const text = rows.map(([k, v]) => `${labels[k]}: ${v}`).join('\n');
    const html =
      '<table cellpadding="6" style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">' +
      rows
        .map(
          ([k, v]) =>
            `<tr><th align="left" valign="top" style="background:#f4f4f5">${labels[k]}</th><td>${escapeHtml(v).replace(/\n/g, '<br>')}</td></tr>`,
        )
        .join('') +
      '</table>';

    const subject = `[Web] ${fields.reason.split(' / ')[0]}${fields.product ? ` – ${fields.product}` : ''} – ${fields.company || fields.name}`;

    await transporter.sendMail({
      // Always send from our own mailbox (sending "from" the visitor gets rejected by SPF/DMARC);
      // reply-to lets the team answer the visitor directly.
      from: fromAddress(),
      to,
      replyTo: fields.name ? `"${fields.name.replace(/"/g, '')}" <${email}>` : email,
      subject: subject.replace(/[\r\n]+/g, ' ').slice(0, 200),
      text,
      html,
    });

    return json(200, { success: true, message: m.ok });
  } catch (error) {
    console.error('[contact] send failed', error);
    return json(500, { error: MSG[lang].error });
  }
};
