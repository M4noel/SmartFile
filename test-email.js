// Script para testar a configuração de email
// Execute com: node test-email.js

const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env.local' });

function criarTransporter() {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });
  } else if (process.env.GMAIL_USER && process.env.GMAIL_PASS) {
    return nodemailer.createTransporter({
      service: 'gmail',
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS }
    });
  }
  return null;
}

async function testarEmail() {
  console.log('🔧 Testando configuração de email...\n');
  
  console.log('📋 Variáveis de ambiente encontradas:');
  console.log({
    GMAIL_USER: !!process.env.GMAIL_USER ? '✅ Configurada' : '❌ Não configurada',
    GMAIL_PASS: !!process.env.GMAIL_PASS ? '✅ Configurada' : '❌ Não configurada',
    SMTP_FROM: !!process.env.SMTP_FROM ? '✅ Configurada' : '❌ Não configurada',
    ADMIN_EMAIL: !!process.env.ADMIN_EMAIL ? '✅ Configurada' : '❌ Não configurada'
  });
  
  const transporter = criarTransporter();
  
  if (!transporter) {
    console.log('\n❌ Erro: Transporter não pôde ser criado');
    console.log('Verifique se as variáveis GMAIL_USER e GMAIL_PASS estão configuradas no arquivo .env.local');
    return;
  }
  
  console.log('\n✅ Transporter criado com sucesso');
  
  try {
    console.log('📧 Testando conexão SMTP...');
    await transporter.verify();
    console.log('✅ Conexão SMTP verificada com sucesso');
    
    console.log('📨 Enviando email de teste...');
    const adminRecipient = process.env.ADMIN_EMAIL || 'murilomanoel221@gmail.com';
    
    const info = await transporter.sendMail({
      from: `"SmartFiles - Teste" <${process.env.SMTP_FROM || process.env.GMAIL_USER}>`,
      to: adminRecipient,
      subject: 'Teste de Configuração - SmartFiles',
      text: `Email de teste enviado com sucesso!\n\nData: ${new Date().toISOString()}\nConfigurações funcionando corretamente.`
    });
    
    console.log('✅ Email enviado com sucesso!');
    console.log('📨 ID da mensagem:', info.messageId);
    console.log('📬 Email enviado para:', adminRecipient);
    
  } catch (error) {
    console.log('\n❌ Erro ao testar email:');
    console.error({
      message: error.message,
      code: error.code,
      command: error.command
    });
    
    if (error.code === 'EAUTH') {
      console.log('\n💡 Dica: Verifique se você está usando uma "App Password" do Gmail, não a senha normal.');
      console.log('Como gerar: https://support.google.com/accounts/answer/185833');
    }
  }
}

testarEmail();
