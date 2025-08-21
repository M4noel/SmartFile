# 🚀 SmartFiles - Ferramentas Inteligentes Online

**SmartFiles** é uma aplicação web completa com ferramentas online gratuitas para processamento de PDF, imagens e documentos.

## 📋 Funcionalidades

### 🖼️ Processamento de Imagens
- **Compressor de Imagens**: Reduza o tamanho sem perder qualidade
- **Conversor de Imagens**: Converta entre JPG, PNG, WEBP, etc.
- **Redimensionador**: Altere dimensões mantendo qualidade

### 📄 Processamento de PDFs
- **Unir PDFs**: Combine múltiplos arquivos em um documento
- **Editor de PDF**: Rotacione, divida, extraia páginas
- **Adicionar Senha**: Proteja seus PDFs com senha
- **Gerador de PDF**: Crie PDFs a partir de imagens

### 🔧 Ferramentas Avançadas
- **OCR Online**: Extraia texto de imagens/PDFs
- **Gerador QR Code**: Crie códigos QR personalizados
- **IA Tools**: Ferramentas de inteligência artificial

## 🏗️ Arquitetura

```
smartfiles/
├── frontend/client/     # Frontend Vue.js + Vite
├── server/              # Backend Node.js + Express
└── bin/                 # Binários (qpdf)
```

## 🚀 Deploy na Vercel

### Frontend (Vercel)
O frontend está configurado para deploy automático na Vercel.

**Configurações:**
- Framework: Vite + Vue.js
- Build Command: `npm run build`
- Output Directory: `dist`
- Root Directory: `frontend/client`

**Variáveis de Ambiente:**
```env
VITE_API_BASE_URL=https://seu-backend-url.com
```

### Backend (Vercel - Limitado)
O backend pode ser deployado na Vercel com algumas limitações.

**Configurações:**
- Framework: Node.js + Express
- Build Command: `npm install`
- Root Directory: `server`
- Runtime: `@vercel/node`

**Limitações:**
- ❌ Binários nativos (qpdf) não funcionam
- ❌ Processamento de arquivos limitado
- ❌ Tempo de execução máximo: 10s
- ✅ APIs básicas funcionam
- ✅ Email e funcionalidades simples

### Backend (Render/Railway - Recomendado)
Para funcionalidades completas, use Render ou Railway.

**Opções de Deploy:**
1. **Render**: Suporte a binários nativos
2. **Railway**: Deploy simples e rápido
3. **VPS**: Controle total sobre o ambiente

## 🔄 Deploy Híbrido (Recomendado)

### Estrutura Recomendada
```
Frontend: Vercel (SPA + Analytics)
Backend: Render/Railway (API completa)
```

### Vantagens
- ✅ Frontend otimizado na Vercel
- ✅ Analytics integrado
- ✅ Backend com todas as funcionalidades
- ✅ Sem limitações de binários
- ✅ Processamento completo de PDFs

## 📦 Instalação Local

### Frontend
```bash
cd frontend/client
npm install
npm run dev
```

### Backend
```bash
cd server
npm install
npm start
```

## 🔧 Configuração

### Variáveis de Ambiente (Backend)
```env
PORT=3000
CORS_ORIGIN=http://localhost:5173
SMTP_HOST=smtp.gmail.com
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-app
SMTP_FROM=no-reply@smartfiles.com
```

### Variáveis de Ambiente (Frontend)
```env
VITE_API_BASE_URL=<sua_url_backend>
```

## 🚀 Deploy Rápido

### 1. Frontend na Vercel
1. Conecte seu repositório na Vercel
2. Configure:
   - Root Directory: `frontend/client`
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Adicione `VITE_API_BASE_URL` nas variáveis de ambiente
4. Deploy!

### 2. Backend no Render
1. Crie uma nova Web Service no Render
2. Conecte seu repositório
3. Configure:
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Adicione as variáveis de ambiente
5. Deploy!

## 📁 Estrutura do Projeto

```
smartfiles/
├── frontend/
│   └── client/
│       ├── src/                    # Código fonte Vue.js
│       ├── public/                 # Arquivos públicos
│       ├── dist/                   # Build de produção
│       ├── vercel.json             # Configuração Vercel
│       ├── vite.config.js          # Configuração Vite
│       └── package.json            # Dependências frontend
├── server/
│   ├── routes/                     # Rotas da API
│   ├── utils/                      # Utilitários
│   ├── middlewares/                # Middlewares
│   ├── app.js                      # Servidor Express
│   └── package.json                # Dependências backend
├── bin/                            # Binários (qpdf)
├── .gitignore                      # Arquivos ignorados pelo Git
└── README.md                       # Este arquivo
```

## 📊 Analytics e Monitoramento

### Vercel Analytics
- **Métricas em tempo real**: Page views, visitantes únicos, duração de sessão
- **Performance**: Core Web Vitals, tempos de carregamento, taxas de erro
- **Usuários**: Localização geográfica, tipos de dispositivos, navegadores
- **SEO Insights**: Análise de comportamento para otimização

### Como acessar
1. Acesse [vercel.com](https://vercel.com)
2. Selecione seu projeto `smartfiles`
3. Vá para a aba "Analytics" ou "Insights"

---

## 🛠️ Tecnologias

### Frontend
- **Vue.js 3**: Framework JavaScript progressivo
- **Vite**: Build tool rápida
- **Vue Router**: Roteamento SPA
- **Axios**: Cliente HTTP
- **Bootstrap**: Framework CSS

### Backend
- **Node.js**: Runtime JavaScript
- **Express.js**: Framework web
- **Multer**: Upload de arquivos
- **Sharp**: Processamento de imagens
- **pdf-lib**: Manipulação de PDFs
- **node-qpdf**: Operações avançadas de PDF
- **Nodemailer**: Envio de emails

## 📊 Performance

- **Frontend**: Bundle otimizado com code splitting
- **Backend**: Processamento assíncrono de arquivos
- **Cache**: Headers de cache otimizados para assets
- **Compressão**: Gzip para todos os arquivos estáticos

## 🔒 Segurança

- **CORS**: Configurado para origens específicas
- **File Validation**: Validação de tipos e tamanhos
- **Rate Limiting**: Proteção contra spam
- **Security Headers**: Headers de segurança configurados

## 📈 SEO

- **Meta Tags**: Dinâmicas para cada página
- **Open Graph**: Suporte a redes sociais
- **Sitemap**: XML sitemap para indexação
- **Robots.txt**: Configuração para crawlers

## 🚨 Troubleshooting

### Erro 404 em rotas
- Verifique se o `vercel.json` está configurado
- Confirme que o build está na pasta `dist`

### API não conecta
- Configure `VITE_API_BASE_URL` corretamente
- Verifique se o backend está rodando

### Build falha
- Limpe `node_modules` e reinstale
- Verifique versão do Node.js (^20.x)

## 📞 Suporte

Para problemas específicos:
1. Verifique os logs de build na Vercel
2. Teste localmente com `npm run build`
3. Confirme configurações de ambiente

## 📄 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

---

**SmartFiles** - Ferramentas Inteligentes Online 🚀

*Desenvolvido com ❤️ para facilitar o processamento de arquivos online*
