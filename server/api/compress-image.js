import multer from 'multer';
import cors from 'cors';
import compressImage from '../utils/imageCompressor.js';

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
        if (!req.file) return res.status(400).json({ error: 'Nenhum arquivo enviado' });
        const buffer = req.file.buffer;
        const quality = parseInt(req.body.quality || '80', 10);
        const format = req.body.format || 'jpeg';
        const compressed = await compressImage(buffer, { quality, format });
        res.set('Content-Type', `image/${format}`);
        res.send(compressed);
      } catch (error) {
        console.error('Erro ao comprimir imagem:', error);
        res.status(500).json({ error: 'Falha ao comprimir imagem' });
      }
    });
  });
}


