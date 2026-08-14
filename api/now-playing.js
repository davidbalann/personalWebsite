async function getAccessToken() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const r = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refreshToken }),
  });

  if (!r.ok) throw new Error('Failed to refresh Spotify token');
  const j = await r.json();
  return j.access_token;
}

function trackToItem(track) {
  return {
    title: track.name,
    artist: track.artists.map(a => a.name).join(', '),
    albumArt: track.album.images?.[0]?.url || null,
    songUrl: track.external_urls.spotify,
  };
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET || !process.env.SPOTIFY_REFRESH_TOKEN) {
    return res.status(200).json({ isPlaying: false, items: [] });
  }

  try {
    const accessToken = await getAccessToken();
    const authHeader = { headers: { Authorization: `Bearer ${accessToken}` } };

    // Currently playing (if any)
    let current = null;
    const nowRes = await fetch('https://api.spotify.com/v1/me/player/currently-playing', authHeader);
    if (nowRes.status === 200) {
      const song = await nowRes.json();
      if (song && song.item) current = trackToItem(song.item);
    }

    // Recent history — Spotify returns newest-first; reverse so the array
    // reads oldest -> newest, matching "newest at the bottom" in the widget.
    let history = [];
    const recentRes = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=15', authHeader);
    if (recentRes.ok) {
      const recent = await recentRes.json();
      history = (recent.items || []).map(it => trackToItem(it.track)).reverse();
    }

    // Avoid double-showing the same track if it's both currently playing and
    // still the most recent history entry.
    if (current && history.length) {
      const last = history[history.length - 1];
      if (last.title === current.title && last.artist === current.artist) history = history.slice(0, -1);
    }

    const items = current ? [...history, current] : history;

    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ isPlaying: !!current, items });
  } catch (err) {
    return res.status(200).json({ isPlaying: false, items: [] });
  }
};
