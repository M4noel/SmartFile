import { PDFDocument } from 'pdf-lib';
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
      return res.status(400).json({ success: false, error: 'Content-Type boundary not found' });
    }
    
    // Parse multipart data
    const parts = parseMultipart(buffer, boundary);
    const pdfPart = parts.find(part => part.name === 'pdf');
    const passwordPart = parts.find(part => part.name === 'password');
    
    if (!pdfPart) {
      return res.status(400).json({ success: false, error: 'Arquivo PDF não enviado' });
    }
    
    if (!passwordPart) {
      return res.status(400).json({ success: false, error: 'Senha não fornecida' });
    }
    
    const password = passwordPart.data.toString();
    
    try {
      const pdfDoc = await PDFDocument.load(pdfPart.data, { password, ignoreEncryption: true });
      const unprotectedBuffer = await pdfDoc.save();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="pdf-sem-senha.pdf"');
      res.send(Buffer.from(unprotectedBuffer));
    } catch (e) {
      return res.status(400).json({ success: false, error: 'Senha incorreta ou PDF não pode ser descriptografado' });
    }
    
  } catch (error) {
    console.error('Erro ao remover senha do PDF:', error);
    res.status(500).json({ success: false, error: 'Erro interno ao remover senha do PDF', details: error.message });
  }
}


