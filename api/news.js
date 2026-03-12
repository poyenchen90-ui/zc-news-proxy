module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  try {
    const url = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/zc_news`
      + `?filterByFormula={active}=1`
      + `&sort[0][field]=date&sort[0][direction]=desc`
      + `&maxRecords=4`;

    const r = await fetch(url, {
      headers: { Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}` }
    });

    const data = await r.json();

    const articles = data.records.map(rec => ({
      id: rec.id,
      title: rec.fields.title || '',
      excerpt: rec.fields.excerpt || '',
      category: rec.fields.category || '',
      date: rec.fields.date || '',
      author: rec.fields.authour || '',
      image: rec.fields.image?.[0]?.url || '',
      link: rec.fields.link || '#'
    }));

    res.status(200).json(articles);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
