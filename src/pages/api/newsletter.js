export const prerender = false;
import { createTransport, env, escapeHtml, fromAddress, mailjetManage, makeToken, readToken, smtpConfigured } from '../../lib/mail.js';

/**
 * GET /api/newsletter?action=confirm&token=…      (link in the double opt-in email)
 * GET /api/newsletter?action=unsubscribe&token=…  (link in the welcome email and in every newsletter)
 *
 * Confirmed sign-ups/unsubscribes are synced to Mailjet when MAILJET_* is set, and always
 * notified to NEWSLETTER_EMAIL with date, IP and user agent as the consent record.
 */
const CONFIRM_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export const GET = async ({ url, request, clientAddress, redirect }) => {
  const secret = env('NEWSLETTER_SECRET');
  const action = url.searchParams.get('action');
  const data = secret ? readToken(url.searchParams.get('token'), secret) : null;
  const lang = data?.l === 'es' ? 'es' : 'en';
  const page = (status) => redirect(`${lang === 'es' ? '/es' : ''}/newsletter?status=${status}`, 303);

  const valid =
    data &&
    typeof data.e === 'string' &&
    ((action === 'confirm' && data.k === 'c' && Date.now() - Number(data.t) < CONFIRM_TTL_MS) ||
      (action === 'unsubscribe' && data.k === 'u'));
  if (!valid) return page('invalid');

  const email = data.e;
  const subscribe = action === 'confirm';
  try {
    const sync = await mailjetManage(email, subscribe ? 'subscribe' : 'unsubscribe');

    if (smtpConfigured()) {
      const transporter = createTransport();
      const origin = url.origin;
      const record = [
        ['Action', subscribe ? 'Newsletter subscription CONFIRMED (double opt-in)' : 'Newsletter UNSUBSCRIBE'],
        ['Email', email],
        ['Language', lang],
        ['Requested at (UTC)', subscribe ? new Date(Number(data.t)).toISOString() : '—'],
        ['Confirmed at (UTC)', new Date().toISOString()],
        ['IP', clientAddress || ''],
        ['User agent', request.headers.get('user-agent') || ''],
        ['Mailjet list', sync],
      ];
      await transporter.sendMail({
        from: fromAddress(),
        to: env('NEWSLETTER_EMAIL') || env('CONTACT_EMAIL') || 'info@incoltec.com',
        subject: `[Web] Newsletter ${subscribe ? 'alta confirmada' : 'baja'} – ${email}`,
        text: record.map(([k, v]) => `${k}: ${v}`).join('\n'),
        html:
          '<table cellpadding="6" style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">' +
          record.map(([k, v]) => `<tr><th align="left" style="background:#f4f4f5">${k}</th><td>${escapeHtml(v)}</td></tr>`).join('') +
          '</table>',
      });

      if (subscribe) {
        // Welcome email with a permanent unsubscribe link.
        const unsub = `${origin}/api/newsletter?action=unsubscribe&token=${encodeURIComponent(makeToken({ k: 'u', e: email, l: lang }, secret))}`;
        const es = lang === 'es';
        await transporter.sendMail({
          from: fromAddress(),
          to: email,
          subject: es ? 'Suscripción confirmada – Incoltec' : 'Subscription confirmed – Incoltec',
          text: es
            ? `Gracias, tu suscripción al boletín de Incoltec está confirmada.\n\nPuedes darte de baja en cualquier momento: ${unsub}`
            : `Thank you, your subscription to the Incoltec newsletter is confirmed.\n\nYou can unsubscribe at any time: ${unsub}`,
          html: `<div style="font-family:Arial,sans-serif;font-size:15px;color:#1e1e1e;max-width:520px">
            <p>${es ? 'Gracias, tu suscripción al boletín de Incoltec está confirmada.' : 'Thank you, your subscription to the Incoltec newsletter is confirmed.'}</p>
            <p style="font-size:13px;color:#555">${es ? 'Puedes darte de baja en cualquier momento' : 'You can unsubscribe at any time'}: <a href="${escapeHtml(unsub)}" style="color:#555">${es ? 'darme de baja' : 'unsubscribe'}</a></p>
          </div>`,
          headers: { 'List-Unsubscribe': `<${unsub}>` },
        });
      }
    }
    return page(subscribe ? 'confirmed' : 'unsubscribed');
  } catch (error) {
    console.error('[newsletter]', error);
    return page('error');
  }
};
