const sharp = require('sharp');

console.log("rodando"); 

module.exports = async function handler(req, res) {
  console.log("🚀 Nova requisição recebida em /api/compress-image");
  console.log("➡️ Método:", req.method);

  // CORS básico
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    console.log("✅ Resposta OPTIONS enviada");
    res.status(200).end();
    return;
  }
  
  // Verificar método
  if (req.method !== 'POST') {
    console.log("❌ Método não permitido:", req.method);
    res.setHeader('Allow', 'POST');  
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  
  try {
    console.log("📦 Processando POST request...");
    // Aqui você ainda não usa o sharp, só retorna uma resposta de teste
    res.status(200).json({ 
      message: 'API compress-image funcionando! 🚀',
      method: req.method,
      timestamp: new Date().toISOString()
    });
    console.log("✅ Resposta enviada com sucesso");
    
  } catch (err) {
    console.error("🔥 Erro no handler:", err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
