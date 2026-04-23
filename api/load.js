export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const binId = process.env.JB_BIN;
  const masterKey = process.env.JB_KEY;
  if (!binId || !masterKey) {
    return res.status(500).json({ error: 'Server not configured (missing JB_BIN/JB_KEY)' });
  }

  try {
    const upstream = await fetch(`https://api.jsonbin.io/v3/b/${binId}/latest`, {
      headers: { 'X-Master-Key': masterKey },
    });

    if (!upstream.ok) {
      return res.status(502).json({ error: 'Upstream JSONBin error', status: upstream.status });
    }

    const json = await upstream.json();
    res.setHeader('Cache-Control', 'public, max-age=60');
    return res.status(200).json(json?.record ?? json);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to load data' });
  }
}

