export default async function handler(req, res) {
  const q = (req.query.q || '').toString().trim();

  if (!q) {
    return res.status(200).json({ results: [] });
  }

  try {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(q)}&media=music&entity=song&limit=8`;
    const response = await fetch(url);
    const data = await response.json();

    const results = (data.results || [])
      .filter((item) => item.previewUrl)
      .map((item) => ({
        id: item.trackId,
        title: item.trackName,
        artist: item.artistName,
        artwork: (item.artworkUrl100 || item.artworkUrl60 || '').replace('100x100bb', '300x300bb'),
        preview: item.previewUrl,
      }));

    return res.status(200).json({ results });
  } catch (err) {
    return res.status(200).json({ results: [] });
  }
}
