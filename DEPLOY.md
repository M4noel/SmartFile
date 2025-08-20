# 🚀 Guia de Deploy - SmartFiles

Este guia te ajudará a fazer o deploy completo do SmartFiles na Vercel (frontend) e Render (backend).

## 📋 Pré-requisitos

- ✅ Conta na [Vercel](https://vercel.com)
- ✅ Conta no [Render](https://render.com) ou [Railway](https://railway.app)
- ✅ Repositório no GitHub
- ✅ Node.js 20.x instalado localmente

## 🎯 Passo a Passo

### 1️⃣ Preparar o Repositório

```bash
# Certifique-se de que está na raiz do projeto
cd smartfiles

# Adicionar todas as alterações
git add .

# Commit das configurações de deploy
git commit -m "🚀 Configuração completa para deploy na Vercel"

# Push para o GitHub
git push origin main
```

### 2️⃣ Deploy do Frontend na Vercel

1. **Acesse a Vercel:**
   - Vá para [vercel.com](https://vercel.com)
   - Faça login com sua conta GitHub

2. **Criar Novo Projeto:**
   - Clique em "New Project"
   - Importe seu repositório do GitHub
   - Selecione o repositório `smartfiles`

3. **Configurar o Projeto:**
   ```
   Framework Preset: Vite
   Root Directory: frontend/client
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Variáveis de Ambiente:**
   ```
   VITE_API_BASE_URL: https://seu-backend-url.render.com
   ```

5. **Deploy:**
   - Clique em "Deploy"
   - Aguarde o build completar (2-3 minutos)

### 3️⃣ Deploy do Backend no Render

1. **Acesse o Render:**
   - Vá para [render.com](https://render.com)
   - Faça login com sua conta GitHub

2. **Criar Novo Web Service:**
   - Clique em "New +"
   - Selecione "Web Service"
   - Conecte seu repositório GitHub

3. **Configurar o Serviço:**
   ```
   Name: smartfiles-backend
   Root Directory: server
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   ```

4. **Variáveis de Ambiente:**
   ```
   PORT: 10000
   CORS_ORIGIN: https://seu-frontend.vercel.app
   SMTP_HOST: smtp.gmail.com
   SMTP_USER: seu-email@gmail.com
   SMTP_PASS: sua-senha-app
   SMTP_FROM: no-reply@smartfiles.com
   ```

5. **Deploy:**
   - Clique em "Create Web Service"
   - Aguarde o deploy (5-10 minutos)

### 4️⃣ Configurar Domínios

#### Frontend (Vercel)
- ✅ Domínio automático: `seu-projeto.vercel.app`
- 🔗 Domínio customizado (opcional): `smartfiles.com.br`

#### Backend (Render)
- ✅ Domínio automático: `seu-backend.onrender.com`
- 🔗 Domínio customizado (opcional): `api.smartfiles.com.br`

### 5️⃣ Atualizar Frontend

Após o deploy do backend, atualize a variável de ambiente no frontend:

1. **Na Vercel:**
   - Vá para seu projeto
   - Settings → Environment Variables
   - Atualize `VITE_API_BASE_URL` com a URL do backend

2. **Redeploy:**
   - Vá para Deployments
   - Clique em "Redeploy" no último deploy

## 🔧 Configurações Específicas

### Vercel (Frontend)
- ✅ SPA routing configurado
- ✅ Headers de segurança
- ✅ Cache otimizado para assets
- ✅ Build otimizado com code splitting

### Render (Backend)
- ✅ Suporte a binários nativos (qpdf)
- ✅ Auto-scaling
- ✅ SSL automático
- ✅ Logs em tempo real

## 🚨 Troubleshooting

### Frontend não carrega
- ✅ Verifique se o build foi gerado na pasta `dist`
- ✅ Confirme que o `vercel.json` está configurado
- ✅ Teste localmente com `npm run build && npm run preview`

### Backend não responde
- ✅ Verifique os logs no Render
- ✅ Confirme que as variáveis de ambiente estão corretas
- ✅ Teste localmente com `npm start`

### API não conecta
- ✅ Configure `VITE_API_BASE_URL` corretamente
- ✅ Verifique se o CORS está configurado
- ✅ Teste a API diretamente no navegador

## 📊 Monitoramento

### Vercel Analytics
- Performance do frontend
- Métricas de usuários
- Análise de erros

### Render Logs
- Logs de aplicação em tempo real
- Métricas de performance
- Alertas de erro

## 🔄 Atualizações

Para atualizar o projeto:

```bash
# Fazer alterações no código
git add .
git commit -m "📝 Atualização do projeto"
git push origin main

# Deploy automático na Vercel e Render
```

## 📞 Suporte

### Vercel
- [Documentação](https://vercel.com/docs)
- [Comunidade](https://github.com/vercel/vercel/discussions)

### Render
- [Documentação](https://render.com/docs)
- [Suporte](https://render.com/support)

---

## 🎉 Deploy Concluído!

Após seguir todos os passos, você terá:

- 🌐 **Frontend**: `https://seu-projeto.vercel.app`
- 🔧 **Backend**: `https://seu-backend.onrender.com`
- 📱 **App funcionando** com todas as funcionalidades
- 🚀 **Performance otimizada** para produção
- 🔒 **Segurança** configurada
- 📈 **SEO** otimizado para Google

**SmartFiles está online e funcionando! 🚀**
