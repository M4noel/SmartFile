import tempStorageModule from '../server/utils/tempStorage.js';
import { setupCORS, handlePreflight, parseRequestBody } from './utils/multipart.js';

export default async function handler(req, res) {
  // Configurar CORS
  setupCORS(res, process.env.CORS_ORIGIN?.split(',') || '*');
  
  // Handle preflight request
  if (handlePreflight(req, res)) return;
  
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  
  try {
    const buffer = await parseRequestBody(req);
    const body = buffer.toString();
    
    // Parse JSON body
    let fileIds;
    try {
      const data = JSON.parse(body);
      fileIds = data.fileIds;
    } catch (e) {
      return res.status(400).json({ success: false, error: 'Body deve ser JSON válido' });
    }
    
    const files = [];
    for (const fileId of fileIds || []) {
      try {
        const file = await tempStorageModule.retrieveFile(fileId);
        files.push(file);
      } catch (e) {
        // skip
      }
    }
    
    if (files.length === 0) {
      return res.status(404).json({ success: false, error: 'Nenhum arquivo encontrado' });
    }
    
    const zipBuffer = await tempStorageModule.createZipArchive(files);
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="arquivos-processados.zip"');
    res.send(zipBuffer);
    
  } catch (error) {
    console.error('Erro ao criar download em lote:', error);
    res.status(500).json({ success: false, error: 'Erro interno ao criar download em lote', details: error.message });
  }
}


