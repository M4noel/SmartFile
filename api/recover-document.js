import multer from 'multer';
import cors from 'cors';
import path from 'path';
import pdfEditor from '../server/utils/pdfEditor.js';
import { detectFormat } from '../server/utils/documentConverter.js';

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
        if (!req.file) return res.status(400).json({ success: false, error: 'Nenhum arquivo enviado' });
        const { buffer } = req.file;
        const { fileType } = req.body;
        const filename = req.file.originalname;
        let detectedFileType = fileType || await detectFormat(buffer, filename);
        const recoveredBuffer = await pdfEditor.recoverDocument(buffer, detectedFileType);
        let contentType = 'application/octet-stream';
        let outputFilename = `recuperado-${filename}`;
        switch (detectedFileType.toLowerCase()) {
          case 'docx':
          case 'xlsx':
          case 'pptx':
            if (recoveredBuffer.toString('utf8').startsWith('%PDF')) {
              contentType = 'application/pdf';
              outputFilename = filename.replace(/\.[^/.]+$/, '') + '-recuperado.pdf';
            } else {
              contentType = 'text/plain';
              outputFilename = filename.replace(/\.[^/.]+$/, '') + '-recuperado.txt';
            }
            break;
          case 'pdf':
            contentType = 'application/pdf';
            outputFilename = filename.replace(/\.[^/.]+$/, '') + '-recuperado.pdf';
            break;
          default:
            const ext = path.extname(filename);
            outputFilename = ext ? filename.replace(/\.[^/.]+$/, '') + `-recuperado${ext}` : filename + '-recuperado';
            break;
        }
        res.set('Content-Type', contentType);
        res.set('Content-Disposition', `attachment; filename="${outputFilename}"`);
        res.send(recoveredBuffer);
      } catch (error) {
        console.error('Erro ao recuperar documento:', error);
        res.status(500).json({ success: false, error: 'Erro interno ao recuperar documento', details: error.message });
      }
    });
  });
}


