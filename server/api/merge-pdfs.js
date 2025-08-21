import multer from 'multer';
import cors from 'cors';
import toolsController from '../controllers/toolsController.js';
import fileSizeValidator from '../middlewares/fileSizeValidator.js';

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

export default async function handler(req, res) {
  cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*' })(req, res, async () => {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    upload.array('pdfs', 5)(req, res, async (err) => {
      if (err) return res.status(400).json({ error: err.message });
      fileSizeValidator(req, res, async () => {
        await toolsController.mergePdfs(req, res);
      });
    });
  });
}


