import multer from 'multer';
import cors from 'cors';
import pdfEditor, { addCommentAnnotations } from '../utils/pdfEditor.js';

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

export default async function handler(req, res) {
  cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*' })(req, res, async () => {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    upload.fields([{ name: 'pdf', maxCount: 1 }, { name: 'watermarkImage', maxCount: 1 }])(req, res, async (err) => {
      if (err) return res.status(400).json({ error: err.message });
      try {
        if (!req.files || !req.files.pdf) return res.status(400).json({ success: false, error: 'Arquivo PDF não enviado' });
        const pdfBuffer = req.files.pdf[0].buffer;
        const { operation } = req.body;
        let options = {};
        if (req.body.options && req.body.options !== 'undefined') options = JSON.parse(req.body.options);
        if (req.files.watermarkImage && req.files.watermarkImage[0]) options.watermarkImageBuffer = req.files.watermarkImage[0].buffer;
        let editedPdf;
        switch (operation) {
          case 'addAnnotations':
            if (!options.comments || !Array.isArray(options.comments) || options.comments.length === 0) {
              return res.status(400).json({ success: false, error: 'Campo comments é obrigatório para addAnnotations' });
            }
            editedPdf = await addCommentAnnotations(pdfBuffer, options.comments);
            break;
          case 'rotate':
            if (!options.rotations || !Array.isArray(options.rotations) || options.rotations.length === 0) {
              return res.status(400).json({ success: false, error: 'Campo rotations é obrigatório para rotate' });
            }
            editedPdf = await pdfEditor.rotatePages(pdfBuffer, options.rotations);
            break;
          case 'split':
            if (!options.splitPoints || !Array.isArray(options.splitPoints) || options.splitPoints.length === 0) {
              return res.status(400).json({ success: false, error: 'Campo splitPoints é obrigatório para split' });
            }
            // Return multiple PDFs as a zip file
            const pdfBuffers = await pdfEditor.splitPdf(pdfBuffer, options.splitPoints);
            const archiver = (await import('archiver')).default;
            const archive = archiver('zip', { zlib: { level: 9 } });
            res.set('Content-Type', 'application/zip');
            res.set('Content-Disposition', 'attachment; filename="pdf-partes.zip"');
            archive.pipe(res);
            for (let i = 0; i < pdfBuffers.length; i++) {
              archive.append(pdfBuffers[i], { name: `parte-${i + 1}.pdf` });
            }
            await archive.finalize();
            return;
          case 'extract':
            if (!options.pageNumbers || !Array.isArray(options.pageNumbers) || options.pageNumbers.length === 0) {
              return res.status(400).json({ success: false, error: 'Campo pageNumbers é obrigatório para extract' });
            }
            editedPdf = await pdfEditor.extractPages(pdfBuffer, options.pageNumbers);
            break;
          case 'watermark':
            if (!options.watermarkText && !options.watermarkImageBuffer) {
              return res.status(400).json({ success: false, error: 'Campo watermarkText ou watermarkImageBuffer é obrigatório para watermark' });
            }
            editedPdf = await pdfEditor.addWatermark(pdfBuffer, options.watermarkText, options);
            break;
          case 'removePages':
            if (!options.pagesToRemove || !Array.isArray(options.pagesToRemove) || options.pagesToRemove.length === 0) {
              return res.status(400).json({ success: false, error: 'Campo pagesToRemove é obrigatório para removePages' });
            }
            editedPdf = await pdfEditor.removePages(pdfBuffer, options.pagesToRemove);
            break;
          default:
            return res.status(400).json({ success: false, error: `Operação não suportada: ${operation}` });
        }
        return res.status(200).contentType('application/pdf').send(Buffer.from(editedPdf));
      } catch (err) {
        console.error('Erro ao processar PDF:', err);
        return res.status(500).json({ success: false, error: err.message });
      }
    });
  });
}


