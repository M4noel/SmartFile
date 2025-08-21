export default async function handler(req, res) {
  // Configurar CORS básico
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
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
