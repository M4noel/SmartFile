import multer from 'multer';
import cors from 'cors';
import { PDFDocument } from 'pdf-lib';

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
        const { password } = req.body;
        if (!password) return res.status(400).json({ success: false, error: 'Senha não fornecida' });
        try {
          const pdfDoc = await PDFDocument.load(buffer, { password, ignoreEncryption: true });
          const unprotectedBuffer = await pdfDoc.save();
          res.set('Content-Type', 'application/pdf');
          res.set('Content-Disposition', 'attachment; filename="pdf-sem-senha.pdf"');
          res.send(Buffer.from(unprotectedBuffer));
        } catch (e) {
          return res.status(400).json({ success: false, error: 'Senha incorreta ou PDF não pode ser descriptografado' });
        }
      } catch (error) {
        console.error('Erro ao remover senha do PDF:', error);
        res.status(500).json({ success: false, error: 'Erro interno ao remover senha do PDF', details: error.message });
      }
    });
  });
}


