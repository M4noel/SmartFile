const nodemailer = require('nodemailer');
const { setupCORS, handlePreflight, parseRequestBody, sendJson } = require('./utils/multipart.js');

function criarTransporter() {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });
  } else if (process.env.GMAIL_USER && process.env.GMAIL_PASS) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS }
    });
  }
  return null;
}

module.exports = async function handler(req, res) {
  // Configurar CORS
  setupCORS(req, res, process.env.CORS_ORIGIN?.split(',') || '*');
  
  // Handle preflight request
  if (handlePreflight(req, res)) return;
  
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { error: 'Method Not Allowed' });
  }
  
  try {
    console.log('🤖 Processando notificação IA Tools');
    console.log('Headers da requisição:', req.headers);
    
    const buffer = await parseRequestBody(req);
    const body = buffer.toString();
    console.log('Dados recebidos:', body);
    
    let formData = {};
    
    // Detectar o tipo de conteúdo e fazer parse apropriado
    const contentType = req.headers['content-type'] || '';
    
    if (contentType.includes('application/json')) {
      // Parse JSON
      try {
        formData = JSON.parse(body);
        console.log('✅ Dados parseados como JSON:', formData);
      } catch (e) {
        console.error('Erro ao fazer parse JSON:', e);
        return sendJson(res, 400, { success: false, error: 'Dados JSON inválidos' });
      }
    } else {
      // Parse form data (URL encoded)
      console.log('📝 Parseando como form-data');
      body.split('&').forEach(pair => {
        const [key, value] = pair.split('=');
        if (key && value) {
          formData[decodeURIComponent(key)] = decodeURIComponent(value.replace(/\+/g, ' '));
        }
      });
      console.log('✅ Dados parseados como form-data:', formData);
    }
    
    const { email, feature } = formData;
    
    console.log('📝 Validando dados:', { email: !!email, feature: feature || 'Não especificado' });
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      console.log('❌ Email inválido:', email);
      return sendJson(res, 400, { success: false, error: 'Email inválido' });
    }
    
    console.log('✅ Email válido, preparando notificação...');
    
    const adminRecipient = process.env.ADMIN_EMAIL || 'murilomanoel221@gmail.com';
    const subject = `🤖 Novo interesse em IA Tools - ${feature || 'IA Tools'}`;
    const text = `Novo interesse registrado no SmartFiles IA Tools!\n\n` +
                 `📧 Email do usuário: ${email}\n` +
                 `🛠️ Recurso interessado: ${feature || 'IA Tools'}\n` +
                 `📅 Data: ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}\n\n` +
                 `Responda para este email para entrar em contato diretamente.`;
    
    console.log('📨 Enviando notificação para:', adminRecipient);
    console.log('📝 Assunto:', subject);
    
    const transporter = criarTransporter();
    if (transporter) {
      try {
        console.log('🔧 Verificando conexão SMTP...');
        await transporter.verify();
        console.log('✅ Conexão SMTP verificada');
        
        const info = await transporter.sendMail({
          from: `"SmartFiles - IA Tools" <${process.env.SMTP_FROM || process.env.GMAIL_USER || 'no-reply@smartfiles.local'}>`,
          to: adminRecipient,
          subject,
          text,
          replyTo: email,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f0f8ff; border-radius: 10px;">
              <div style="background: linear-gradient(135deg, #2a75ff, #1a65e0); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
                <h1 style="margin: 0; font-size: 24px;">🤖 Novo Interesse - IA Tools</h1>
              </div>
              <div style="background-color: white; padding: 20px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
                <div style="background-color: #e3f2fd; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #2a75ff;">
                  <p style="margin: 0; color: #1976d2; font-weight: bold; font-size: 16px;">🎆 Alguém está interessado nas ferramentas de IA!</p>
                </div>
                
                <div style="margin-bottom: 15px;">
                  <strong style="color: #2c3e50;">📧 Email do interessado:</strong> 
                  <a href="mailto:${email}" style="color: #2a75ff; font-weight: bold;">${email}</a>
                </div>
                
                <div style="margin-bottom: 15px;">
                  <strong style="color: #2c3e50;">🛠️ Recurso de interesse:</strong> 
                  <span style="color: #34495e; background-color: #f8f9fa; padding: 4px 8px; border-radius: 4px; font-weight: bold;">${feature || 'IA Tools'}</span>
                </div>
                
                <div style="margin-bottom: 20px;">
                  <strong style="color: #2c3e50;">📅 Data do interesse:</strong> 
                  <span style="color: #34495e;">${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</span>
                </div>
                
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #28a745;">
                  <p style="margin: 0; color: #28a745; font-weight: bold;">💬 Ação recomendada:</p>
                  <p style="margin: 10px 0 0; color: #34495e;">Responda para este email para entrar em contato diretamente com o interessado!</p>
                </div>
              </div>
            </div>
          `
        });
        
        console.log('✅ Email enviado com sucesso!');
        console.log('📨 Message ID:', info.messageId);
        
      } catch (err) {
        console.error('❌ Erro detalhado ao enviar email IA Tools:');
        console.error({
          message: err.message,
          code: err.code,
          command: err.command,
          response: err.response,
          responseCode: err.responseCode
        });
        
        if (err.code === 'EAUTH') {
          console.log('💡 Dica: Verifique se está usando uma "App Password" do Gmail');
        }
        
        console.log('⚠️ Interesse registrado localmente apesar do erro de email');
      }
    } else {
      console.warn('⚠️ Transporter não configurado - verifique as variáveis de ambiente');
      console.log('Variáveis disponíveis:', {
        GMAIL_USER: !!process.env.GMAIL_USER,
        GMAIL_PASS: !!process.env.GMAIL_PASS,
        SMTP_HOST: !!process.env.SMTP_HOST,
        ADMIN_EMAIL: !!process.env.ADMIN_EMAIL
      });
    }
    
    return sendJson(res, 200, { success: true });
    
  } catch (error) {
    console.error('Erro ao processar notificação:', error);
    return sendJson(res, 500, { success: false, error: 'Erro interno' });
  }
}


