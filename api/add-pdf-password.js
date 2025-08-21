import multer from 'multer';
import cors from 'cors';

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

export default async function handler(req, res) {
  cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*' })(req, res, async () => {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
    upload.single('pdf')(req, res, async (err) => {
      if (err) return res.status(400).json({ error: err.message });
      return res.status(501).json({ success: false, error: 'Adicionar senha ao PDF não é suportado no ambiente serverless atual.' });
    });
  });
}


