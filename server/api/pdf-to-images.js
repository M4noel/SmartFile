import multer from 'multer';
import cors from 'cors';
import documentToImageConverter from '../utils/pdfToImageConverter.js';

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
      try {
        if (!req.file) return res.status(400).json({ success: false, error: 'Arquivo PDF não enviado' });
        const { buffer } = req.file;
        const { format } = req.body;
        const supported = ['jpeg', 'png', 'webp'];
        if (!supported.includes((format || '').toLowerCase())) {
          return res.status(400).json({ success: false, error: `Formato não suportado: ${format}. Use jpeg, png ou webp.` });
        }
        const images = await documentToImageConverter(buffer, 'pdf', format.toLowerCase());
        const archiver = (await import('archiver')).default;
        const archive = archiver('zip', { zlib: { level: 9 } });
        res.set('Content-Type', 'application/zip');
        res.set('Content-Disposition', 'attachment; filename="pdf-imagens.zip"');
        archive.pipe(res);
        for (const image of images) {
          archive.append(image.buffer, { name: `page-${image.pageNumber}.${format.toLowerCase()}` });
        }
        await archive.finalize();
      } catch (error) {
        console.error('Erro ao converter PDF para imagens:', error);
        res.status(500).json({ success: false, error: 'Erro interno ao converter PDF para imagens', details: error.message });
      }
    });
  });
}


