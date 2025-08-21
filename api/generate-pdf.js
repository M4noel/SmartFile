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
    upload.fields([{ name: 'image', maxCount: 1 }])(req, res, async (err) => {
      if (err) return res.status(400).json({ error: err.message });
      try {
        const { type, content, title, pageSize, fontSize, tableData, tableHeaders } = req.body;
        let pdfBuffer;
        switch (type) {
          case 'text':
            if (!content) return res.status(400).json({ success: false, error: 'Conteúdo de texto é obrigatório' });
            pdfBuffer = await pdfEditor.createPdfFromText(content, { title, pageSize, fontSize });
            break;
          case 'image':
            if (!req.files || !req.files.image) return res.status(400).json({ success: false, error: 'Imagem é obrigatória' });
            pdfBuffer = await pdfEditor.createPdfFromImages([req.files.image[0].buffer], { pageSize });
            break;
          case 'table':
            if (!tableData) return res.status(400).json({ success: false, error: 'Dados da tabela são obrigatórios' });
            pdfBuffer = await pdfEditor.createPdfFromTable(JSON.parse(tableData), tableHeaders ? JSON.parse(tableHeaders) : [], { title, pageSize });
            break;
          default:
            return res.status(400).json({ success: false, error: `Tipo não suportado: ${type}` });
        }
        res.set('Content-Type', 'application/pdf');
        res.set('Content-Disposition', 'attachment; filename="documento.pdf"');
        res.send(pdfBuffer);
      } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        res.status(500).json({ success: false, error: 'Erro interno ao gerar PDF', details: error.message });
      }
    });
  });
}


