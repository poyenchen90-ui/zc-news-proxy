export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Softr 需要

  const url = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/News`
    + `?filterByFormula={active}=1&sort[0][field]=date&sort[0][direction]=desc&maxRecords=4`;

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
```

**Vercel 環境變數設定：**
- `AIRTABLE_TOKEN` → Airtable Personal Access Token
- `AIRTABLE_BASE_ID` → 你的 Base ID（`appXXXXXX`）

---

### 部署流程
```
Airtable 更新資料
    ↓
Vercel Proxy（GitHub repo 自動 CI/CD）
    ↓  fetch /api/news
news-block.html（放在 Softr Custom Code Block）
