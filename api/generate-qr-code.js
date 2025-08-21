import QRCode from 'qrcode';
import { setupCORS, handlePreflight, parseRequestBody } from './utils/multipart.js';

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
    const body = buffer.toString();
    
    // Parse form data (simple key=value format)
    const formData = {};
    body.split('&').forEach(pair => {
      const [key, value] = pair.split('=');
      if (key && value) {
        formData[decodeURIComponent(key)] = decodeURIComponent(value);
      }
    });
    
    const { text, format } = formData;
    
    if (!text) {
      return res.status(400).json({ success: false, error: 'Texto ou URL é obrigatório' });
    }
    
    const supported = ['png', 'svg'];
    if (!format || !supported.includes(format.toLowerCase())) {
      return res.status(400).json({ success: false, error: `Formato não suportado: ${format}. Use png ou svg.` });
    }
    
    if (format.toLowerCase() === 'svg') {
      const svg = await QRCode.toString(text, { type: 'svg' });
      res.setHeader('Content-Type', 'image/svg+xml');
      res.send(svg);
    } else {
      const buffer = await QRCode.toBuffer(text, { type: 'png' });
      res.setHeader('Content-Type', 'image/png');
      res.send(buffer);
    }
    
  } catch (error) {
    console.error('Erro ao gerar QR Code:', error);
    res.status(500).json({ success: false, error: 'Erro interno ao gerar QR Code', details: error.message });
  }
}


