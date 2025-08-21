import multer from 'multer';
import cors from 'cors';
import tempStorageModule from '../utils/tempStorage.js';

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
        const filename = req.file.originalname;
        const storedFile = await tempStorageModule.storeFile(buffer, filename);
        res.json({ success: true, fileId: storedFile.id, filename: storedFile.originalName });
      } catch (error) {
        console.error('Erro ao armazenar arquivo:', error);
        res.status(500).json({ success: false, error: 'Erro interno ao armazenar arquivo', details: error.message });
      }
    });
  });
}


