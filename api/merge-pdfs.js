const pdfMerge = require('../server/utils/pdfMerge.js');
const { setupCORS, handlePreflight, parseRequestBody, parseMultipart, sendJson } = require('./utils/multipart.js');

module.exports = async function handler(req, res) {
  setupCORS(req, res, process.env.CORS_ORIGIN?.split(',') || '*');
  if (handlePreflight(req, res)) return;

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { error: 'Method Not Allowed' });
  }

  try {
    const bodyBuffer = await parseRequestBody(req);
    const boundary = req.headers['content-type']?.split('boundary=')[1];
    if (!boundary) return sendJson(res, 400, { error: 'Content-Type boundary not found' });

    const parts = parseMultipart(bodyBuffer, boundary);
    const fileParts = parts.filter(p => p.name === 'pdfs' || p.name === 'pdfs[]');
    if (fileParts.length === 0) return sendJson(res, 400, { error: 'Nenhum PDF enviado' });

    const files = fileParts.map(p => ({ buffer: p.data }));
    const mergedPdf = await pdfMerge(files);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="merged.pdf"');
    res.end(mergedPdf);
  } catch (error) {
    console.error('Erro ao unir PDFs:', error);
    return sendJson(res, 500, { error: 'Falha ao unir PDFs' });
  }
}


