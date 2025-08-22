const sharp = require('sharp');

module.exports = async function handler(req, res) {
  // CORS básico
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Verificar método
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  
  try {
    // Para teste, vamos retornar uma resposta simples primeiro
    res.status(200).json({ 
      message: 'API compress-image funcionando! 🚀',
      method: req.method,
      timestamp: new Date().toISOString()
    });
    
  } catch (err) {
    console.error('Erro:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
