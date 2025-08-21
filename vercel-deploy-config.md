# ⚙️ Configuração Vercel - SmartFiles

## 🎯 Configurações do Projeto

### Frontend (Vercel)
```
Framework Preset: Vite
Root Directory: frontend/client
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### Variáveis de Ambiente
```
VITE_API_BASE_URL: https://seu-backend-url.render.com
```

## 📁 Estrutura para Vercel

```
smartfiles/
├── frontend/client/          ← Root Directory na Vercel
│   ├── src/                  # Código fonte
│   ├── public/               # Arquivos públicos
│   ├── dist/                 # Output Directory
│   ├── vercel.json           # Configuração Vercel
│   ├── vite.config.js        # Configuração Vite
│   ├── package.json          # Dependências
│   └── .vercelignore         # Arquivos ignorados
├── server/                   # Backend (deploy separado)
└── README.md                 # Documentação
```

## 🚀 Passos para Deploy

### 1. Push para GitHub
```bash
git add .
git commit -m "🚀 Configuração completa para deploy na Vercel"
git push origin main
```

### 2. Deploy na Vercel
1. Acesse [vercel.com](https://vercel.com)
2. Clique em "New Project"
3. Importe seu repositório `smartfiles`
4. Configure:
   - Root Directory: `frontend/client`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Adicione `VITE_API_BASE_URL` nas variáveis de ambiente
6. Clique em "Deploy"

### 3. Deploy do Backend
1. Use [Render](https://render.com) ou [Railway](https://railway.app)
2. Root Directory: `server`
3. Build Command: `npm install`
4. Start Command: `npm start`

## ✅ Verificações

- [ ] Frontend builda sem erros
- [ ] Todas as rotas funcionam (sem 404)
- [ ] Assets carregam corretamente
- [ ] API conecta com o backend
- [ ] SEO meta tags funcionam

## 🔧 Troubleshooting

### Erro 404 em rotas
- Verifique se `vercel.json` está em `frontend/client/`
- Confirme que o build está na pasta `dist`

### Build falha
- Verifique se está no Root Directory correto
- Confirme que `package.json` está em `frontend/client/`

### API não conecta
- Configure `VITE_API_BASE_URL` corretamente
- Verifique se o backend está rodando

---

**SmartFiles está pronto para deploy na Vercel! 🚀**

