import multer from 'multer';
import cors from 'cors';
import documentToImageConverter from '../utils/pdfToImageConverter.js';

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

function detectDocumentFormat(filename) {
  const ext = filename.toLowerCase().split('.').pop();
  const formatMap = { pdf: 'pdf', docx: 'docx', doc: 'docx', pptx: 'pptx', ppt: 'pptx', xlsx: 'xlsx', xls: 'xlsx', txt: 'txt', rtf: 'rtf' };
  return formatMap[ext] || 'pdf';
}

function getPageLabel(format) {
  switch ((format || '').toLowerCase()) {
    case 'pptx': return 'Slide';
    case 'xlsx': return 'Planilha';
    default: return 'Pagina';
  }
}

export default async function handler(req, res) {
  cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*' })(req, res, async () => {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
    upload.single('document')(req, res, async (err) => {
      if (err) return res.status(400).json({ error: err.message });
      try {
        if (!req.file) return res.status(400).json({ success: false, error: 'Arquivo não enviado' });
        const { buffer } = req.file;
        const { format, inputFormat } = req.body;
        const filename = req.file.originalname;
        const detectedInputFormat = inputFormat || detectDocumentFormat(filename);
        const supported = ['jpeg', 'png', 'webp'];
        if (!supported.includes((format || '').toLowerCase())) {
          return res.status(400).json({ success: false, error: `Formato não suportado: ${format}. Use jpeg, png ou webp.` });
        }
        const images = await documentToImageConverter(buffer, detectedInputFormat, format.toLowerCase());
        const archiver = (await import('archiver')).default;
        const archive = archiver('zip', { zlib: { level: 9 } });
        res.set('Content-Type', 'application/zip');
        res.set('Content-Disposition', 'attachment; filename="documento-imagens.zip"');
        archive.pipe(res);
        for (const image of images) {
          const pageLabel = getPageLabel(detectedInputFormat);
          archive.append(image.buffer, { name: `${pageLabel.toLowerCase()}-${image.pageNumber}.${format.toLowerCase()}` });
        }
        await archive.finalize();
      } catch (error) {
        console.error('Erro ao converter documento para imagens:', error);
        res.status(500).json({ success: false, error: 'Erro interno ao converter documento para imagens', details: error.message });
      }
    });
  });
}


