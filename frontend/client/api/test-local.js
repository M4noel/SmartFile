// Teste local para verificar se a API está funcionando
module.exports = (req, res) => {
  // CORS básico (não necessário na mesma origem, mas por segurança)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Resposta para qualquer método
  res.json({
    success: true,
    message: 'API local funcionando! 🎯',
    method: req.method,
    url: req.url,
    timestamp: new Date().toISOString(),
    origin: 'frontend/client/api',
    status: 'UNIFIED_DEPLOYMENT'
  });
};
