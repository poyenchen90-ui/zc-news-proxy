module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const url = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/News?maxRecords=4&sort[0][field]=date&sort[0][direction]=desc`;

  const r = await fetch(url, {
    headers: { Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}` }
  });

  const data = await r.json();

  const articles = data.records.map(rec => ({
    id: rec.id,
    title: rec.fields.title,
    excerpt: rec.fields.excerpt,
    category: rec.fields.category,
    date: rec.fields.date,
    author: rec.fields.author,
    image: rec.fields.image?.[0]?.url || rec.fields.image_url,
    link: rec.fields.link || '#'
  }));

  res.status(200).json(articles);
}
