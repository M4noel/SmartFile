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
    upload.any()(req, res, async (err) => {
      if (err) return res.status(400).json({ error: err.message });
      try {
        const { title, pageSize, fontSize, contentData } = req.body;
        const parsedContentData = JSON.parse(contentData);
        const contentItems = [];
        let imageIndex = 0;
        for (let i = 0; i < parsedContentData.length; i++) {
          const item = parsedContentData[i];
          const contentItem = { type: item.type };
          switch (item.type) {
            case 'text':
              contentItem.content = item.content || '';
              break;
            case 'image':
              const fieldName = `image_${imageIndex}`;
              if (req.files && req.files[fieldName]) {
                contentItem.imageBuffer = req.files[fieldName][0].buffer;
                imageIndex++;
              }
              break;
            case 'table':
              if (item.tableData) {
                contentItem.tableData = item.tableData;
                contentItem.tableHeaders = item.tableHeaders || [];
              }
              break;
          }
          contentItems.push(contentItem);
        }
        const pdfBuffer = await pdfEditor.createPdfFromMultipleContent(contentItems, { title, pageSize, fontSize });
        res.set('Content-Type', 'application/pdf');
        res.set('Content-Disposition', 'attachment; filename=\"documento.pdf\"');
        res.send(pdfBuffer);
      } catch (error) {
        console.error('Erro ao gerar PDF combinado:', error);
        res.status(500).json({ success: false, error: 'Erro interno ao gerar PDF combinado', details: error.message });
      }
    });
  });
}


