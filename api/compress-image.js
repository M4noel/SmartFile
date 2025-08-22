// API de compressão de imagem para Vercel
// Versão simplificada para teste

module.exports = async (req, res) => {
  console.log('🚀 API compress-image chamada');
  console.log('📋 Método:', req.method);
  console.log('🔗 URL:', req.url);
  
  // CORS básico
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight OPTIONS
  if (req.method === 'OPTIONS') {
    console.log('✅ Respondendo OPTIONS');
    res.status(200).end();
    return;
  }
  
  // Verificar método
  if (req.method !== 'POST') {
    console.log('❌ Método não permitido:', req.method);
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ 
      error: 'Method Not Allowed',
      allowed: 'POST',
      received: req.method
    });
  }
  
  try {
    console.log('📦 Processando POST request...');
    
    // Resposta de teste simples
    const response = {
      success: true,
      message: 'API compress-image funcionando perfeitamente! 🎉',
      method: req.method,
      url: req.url,
      timestamp: new Date().toISOString(),
      status: 'OK'
    };
    
    console.log('✅ Enviando resposta:', response);
    res.status(200).json(response);
    
  } catch (error) {
    console.error('🔥 Erro no handler:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
};
