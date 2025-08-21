import sharp from 'sharp';
import { setupCORS, handlePreflight, parseRequestBody, parseMultipart, sendJson } from './utils/multipart.js';

export default async function handler(req, res) {
  // CORS
  setupCORS(req, res, process.env.CORS_ORIGIN?.split(',') || '*');

  // Preflight
  if (handlePreflight(req, res)) return;

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { error: 'Method Not Allowed' });
  }

  try {
    const buffer = await parseRequestBody(req);
    const boundary = req.headers['content-type']?.split('boundary=')[1];
    if (!boundary) return sendJson(res, 400, { error: 'Content-Type boundary not found' });

    const parts = parseMultipart(buffer, boundary);
    const imagePart = parts.find(part => part.name === 'image');
    if (!imagePart) return sendJson(res, 400, { error: 'Nenhum arquivo enviado' });

    const quality = parseInt(parts.find(p => p.name === 'quality')?.data?.toString() || '80', 10);
    const format = parts.find(p => p.name === 'format')?.data?.toString() || 'jpeg';

    const compressed = await sharp(imagePart.data).jpeg({ quality }).toBuffer();

    res.setHeader('Content-Type', `image/${format}`);
    res.statusCode = 200;
    res.end(compressed);

  } catch (err) {
    console.error(err);
    return sendJson(res, 500, { error: 'Falha ao comprimir imagem' });
  }
}
