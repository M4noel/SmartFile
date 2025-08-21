import multer from 'multer';
import cors from 'cors';
import pdfEditor from '../server/utils/pdfEditor.js';

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

export default async function handler(req, res) {
  cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*' })(req, res, async () => {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
    upload.array('images')(req, res, async (err) => {
      if (err) return res.status(400).json({ error: err.message });
      try {
        if (!req.files || req.files.length === 0) return res.status(400).json({ success: false, error: 'Nenhuma imagem enviada' });
        const imageBuffers = req.files.map(f => f.buffer);
        const pdfBuffer = await pdfEditor.createPdfFromImages(imageBuffers);
        res.set('Content-Type', 'application/pdf');
        res.set('Content-Disposition', 'attachment; filename=\"imagens-convertidas.pdf\"');
        res.send(pdfBuffer);
      } catch (error) {
        console.error('Erro ao criar PDF a partir de imagens:', error);
        res.status(500).json({ success: false, error: 'Erro interno ao criar PDF a partir de imagens', details: error.message });
      }
    });
  });
}


