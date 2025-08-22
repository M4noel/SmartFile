const compressImage = require('./utils/imageCompressor.js');
const { setupCORS, handlePreflight, parseRequestBody, parseMultipart, sendJson } = require('./utils/multipart.js');

module.exports = async function handler(req, res) {
  // Configurar CORS de forma mais permissiva
  setupCORS(req, res, process.env.CORS_ORIGIN?.split(',') || '*');
  
  // Tratar preflight requests (OPTIONS)
  if (handlePreflight(req, res)) return;

  // Verificar método HTTP - aceitar POST e OPTIONS
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return sendJson(res, 405, { error: 'Method Not Allowed', allowedMethods: ['POST', 'OPTIONS'] });
  }

  try {
    const bodyBuffer = await parseRequestBody(req);
    const boundary = req.headers['content-type']?.split('boundary=')[1];
    if (!boundary) return sendJson(res, 400, { error: 'Content-Type boundary not found' });

    const parts = parseMultipart(bodyBuffer, boundary);
    const imagePart = parts.find(p => p.name === 'image');
    if (!imagePart) return sendJson(res, 400, { error: 'Nenhum arquivo enviado' });

    const format = parts.find(p => p.name === 'format')?.data?.toString() || 'jpeg';
    const quality = parseInt(parts.find(p => p.name === 'quality')?.data?.toString() || '80', 10);

    const compressed = await compressImage(imagePart.data, { quality, format });

    const ct = format.toLowerCase() === 'png' ? 'image/png'
      : format.toLowerCase() === 'webp' ? 'image/webp'
      : format.toLowerCase() === 'avif' ? 'image/avif'
      : 'image/jpeg';

    res.setHeader('Content-Type', ct);
    res.end(compressed);
  } catch (error) {
    console.error('Erro ao comprimir imagem:', error);
    return sendJson(res, 500, { error: 'Falha ao comprimir imagem', details: error.message });
  }
}
