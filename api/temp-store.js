import tempStorageModule from '../server/utils/tempStorage.js';
import { setupCORS, handlePreflight, parseRequestBody, parseMultipart, sendJson } from './utils/multipart.js';

export default async function handler(req, res) {
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

    const storedFile = await tempStorageModule.storeFile(filePart.data, filePart.filename || 'arquivo');
    return sendJson(res, 200, { success: true, fileId: storedFile.id, filename: storedFile.originalName });
  } catch (error) {
    console.error('Erro ao armazenar arquivo:', error);
    return sendJson(res, 500, { success: false, error: 'Erro interno ao armazenar arquivo', details: error.message });
  }
}


