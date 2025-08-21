export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  
  res.json({ 
    message: 'API funcionando na Vercel!', 
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url
  });
}
