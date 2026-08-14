const { head } = require('@vercel/blob');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const blob = await head('resume.pdf');
    const upstream = await fetch(blob.url);
    if (!upstream.ok) return res.status(502).json({ error: 'Failed to fetch resume' });

    const buffer = Buffer.from(await upstream.arrayBuffer());
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="David_Balan_Resume.pdf"');
    res.setHeader('Cache-Control', 'no-store');
    return res.end(buffer);
  } catch (err) {
    return res.status(404).json({ error: 'Resume not found' });
  }
};