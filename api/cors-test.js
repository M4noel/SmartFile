const { setupCORS, handlePreflight, sendJson } = require('./utils/multipart.js');

module.exports = async function handler(req, res) {
  // Configurar CORS de forma permissiva
  setupCORS(req, res, '*');
  
  // Tratar preflight requests (OPTIONS)
  if (handlePreflight(req, res)) return;

  // Aceitar qualquer método HTTP para teste
  const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'];
  
  if (!allowedMethods.includes(req.method)) {
    res.setHeader('Allow', allowedMethods.join(', '));
    return sendJson(res, 405, { 
      error: 'Method Not Allowed', 
      allowedMethods: allowedMethods 
    });
  }

  // Responder com informações úteis para debug
  return sendJson(res, 200, {
    success: true,
    message: 'CORS Test Endpoint - Funcionando! 🚀',
    method: req.method,
    url: req.url,
    headers: req.headers,
    timestamp: new Date().toISOString()
  });
};