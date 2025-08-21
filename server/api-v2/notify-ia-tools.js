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
      const { email, feature } = req.body || {};
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
          // ignore send error to not block UX
        }
      }
      return res.json({ success: true });
    } catch (error) {
      return res.status(500).json({ success: false, error: 'Erro interno' });
    }
  });
}


