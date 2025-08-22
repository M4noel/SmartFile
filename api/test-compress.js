const { setupCORS, handlePreflight, sendJson } = require('./utils/multipart.js');

module.exports = async function handler(req, res) {
  setupCORS(req, res, process.env.CORS_ORIGIN?.split(',') || '*');
  if (handlePreflight(req, res)) return;

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return sendJson(res, 405, { error: 'Method Not Allowed' });
  }

  return sendJson(res, 200, { 
    success: true, 
    message: 'API de compressão de imagem está configurada corretamente! 🎉',
    timestamp: new Date().toISOString()
  });
}