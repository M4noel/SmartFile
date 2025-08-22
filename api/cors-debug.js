/**
 * Endpoint de diagnóstico para problemas de CORS e métodos HTTP
 * Este endpoint aceita qualquer método HTTP e retorna informações detalhadas
 * sobre a requisição para ajudar a diagnosticar problemas.
 */

const { corsMiddleware, sendJson } = require('./utils/cors-middleware.js');

module.exports = async function handler(req, res) {
  // Configurar CORS para aceitar qualquer método e origem
  const corsOptions = {
    origins: '*',
    methods: 'GET,POST,PUT,DELETE,OPTIONS,HEAD,PATCH',
    headers: '*',
    credentials: true,
    maxAge: '86400'
  };
  
  // Aplicar middleware CORS (aceita qualquer método)
  const middleware = corsMiddleware(corsOptions);
  if (middleware(req, res)) return;
  
  // Capturar headers da requisição
  const headers = {};
  Object.keys(req.headers).forEach(key => {
    headers[key] = req.headers[key];
  });
  
  // Capturar informações da URL
  const url = new URL(req.url, `https://${req.headers.host || 'localhost'}`);
  const queryParams = {};
  url.searchParams.forEach((value, key) => {
    queryParams[key] = value;
  });
  
  // Preparar resposta de diagnóstico
  const diagnosticInfo = {
    success: true,
    message: 'CORS Debug Endpoint',
    request: {
      method: req.method,
      url: req.url,
      path: url.pathname,
      query: queryParams,
      headers: headers
    },
    cors: {
      origin: req.headers.origin || 'Não especificado',
      allowedOrigin: res.getHeader('Access-Control-Allow-Origin'),
      allowedMethods: res.getHeader('Access-Control-Allow-Methods'),
      allowedHeaders: res.getHeader('Access-Control-Allow-Headers'),
      maxAge: res.getHeader('Access-Control-Max-Age')
    },
    help: {
      possibleIssues: [
        'Origem não permitida no CORS',
        'Método HTTP não permitido',
        'Headers não permitidos',
        'Credenciais não permitidas',
        'Configuração incorreta no vercel.json'
      ],
      solutions: [
        'Verifique se a origem da requisição está na lista de origens permitidas',
        'Verifique se o método HTTP está sendo permitido',
        'Verifique se todos os headers necessários estão sendo permitidos',
        'Verifique se as credenciais estão sendo permitidas corretamente',
        'Verifique se o vercel.json está configurado corretamente'
      ]
    },
    timestamp: new Date().toISOString(),
    environment: {
      nodeEnv: process.env.NODE_ENV || 'development',
      corsOrigin: process.env.CORS_ORIGIN || 'Não configurado'
    }
  };
  
  // Enviar resposta detalhada
  return sendJson(res, 200, diagnosticInfo);
};