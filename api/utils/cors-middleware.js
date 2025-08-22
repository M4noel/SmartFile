/**
 * Middleware CORS avançado para Vercel Serverless Functions
 * Implementa todas as recomendações de segurança e compatibilidade
 */

// Lista de origens permitidas (pode ser configurada via env)
const DEFAULT_ALLOWED_ORIGINS = '*';

// Lista completa de métodos HTTP
const DEFAULT_ALLOWED_METHODS = 'GET,POST,PUT,DELETE,OPTIONS,HEAD,PATCH';

// Lista completa de headers permitidos
const DEFAULT_ALLOWED_HEADERS = 'Content-Type,Authorization,X-Requested-With,Accept,Origin,Access-Control-Request-Method,Access-Control-Request-Headers';

// Tempo de cache para preflight (24 horas em segundos)
const DEFAULT_MAX_AGE = '86400';

/**
 * Configura CORS de forma robusta para qualquer endpoint
 * @param {Object} req - Objeto de requisição
 * @param {Object} res - Objeto de resposta
 * @param {Object} options - Opções de configuração
 * @returns {boolean} - true se for uma requisição OPTIONS tratada
 */
function setupCORS(req, res, options = {}) {
  const {
    origins = process.env.CORS_ORIGIN || DEFAULT_ALLOWED_ORIGINS,
    methods = process.env.CORS_METHODS || DEFAULT_ALLOWED_METHODS,
    headers = process.env.CORS_HEADERS || DEFAULT_ALLOWED_HEADERS,
    maxAge = process.env.CORS_MAX_AGE || DEFAULT_MAX_AGE,
    credentials = process.env.CORS_CREDENTIALS === 'true'
  } = options;

  // Determinar a origem permitida
  const requestOrigin = req.headers.origin;
  let allowOrigin = '*';

  // Se origens específicas foram configuradas
  if (origins && origins !== '*') {
    const allowedOrigins = Array.isArray(origins)
      ? origins
      : String(origins).split(',');
    
    const trimmedOrigins = allowedOrigins.map(o => o.trim()).filter(Boolean);
    
    if (requestOrigin && trimmedOrigins.includes(requestOrigin)) {
      allowOrigin = requestOrigin;
    } else if (trimmedOrigins.length > 0) {
      allowOrigin = trimmedOrigins[0];
    }
    
    // Adicionar Vary header para caching correto
    res.setHeader('Vary', 'Origin');
  }

  // Configurar headers CORS básicos
  res.setHeader('Access-Control-Allow-Origin', allowOrigin);
  
  // Configurar credentials se necessário
  if (credentials) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  
  // Configurar métodos permitidos
  res.setHeader('Access-Control-Allow-Methods', methods);
  
  // Configurar headers permitidos
  res.setHeader('Access-Control-Allow-Headers', headers);
  
  // Configurar max age para preflight
  res.setHeader('Access-Control-Max-Age', maxAge);

  // Tratar requisição OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    res.statusCode = 204; // No Content
    res.end();
    return true;
  }

  return false;
}

/**
 * Verifica se o método HTTP é permitido
 * @param {Object} req - Objeto de requisição
 * @param {Object} res - Objeto de resposta
 * @param {Array|string} allowedMethods - Métodos permitidos
 * @returns {boolean} - true se o método não for permitido
 */
function checkMethod(req, res, allowedMethods) {
  // Converter para array se for string
  const methods = Array.isArray(allowedMethods)
    ? allowedMethods
    : String(allowedMethods).split(',');
  
  // Adicionar OPTIONS automaticamente
  if (!methods.includes('OPTIONS')) {
    methods.push('OPTIONS');
  }
  
  // Verificar se o método é permitido
  if (!methods.includes(req.method)) {
    res.setHeader('Allow', methods.join(', '));
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      error: 'Method Not Allowed',
      allowedMethods: methods,
      method: req.method
    }));
    return true;
  }
  
  return false;
}

/**
 * Envia resposta JSON com status code
 * @param {Object} res - Objeto de resposta
 * @param {number} status - Status HTTP
 * @param {Object} data - Dados a serem enviados
 * @returns {boolean} - true sempre
 */
function sendJson(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
  return true;
}

/**
 * Middleware completo para CORS e verificação de método
 * @param {Object} options - Opções de configuração
 * @param {Array|string} options.methods - Métodos permitidos
 * @returns {Function} - Middleware function
 */
function corsMiddleware(options = {}) {
  const { methods = 'GET,POST,OPTIONS' } = options;
  
  return function(req, res) {
    // Configurar CORS e tratar preflight
    if (setupCORS(req, res, options)) {
      return true;
    }
    
    // Verificar método HTTP
    if (checkMethod(req, res, methods)) {
      return true;
    }
    
    return false;
  };
}

module.exports = {
  setupCORS,
  checkMethod,
  sendJson,
  corsMiddleware
};