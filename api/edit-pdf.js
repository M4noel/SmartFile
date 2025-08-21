import multer from 'multer';
import cors from 'cors';
import pdfEditor from '../server/utils/pdfEditor.js';

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
        const { operation, options } = req.body;
        
        let result;
        switch (operation) {
          case 'rotate':
            const { angle } = JSON.parse(options || '{}');
            result = await pdfEditor.rotatePdf(buffer, parseInt(angle) || 90);
            break;
          case 'split':
            const { pages } = JSON.parse(options || '{}');
            result = await pdfEditor.splitPdf(buffer, pages ? JSON.parse(pages) : []);
            break;
          case 'watermark':
            const { text, position } = JSON.parse(options || '{}');
            result = await pdfEditor.addWatermark(buffer, text || 'SmartFiles', position || 'center');
            break;
          case 'annotate':
            const { annotationType, x, y, content } = JSON.parse(options || '{}');
            result = await pdfEditor.addAnnotation(buffer, annotationType || 'text', parseInt(x) || 100, parseInt(y) || 100, content || '');
            break;
          case 'removePages':
            const { pagesToRemove } = JSON.parse(options || '{}');
            result = await pdfEditor.removePages(buffer, pagesToRemove ? JSON.parse(pagesToRemove) : []);
            break;
          default:
            return res.status(400).json({ success: false, error: `Operação não suportada: ${operation}` });
        }
        
        res.set('Content-Type', 'application/pdf');
        res.set('Content-Disposition', 'attachment; filename="pdf-editado.pdf"');
        res.send(result);
      } catch (error) {
        console.error('Erro ao editar PDF:', error);
        res.status(500).json({ success: false, error: 'Erro interno ao editar PDF', details: error.message });
      }
    });
  });
}


