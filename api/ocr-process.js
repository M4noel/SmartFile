import multer from 'multer';
import cors from 'cors';
import ocrProcessor from '../server/utils/ocrProcessor.js';

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

export default async function handler(req, res) {
  cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*' })(req, res, async () => {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
    upload.single('file')(req, res, async (err) => {
      if (err) return res.status(400).json({ error: err.message });
      try {
        const { buffer } = req.file;
        const { language, outputFormat } = req.body;
        const ocrResult = await ocrProcessor(buffer, language || 'por');
        if (outputFormat === 'json') {
          res.json(ocrResult);
        } else {
          res.set('Content-Type', 'text/plain');
          res.send(ocrResult.text);
        }
      } catch (error) {
        console.error('Erro ao processar OCR:', error);
        res.status(500).json({ success: false, error: 'Erro interno ao processar OCR', details: error.message });
      }
    });
  });
}


