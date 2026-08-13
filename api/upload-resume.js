const crypto = require('crypto');
const { put } = require('@vercel/blob');

function base64urlDecodeToString(b64url) {
  const b64 = String(b64url).replace(/-/g, '+').replace(/_/g, '/');
  const padLen = (4 - (b64.length % 4)) % 4;
  return Buffer.from(b64 + '='.repeat(padLen), 'base64').toString('utf8');
}
function timingSafeEqual(a, b) {
  const ab = Buffer.from(a), bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}
function sign(payloadB64, secret) {
  return crypto.createHmac('sha256', secret).update(payloadB64).digest()
    .toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}
function verifyToken(authHeader, secret) {
  const m = String(authHeader || '').match(/^Bearer\s+(.+)$/i);
  if (!m) return { ok: false, error: 'Missing bearer token' };
  const [payloadB64, sigB64] = m[1].split('.');
  if (!payloadB64 || !sigB64) return { ok: false, error: 'Malformed token' };
  if (!timingSafeEqual(sigB64, sign(payloadB64, secret))) return { ok: false, error: 'Bad signature' };
  let payload;
  try { payload = JSON.parse(base64urlDecodeToString(payloadB64)); } catch { return { ok: false, error: 'Bad payload' }; }
  if (!payload?.exp || Date.now() > payload.exp) return { ok: false, error: 'Token expired' };
  return { ok: true };
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminSecret = process.env.ADMIN_SECRET;
  if (!adminSecret) return res.status(500).json({ error: 'Server not configured (missing ADMIN_SECRET)' });

  const v = verifyToken(req.headers.authorization, adminSecret);
  if (!v.ok) return res.status(401).json({ error: v.error });

  if (req.headers['content-type'] !== 'application/pdf') {
    return res.status(400).json({ error: 'Expected Content-Type: application/pdf' });
  }

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const buffer = Buffer.concat(chunks);

  if (!buffer.length) return res.status(400).json({ error: 'Empty file' });
  if (buffer.length > 10 * 1024 * 1024) return res.status(413).json({ error: 'File too large (10MB max)' });

  try {
    const blob = await put('resume.pdf', buffer, {
      access: 'public',
      contentType: 'application/pdf',
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    return res.status(200).json({ url: blob.url });
  } catch (err) {
      console.error('upload-resume error:', err);
      return res.status(500).json({ error: 'Failed to upload resume', detail: String(err?.message || err) });
    }
};