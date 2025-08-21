import multer from 'multer';
import cors from 'cors';
import imageConverter from '../server/utils/imageConverter.js';
import fileSizeValidator from '../server/middlewares/fileSizeValidator.js';

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

export default async function handler(req, res) {
  cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*' })(req, res, async () => {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
    upload.single('image')(req, res, async (err) => {
      if (err) return res.status(400).json({ error: err.message });
      fileSizeValidator(req, res, async () => {
        try {
          const { buffer } = req.file;
          const { format, quality } = req.body;
          const supported = ['jpeg', 'png', 'webp', 'tiff'];
          if (!supported.includes((format || '').toLowerCase())) {
            return res.status(400).json({ success: false, error: `Formato não suportado: ${format}` });
          }
          const converted = await imageConverter(buffer, format, { quality: parseInt(quality) || 80 });
          const ct = format.toLowerCase() === 'png' ? 'image/png'
            : format.toLowerCase() === 'webp' ? 'image/webp'
            : format.toLowerCase() === 'tiff' ? 'image/tiff'
            : 'image/jpeg';
          res.set('Content-Type', ct);
          res.send(converted);
        } catch (error) {
          console.error('Erro ao converter imagem:', error);
          res.status(500).json({ success: false, error: 'Erro interno ao converter imagem', details: error.message });
        }
      });
    });
  });
}


