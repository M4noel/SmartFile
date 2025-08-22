const path = require('path');
const pdfEditor = require('../server/utils/pdfEditor.js');
const { detectFormat } = require('../server/utils/documentConverter.js');
const { setupCORS, handlePreflight, parseRequestBody, parseMultipart, sendJson } = require('./utils/multipart.js');

module.exports = async function handler(req, res) {
  setupCORS(res, process.env.CORS_ORIGIN?.split(',') || '*');
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
    const filePart = parts.find(p => p.filename);
    if (!filePart) return sendJson(res, 400, { success: false, error: 'Nenhum arquivo enviado' });

    const fileTypePart = parts.find(p => p.name === 'fileType')?.data?.toString();
    const filename = filePart.filename || 'arquivo';
    let detectedFileType = fileTypePart || await detectFormat(filePart.data, filename);

    const recoveredBuffer = await pdfEditor.recoverDocument(filePart.data, detectedFileType);

    let contentType = 'application/octet-stream';
    let outputFilename = `recuperado-${filename}`;
    switch (detectedFileType.toLowerCase()) {
      case 'docx':
      case 'xlsx':
      case 'pptx':
        if (recoveredBuffer.toString('utf8').startsWith('%PDF')) {
          contentType = 'application/pdf';
          outputFilename = filename.replace(/\.[^/.]+$/, '') + '-recuperado.pdf';
        } else {
          contentType = 'text/plain';
          outputFilename = filename.replace(/\.[^/.]+$/, '') + '-recuperado.txt';
        }
        break;
      case 'pdf':
        contentType = 'application/pdf';
        outputFilename = filename.replace(/\.[^/.]+$/, '') + '-recuperado.pdf';
        break;
      default:
        const ext = path.extname(filename);
        outputFilename = ext ? filename.replace(/\.[^/.]+$/, '') + `-recuperado${ext}` : filename + '-recuperado';
        break;
    }
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${outputFilename}"`);
    res.end(recoveredBuffer);
  } catch (error) {
    console.error('Erro ao recuperar documento:', error);
    return sendJson(res, 500, { success: false, error: 'Erro interno ao recuperar documento', details: error.message });
  }
}


