import crypto from 'crypto';

function base64urlEncode(input) {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(input);
  return buf
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function timingSafeEqual(a, b) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

function sign(payloadB64, secret) {
  const sig = crypto.createHmac('sha256', secret).update(payloadB64).digest();
  return base64urlEncode(sig);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminSecret = process.env.ADMIN_SECRET;
  if (!adminSecret) {
    return res.status(500).json({ error: 'Server not configured (missing ADMIN_SECRET)' });
  }

  const password = (req.body && typeof req.body === 'object' ? req.body.password : null) || '';
  const supplied = String(password);

  if (!timingSafeEqual(supplied, String(adminSecret))) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  const exp = Date.now() + 30 * 60 * 1000;
  const payloadB64 = base64urlEncode(JSON.stringify({ exp }));
  const sigB64 = sign(payloadB64, adminSecret);
  return res.status(200).json({ token: `${payloadB64}.${sigB64}`, exp });
}

