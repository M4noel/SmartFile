import sharp from 'sharp';
import { setupCORS, handlePreflight, parseRequestBody, parseMultipart } from './utils/multipart.js';

export default async function handler(req, res) {
  // Configurar CORS
  setupCORS(res, process.env.CORS_ORIGIN?.split(',') || '*');
  
  // Handle preflight request
  if (handlePreflight(req, res)) return;
  
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const buffer = await parseRequestBody(req);
    
    // Parse multipart boundary
    const boundary = req.headers['content-type']?.split('boundary=')[1];
    if (!boundary) {
      return res.status(400).json({ error: 'Content-Type boundary not found' });
    }
    
    // Parse multipart data
    const parts = parseMultipart(buffer, boundary);
    const imagePart = parts.find(part => part.name === 'image');
    const qualityPart = parts.find(part => part.name === 'quality');
    const formatPart = parts.find(part => part.name === 'format');
    
    if (!imagePart) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }
    
    const quality = parseInt(qualityPart?.data?.toString() || '80', 10);
    const format = formatPart?.data?.toString() || 'jpeg';
    
    // Compress image using sharp
    const compressed = await sharp(imagePart.data)
      .jpeg({ quality })
      .toBuffer();
    
    res.setHeader('Content-Type', `image/${format}`);
    res.status(200).end(compressed); 

    
  } catch (error) {
    console.error('Erro ao comprimir imagem:', error);
    res.status(500).json({ error: 'Falha ao comprimir imagem' });
  }
}


