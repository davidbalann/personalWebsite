async function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch { return null; }
  }
  const raw = await new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = await readJsonBody(req);
  if (!body) return res.status(400).json({ error: 'Invalid request body' });

  const { name, email, message, company, ts } = body;

  // Honeypot field — real users never see or fill this. Accept silently so
  // bots don't learn their submission was rejected.
  if (company) return res.status(200).json({ ok: true });

  // Forms submitted faster than a human could type are almost always bots.
  const elapsed = Date.now() - Number(ts || 0);
  if (!ts || Number.isNaN(elapsed) || elapsed < 3000) {
    return res.status(200).json({ ok: true });
  }

  if (!name || !String(name).trim()) return res.status(400).json({ error: 'Name is required' });
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) return res.status(400).json({ error: 'Valid email is required' });
  if (!message || !String(message).trim()) return res.status(400).json({ error: 'Message is required' });
  if (String(message).length > 5000) return res.status(400).json({ error: 'Message is too long' });

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL || 'davidbalann@icloud.com';
  if (!apiKey) return res.status(500).json({ error: 'Server not configured (missing RESEND_API_KEY)' });

  try {
    const upstream = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        from: 'Portfolio Contact <onboarding@resend.dev>',
        to: [toEmail],
        reply_to: email,
        subject: `New portfolio message from ${name}`,
        text: `From: ${name} <${email}>\n\n${message}`,
      }),
    });

    if (!upstream.ok) {
      console.error('Resend error:', await upstream.text());
      return res.status(502).json({ error: 'Failed to send message' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('contact handler error:', err);
    return res.status(500).json({ error: 'Failed to send message' });
  }
};
