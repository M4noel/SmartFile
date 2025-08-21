import multer from 'multer';
import cors from 'cors';
import imageResizer from '../server/utils/imageResizer.js';

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
      try {
        const { buffer } = req.file;
        const { width, height, fit, position, withoutEnlargement } = req.body;
        const targetWidth = parseInt(width);
        const targetHeight = parseInt(height);
        if ((!targetWidth || targetWidth <= 0) && (!targetHeight || targetHeight <= 0)) {
          return res.status(400).json({ success: false, error: 'Dimensões inválidas. Pelo menos uma dimensão deve ser um número positivo.' });
        }
        const resizedImage = await imageResizer(
          buffer,
          targetWidth || null,
          targetHeight || null,
          {
            fit: fit || 'inside',
            position: position || 'center',
            withoutEnlargement: withoutEnlargement === 'true'
          }
        );
        res.set('Content-Type', 'image/jpeg');
        res.send(resizedImage);
      } catch (error) {
        console.error('Erro ao redimensionar imagem:', error);
        res.status(500).json({ success: false, error: 'Erro interno ao redimensionar imagem', details: error.message });
      }
    });
  });
}


