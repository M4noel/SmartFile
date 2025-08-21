import multer from 'multer';
import cors from 'cors';
import pdfToDocumentConverter from '../utils/pdfToDocumentConverter.js';

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
        const supported = ['txt', 'docx', 'pptx', 'html'];
        if (!supported.includes((format || '').toLowerCase())) {
          return res.status(400).json({ success: false, error: `Formato não suportado: ${format}. Use txt, docx, pptx ou html.` });
        }
        const converted = await pdfToDocumentConverter(buffer, format.toLowerCase());
        let contentType = 'text/plain';
        let filename = 'documento.txt';
        switch (format.toLowerCase()) {
          case 'docx': contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'; filename = 'documento.docx'; break;
          case 'pptx': contentType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation'; filename = 'apresentacao.pptx'; break;
          case 'html': contentType = 'text/html'; filename = 'documento.html'; break;
        }
        res.set('Content-Type', contentType);
        res.set('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(converted);
      } catch (error) {
        console.error('Erro ao converter PDF para documento:', error);
        res.status(500).json({ success: false, error: 'Erro interno ao converter PDF para documento', details: error.message });
      }
    });
  });
}


