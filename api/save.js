import crypto from 'crypto';

function base64urlEncode(input) {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(input);
  return buf
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64urlDecodeToString(b64url) {
  const b64 = String(b64url).replace(/-/g, '+').replace(/_/g, '/');
  const padLen = (4 - (b64.length % 4)) % 4;
  const padded = b64 + '='.repeat(padLen);
  return Buffer.from(padded, 'base64').toString('utf8');
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

function verifyToken(authHeader, secret) {
  const header = String(authHeader || '');
  const m = header.match(/^Bearer\s+(.+)$/i);
  if (!m) return { ok: false, error: 'Missing bearer token' };

  const token = m[1];
  const parts = token.split('.');
  if (parts.length !== 2) return { ok: false, error: 'Malformed token' };
  const [payloadB64, sigB64] = parts;

  const expectedSig = sign(payloadB64, secret);
  if (!timingSafeEqual(sigB64, expectedSig)) return { ok: false, error: 'Bad signature' };

  let payload;
  try {
    payload = JSON.parse(base64urlDecodeToString(payloadB64));
  } catch {
    return { ok: false, error: 'Bad payload' };
  }

  if (!payload?.exp || typeof payload.exp !== 'number') return { ok: false, error: 'Missing exp' };
  if (Date.now() > payload.exp) return { ok: false, error: 'Token expired' };
  return { ok: true };
}

export default async function handler(req, res) {
  if (req.method !== 'PUT' && req.method !== 'POST') {
    res.setHeader('Allow', 'PUT, POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminSecret = process.env.ADMIN_SECRET;
  if (!adminSecret) {
    return res.status(500).json({ error: 'Server not configured (missing ADMIN_SECRET)' });
  }

  const v = verifyToken(req.headers.authorization, adminSecret);
  if (!v.ok) return res.status(401).json({ error: v.error });

  const binId = process.env.JB_BIN;
  const masterKey = process.env.JB_KEY;
  if (!binId || !masterKey) {
    return res.status(500).json({ error: 'Server not configured (missing JB_BIN/JB_KEY)' });
  }

  const body = req.body;
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ error: 'Expected JSON object body' });
  }

  try {
    const upstream = await fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-Master-Key': masterKey },
      body: JSON.stringify(body),
    });

    if (!upstream.ok) {
      return res.status(502).json({ error: 'Upstream JSONBin error', status: upstream.status });
    }

    return res.status(200).json({ ok: true });
  } catch {
    return res.status(500).json({ error: 'Failed to save data' });
  }
}

