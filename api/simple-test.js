module.exports = function handler(req, res) {
  // CORS básico
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Aceitar tanto GET quanto POST para teste
  if (req.method === 'GET' || req.method === 'POST') {
    res.json({ 
      status: 'SUCCESS',
      message: 'API simples funcionando! 🎉',
      method: req.method,
      url: req.url,
      timestamp: new Date().toISOString()
    });
  } else {
    res.setHeader('Allow', 'GET, POST');
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
