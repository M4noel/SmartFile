// Teste de compatibilidade com Vercel
module.exports = async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Aceitar qualquer método para teste
  res.json({
    success: true,
    message: 'Teste Vercel funcionando! 🎯',
    method: req.method,
    url: req.url,
    timestamp: new Date().toISOString(),
    headers: Object.keys(req.headers)
  });
};
