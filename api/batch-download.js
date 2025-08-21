import cors from 'cors';
import tempStorageModule from '../server/utils/tempStorage.js';

export default async function handler(req, res) {
  cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*' })(req, res, async () => {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
    try {
      const { fileIds } = req.body || {};
      const files = [];
      for (const fileId of fileIds || []) {
        try {
          const file = await tempStorageModule.retrieveFile(fileId);
          files.push(file);
        } catch (e) {
          // skip
        }
      }
      if (files.length === 0) return res.status(404).json({ success: false, error: 'Nenhum arquivo encontrado' });
      const zipBuffer = await tempStorageModule.createZipArchive(files);
      res.set('Content-Type', 'application/zip');
      res.set('Content-Disposition', 'attachment; filename="arquivos-processados.zip"');
      res.send(zipBuffer);
    } catch (error) {
      console.error('Erro ao criar download em lote:', error);
      res.status(500).json({ success: false, error: 'Erro interno ao criar download em lote', details: error.message });
    }
  });
}


