# 🚀 Deploy Completo - SmartFiles

## 🎯 Opções de Deploy

### 1️⃣ Frontend + Backend na Vercel (Limitado)
- ✅ Frontend: SPA Vue.js + Analytics
- ⚠️ Backend: APIs básicas (sem qpdf)
- 💰 Gratuito para ambos

### 2️⃣ Frontend Vercel + Backend Render (Recomendado)
- ✅ Frontend: SPA Vue.js + Analytics
- ✅ Backend: Funcionalidades completas
- 💰 Frontend: Gratuito | Backend: $7/mês

### 3️⃣ Frontend Vercel + Backend Railway
- ✅ Frontend: SPA Vue.js + Analytics
- ✅ Backend: Funcionalidades completas
- 💰 Frontend: Gratuito | Backend: $5/mês

## 🚀 Deploy Híbrido (Recomendado)

### Passo 1: Frontend na Vercel

1. **Acesse [vercel.com](https://vercel.com)**
2. **New Project** → Import GitHub
3. **Configure:**
   ```
   Root Directory: frontend/client
   Build Command: npm run build
   Output Directory: dist
   ```
4. **Variáveis de Ambiente:**
   ```
   VITE_API_BASE_URL=https://seu-backend.render.com
   ```
5. **Deploy!**

### Passo 2: Backend no Render

1. **Acesse [render.com](https://render.com)**
2. **New +** → Web Service
3. **Configure:**
   ```
   Name: smartfiles-backend
   Root Directory: server
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
   ```
5. **Deploy!**

### Passo 3: Conectar Frontend e Backend

1. **Copie a URL do backend** (ex: `https://smartfiles-backend.onrender.com`)
2. **Vá para Vercel** → Settings → Environment Variables
3. **Atualize:**
   ```
   VITE_API_BASE_URL: https://smartfiles-backend.onrender.com
   ```
4. **Redeploy** do frontend

## 🔧 Configurações Específicas

### Frontend (Vercel)
```json
// vercel.json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Backend (Render)
```json
// package.json
{
  "scripts": {
    "start": "node app.js"
  }
}
```

## 📊 URLs Finais

Após o deploy:
- **Frontend**: `https://smartfiles.vercel.app`
- **Backend**: `https://smartfiles-backend.onrender.com`
- **API**: `https://smartfiles-backend.onrender.com/api/*`

## 🚨 Troubleshooting

### Frontend não carrega
- ✅ Verifique se o build foi gerado
- ✅ Confirme `vercel.json` está configurado
- ✅ Teste localmente com `npm run build`

### Backend não responde
- ✅ Verifique logs no Render
- ✅ Confirme variáveis de ambiente
- ✅ Teste localmente com `npm start`

### API não conecta
- ✅ Configure `VITE_API_BASE_URL` corretamente
- ✅ Verifique CORS no backend
- ✅ Teste API diretamente no navegador

## 💰 Custos Estimados

### Vercel (Frontend)
- **Hobby**: Gratuito
- **Pro**: $20/mês (domínios customizados)

### Render (Backend)
- **Free**: $0/mês (15 min timeout)
- **Starter**: $7/mês (sem timeout)

### Total Recomendado
- **Mensal**: $7-27/mês
- **Anual**: $84-324/ano

## 🎯 Próximos Passos

1. ✅ **Deploy Frontend** na Vercel
2. ✅ **Deploy Backend** no Render
3. ✅ **Conectar** frontend e backend
4. ✅ **Testar** todas as funcionalidades
5. ✅ **Configurar** domínio customizado (opcional)

---

## 🎉 Deploy Completo Configurado!

**SmartFiles está pronto para ir ao ar com:**
- 🌐 Frontend otimizado na Vercel
- 📊 Analytics integrado
- 🔧 Backend completo no Render
- 🚀 Performance máxima
- 💰 Custo baixo

**Escolha a opção que melhor se adapta às suas necessidades! 🚀**
