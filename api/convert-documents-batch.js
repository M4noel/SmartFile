import multer from 'multer';
import cors from 'cors';
import path from 'path';
import { convertDocument, detectFormat } from '../server/utils/documentConverter.js';

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

export default async function handler(req, res) {
  cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*' })(req, res, async () => {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
    upload.array('files')(req, res, async (err) => {
      if (err) return res.status(400).json({ error: err.message });
      try {
        if (!req.files || req.files.length === 0) return res.status(400).json({ success: false, error: 'Nenhum arquivo enviado' });
        const { outputFormat, quality } = req.body;
        const { SUPPORTED_OUTPUT_FORMATS } = await import('../server/utils/documentConverter.js');
        if (!SUPPORTED_OUTPUT_FORMATS.includes((outputFormat || '').toLowerCase())) {
          return res.status(400).json({ success: false, error: `Formato de saída não suportado: ${outputFormat}` });
        }
        const archiver = (await import('archiver')).default;
        const archive = archiver('zip', { zlib: { level: 9 } });
        res.set('Content-Type', 'application/zip');
        res.set('Content-Disposition', 'attachment; filename="documentos-convertidos.zip"');
        archive.pipe(res);
        for (const file of req.files) {
          try {
            const { buffer } = file;
            const filename = file.originalname;
            const detectedInputFormat = await detectFormat(buffer, filename);
            const convertedBuffer = await convertDocument(
              buffer,
              detectedInputFormat.toLowerCase(),
              outputFormat.toLowerCase(),
              { quality: parseInt(quality) || 80 }
            );
            const nameWithoutExt = path.basename(filename, path.extname(filename));
            archive.append(convertedBuffer, { name: `${nameWithoutExt}.${outputFormat.toLowerCase()}` });
          } catch (fileError) {
            console.error(`Erro ao converter arquivo ${file.originalname}:`, fileError);
          }
        }
        await archive.finalize();
      } catch (error) {
        console.error('Erro ao converter documentos em lote:', error);
        res.status(500).json({ success: false, error: 'Erro interno ao converter documentos em lote', details: error.message });
      }
    });
  });
}


