import cors from 'cors';
import nodemailer from 'nodemailer';

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
  cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*' })(req, res, async () => {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
    try {
      const { nome, email, assunto, mensagem } = req.body || {};
      if (!nome || !email || !assunto || !mensagem) return res.status(400).json({ success: false, error: 'Todos os campos são obrigatórios' });
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ success: false, error: 'Email inválido' });
      const adminRecipient = process.env.ADMIN_EMAIL || 'murilomanoel221@gmail.com';
      const subject = `Nova mensagem de contato: ${assunto}`;
      const text = `Mensagem recebida do formulário de contato do SmartFiles:\n\n` +
                   `Nome: ${nome}\n` +
                   `Email: ${email}\n` +
                   `Assunto: ${assunto}\n` +
                   `Mensagem:\n${mensagem}\n\n` +
                   `Data: ${new Date().toISOString()}`;
      const transporter = criarTransporter();
      if (transporter) {
        try {
          await transporter.sendMail({
            from: `"SmartFiles - Contato" <${process.env.SMTP_FROM || process.env.GMAIL_USER}>`,
            to: adminRecipient,
            subject,
            text
          });
        } catch (e) {
          // ignore send failure
        }
      }
      return res.json({ success: true });
    } catch (error) {
      return res.status(500).json({ success: false, error: 'Erro interno ao processar mensagem' });
    }
  });
}


