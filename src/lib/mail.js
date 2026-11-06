import nodemailer from 'nodemailer';
import { createHmac, timingSafeEqual } from 'node:crypto';

/** Server-side env lookup that works on Vercel (process.env) and in dev (import.meta.env). */
export const env = (key) => process.env[key] ?? import.meta.env[key];

export function smtpConfigured() {
  return Boolean(env('SMTP_HOST') && env('SMTP_USER') && env('SMTP_PASS'));
}

export function createTransport() {
  return nodemailer.createTransport({
    host: env('SMTP_HOST'),
    port: Number(env('SMTP_PORT') || 587),
    secure: env('SMTP_SECURE') === 'true',
    auth: { user: env('SMTP_USER'), pass: env('SMTP_PASS') },
  });
}

/** Always send from our own mailbox (SPF/DMARC); visitors go in Reply-To. */
export const fromAddress = () => `"Incoltec" <${env('SMTP_FROM') || env('SMTP_USER')}>`;

export const escapeHtml = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

/* ---------- Signed tokens for newsletter confirmation / unsubscribe ---------- */

const b64 = (s) => Buffer.from(s).toString('base64url');
const sign = (data, secret) => createHmac('sha256', secret).update(data).digest('base64url');

/** kind: 'c' = confirm (expires), 'u' = unsubscribe (no expiry). */
export function makeToken(payload, secret) {
  const data = b64(JSON.stringify(payload));
  return `${data}.${sign(data, secret)}`;
}

export function readToken(token, secret) {
  const [data, mac] = String(token || '').split('.');
  if (!data || !mac) return null;
  const expected = sign(data, secret);
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    return JSON.parse(Buffer.from(data, 'base64url').toString());
  } catch {
    return null;
  }
}

/* ---------- Optional Mailjet list sync ---------- */

export async function mailjetManage(email, action) {
  const key = env('MAILJET_API_KEY');
  const secret = env('MAILJET_SECRET_KEY');
  const list = env('MAILJET_LIST_ID');
  if (!key || !secret || !list) return 'skipped';
  const res = await fetch(`https://api.mailjet.com/v3/REST/contactslist/${encodeURIComponent(list)}/managecontact`, {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + Buffer.from(`${key}:${secret}`).toString('base64'),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ Email: email, Action: action === 'subscribe' ? 'addforce' : 'unsub' }),
  });
  if (!res.ok) throw new Error(`Mailjet ${res.status}: ${await res.text()}`);
  return 'synced';
}
