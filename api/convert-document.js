import multer from 'multer';
import cors from 'cors';
import { convertDocument, detectFormat } from '../server/utils/documentConverter.js';

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
        const { inputFormat, outputFormat, quality } = req.body;
        const filename = req.file.originalname;
        const detectedInputFormat = inputFormat || await detectFormat(buffer, filename);
        const { SUPPORTED_INPUT_FORMATS, SUPPORTED_OUTPUT_FORMATS } = await import('../server/utils/documentConverter.js');
        if (!SUPPORTED_INPUT_FORMATS.includes(detectedInputFormat?.toLowerCase())) {
          return res.status(400).json({ success: false, error: `Formato de entrada não suportado: ${detectedInputFormat}` });
        }
        if (!SUPPORTED_OUTPUT_FORMATS.includes((outputFormat || '').toLowerCase())) {
          return res.status(400).json({ success: false, error: `Formato de saída não suportado: ${outputFormat}` });
        }
        const convertedBuffer = await convertDocument(
          buffer,
          detectedInputFormat.toLowerCase(),
          outputFormat.toLowerCase(),
          { quality: parseInt(quality) || 80 }
        );
        let contentType = 'application/octet-stream';
        let outputFilename = `documento-convertido.${outputFormat.toLowerCase()}`;
        switch (outputFormat.toLowerCase()) {
          case 'pdf': contentType = 'application/pdf'; outputFilename = 'documento.pdf'; break;
          case 'docx': contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'; outputFilename = 'documento.docx'; break;
          case 'xlsx': contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'; outputFilename = 'planilha.xlsx'; break;
          case 'pptx': contentType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation'; outputFilename = 'apresentacao.pptx'; break;
          case 'txt': contentType = 'text/plain'; outputFilename = 'documento.txt'; break;
          case 'csv': contentType = 'text/csv'; outputFilename = 'dados.csv'; break;
          case 'json': contentType = 'application/json'; outputFilename = 'dados.json'; break;
          case 'xml': contentType = 'application/xml'; outputFilename = 'documento.xml'; break;
          case 'html': contentType = 'text/html'; outputFilename = 'documento.html'; break;
          case 'md': contentType = 'text/markdown'; outputFilename = 'documento.md'; break;
          case 'jpg':
          case 'jpeg': contentType = 'image/jpeg'; outputFilename = 'imagem.jpg'; break;
          case 'png': contentType = 'image/png'; outputFilename = 'imagem.png'; break;
          case 'webp': contentType = 'image/webp'; outputFilename = 'imagem.webp'; break;
          case 'tiff': contentType = 'image/tiff'; outputFilename = 'imagem.tiff'; break;
        }
        res.set('Content-Type', contentType);
        res.set('Content-Disposition', `attachment; filename="${outputFilename}"`);
        res.send(convertedBuffer);
      } catch (error) {
        console.error('Erro ao converter documento:', error);
        res.status(500).json({ success: false, error: 'Erro interno ao converter documento', details: error.message });
      }
    });
  });
}


