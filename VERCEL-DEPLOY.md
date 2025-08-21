# Deploy na Vercel - Instruções

## ✅ Estrutura Corrigida

Agora todos os endpoints seguem o formato correto da Vercel:

```javascript
export default async function handler(req, res) {
  // Verifica método HTTP
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  
  // Lógica do endpoint...
}
```

## 🚀 Como Fazer Deploy

### 1. Conectar Repositório
- Vá para [vercel.com](https://vercel.com)
- Conecte seu repositório GitHub
- **IMPORTANTE**: Configure o **Root Directory** como a raiz do projeto (onde está o `vercel.json`)

### 2. Configuração do Projeto
- **Framework Preset**: `Other`
- **Root Directory**: `/` (raiz)
- **Build Command**: deixe vazio
- **Output Directory**: deixe vazio

### 3. Variáveis de Ambiente (Opcional)
```bash
CORS_ORIGIN=https://seu-dominio.vercel.app,http://localhost:3000
ADMIN_EMAIL=seu-email@gmail.com
GMAIL_USER=seu-email@gmail.com
GMAIL_PASS=sua-senha-de-app
```

## 📁 Estrutura dos Arquivos

```
/
├── api/                    # ✅ Endpoints serverless da Vercel
│   ├── merge-pdfs.js
│   ├── convert-image.js
│   ├── compress-image.js
│   ├── resize-image.js
│   ├── edit-pdf.js
│   ├── pdf-to-document.js
│   ├── pdf-to-images.js
│   ├── images-to-pdf.js
│   ├── convert-document.js
│   ├── convert-documents-batch.js
│   ├── temp-store.js
│   ├── batch-download.js
│   ├── recover-document.js
│   ├── generate-qr-code.js
│   ├── notify-ia-tools.js
│   ├── contato.js
│   ├── generate-pdf.js
│   ├── generate-combined-pdf.js
│   ├── ocr-process.js
│   ├── add-pdf-password.js
│   ├── remove-pdf-password.js
│   └── test.js
├── server/                 # ✅ Backend local (não usado na Vercel)
├── frontend/              # ✅ Frontend Vue.js
├── vercel.json            # ✅ Configuração da Vercel
├── package.json           # ✅ Dependências da Vercel
└── README.md
```

## 🔧 Teste dos Endpoints

### Endpoint de Teste
```bash
curl https://seu-projeto.vercel.app/api/test
```

### Endpoint de Compressão
```bash
curl -X POST https://seu-projeto.vercel.app/api/compress-image \
  -F "image=@imagem.jpg" \
  -F "quality=80" \
  -F "format=jpeg"
```

## ❌ Problemas Comuns

### 1. Erro 405 Method Not Allowed
- ✅ **Corrigido**: Todos os endpoints agora verificam `req.method`
- ✅ **Corrigido**: Headers `Allow` configurados corretamente

### 2. Erro 404 Not Found
- ✅ **Corrigido**: Arquivos estão na pasta `api/` na raiz
- ✅ **Corrigido**: `vercel.json` configurado para `api/**/*.js`

### 3. Problemas de CORS
- ✅ **Corrigido**: CORS configurado em todos os endpoints
- ✅ **Configurável**: Via variável `CORS_ORIGIN`

### 4. Problemas de Upload
- ✅ **Corrigido**: Multer configurado corretamente
- ✅ **Corrigido**: Limite de 50MB configurado

## 🎯 Resultado Esperado

Após o deploy, você deve conseguir acessar:

- `https://seu-projeto.vercel.app/api/test` → GET funcionando
- `https://seu-projeto.vercel.app/api/compress-image` → POST funcionando
- `https://seu-projeto.vercel.app/api/merge-pdfs` → POST funcionando
- E todos os outros endpoints...

## 🔄 Desenvolvimento Local

Para desenvolvimento local, continue usando:

```bash
cd server
npm install
npm start
```

O frontend continuará funcionando com `http://localhost:3000` para desenvolvimento local.

## 📝 Notas Importantes

1. **`add-pdf-password`**: Retorna 501 (não implementado) na Vercel
2. **Dependências**: Todas as dependências estão no `package.json` da raiz
3. **Runtime**: Node.js 18.x configurado na Vercel
4. **Timeout**: Funções serverless têm timeout padrão da Vercel
