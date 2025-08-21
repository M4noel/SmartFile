import nodemailer from 'nodemailer';
import { setupCORS, handlePreflight, parseRequestBody } from './utils/multipart.js';

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
    
    // Parse form data (simple key=value format)
    const formData = {};
    body.split('&').forEach(pair => {
      const [key, value] = pair.split('=');
      if (key && value) {
        formData[decodeURIComponent(key)] = decodeURIComponent(value);
      }
    });
    
    const { email, feature } = formData;
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, error: 'Email inválido' });
    }
    
    const adminRecipient = process.env.ADMIN_EMAIL || 'murilomanoel221@gmail.com';
    const subject = 'Novo interesse em IA Tools';
    const text = `\nUm usuário demonstrou interesse em IA Tools:\n\n📧 Email do usuário: ${email}\n🛠️ Recurso: ${feature || 'IA Tools'}\n📅 Data: ${new Date().toISOString()}\n`;
    
    const transporter = criarTransporter();
    if (transporter) {
      try {
        await transporter.sendMail({
          from: `"SmartFiles - Contato" <${process.env.SMTP_FROM || process.env.GMAIL_USER || 'no-reply@smartfiles.local'}>`,
          to: adminRecipient,
          subject,
          text,
          replyTo: email
        });
      } catch (err) {
        console.error('Erro ao enviar email:', err);
      }
    }
    
    return res.json({ success: true });
    
  } catch (error) {
    console.error('Erro ao processar notificação:', error);
    return res.status(500).json({ success: false, error: 'Erro interno' });
  }
}


