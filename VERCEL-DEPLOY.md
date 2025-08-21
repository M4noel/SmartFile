# Deploy na Vercel - Instruções

## ✅ Estrutura Corrigida para Vercel

Agora todos os endpoints seguem o formato correto da Vercel **SEM** depender do Express:

```javascript
export default async function handler(req, res) {
  // CORS nativo
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Verifica método HTTP
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  
  // Lógica do endpoint usando Node.js nativo...
}
```

## 🔧 Principais Mudanças

### ❌ **Removido:**
- `multer` (middleware Express)
- `cors` (middleware Express)
- `req.body` (não existe em HTTP nativo)
- `req.file` (não existe em HTTP nativo)

### ✅ **Implementado:**
- Parse manual de `multipart/form-data`
- Parse manual de `application/x-www-form-urlencoded`
- CORS nativo com headers HTTP
- Handle de preflight requests
- Utilitários reutilizáveis em `api/utils/multipart.js`

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
│   ├── utils/
│   │   └── multipart.js   # ✅ Utilitários para parse de dados
│   ├── merge-pdfs.js      # ✅ Endpoint para merge de PDFs
│   ├── convert-image.js   # ✅ Endpoint para conversão de imagem
│   ├── compress-image.js  # ✅ Endpoint para compressão de imagem
│   ├── resize-image.js    # ✅ Endpoint para redimensionamento
│   ├── edit-pdf.js        # ✅ Endpoint para edição de PDF
│   ├── pdf-to-document.js # ✅ Endpoint para PDF → documento
│   ├── pdf-to-images.js   # ✅ Endpoint para PDF → imagens
│   ├── images-to-pdf.js   # ✅ Endpoint para imagens → PDF
│   ├── convert-document.js # ✅ Endpoint para conversão de documentos
│   ├── convert-documents-batch.js # ✅ Endpoint para conversão em lote
│   ├── temp-store.js      # ✅ Endpoint para armazenamento temporário
│   ├── batch-download.js  # ✅ Endpoint para download em lote
│   ├── recover-document.js # ✅ Endpoint para recuperação de documentos
│   ├── generate-qr-code.js # ✅ Endpoint para geração de QR codes
│   ├── notify-ia-tools.js # ✅ Endpoint para notificações de IA
│   ├── contato.js         # ✅ Endpoint para formulário de contato
│   ├── generate-pdf.js    # ✅ Endpoint para geração de PDFs
│   ├── generate-combined-pdf.js # ✅ Endpoint para PDFs combinados
│   ├── ocr-process.js     # ✅ Endpoint para processamento OCR
│   ├── add-pdf-password.js # ✅ Endpoint para adicionar senha (501)
│   ├── remove-pdf-password.js # ✅ Endpoint para remover senha
│   └── test.js            # ✅ Endpoint de teste
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

### Endpoint de Contato
```bash
curl -X POST https://seu-projeto.vercel.app/api/contato \
  -d "nome=Teste&email=teste@teste.com&assunto=Teste&mensagem=Teste"
```

## ❌ Problemas Comuns - RESOLVIDOS

### 1. Erro 405 Method Not Allowed
- ✅ **Corrigido**: Todos os endpoints agora verificam `req.method` corretamente
- ✅ **Corrigido**: Headers `Allow` configurados corretamente
- ✅ **Corrigido**: Sem dependência do Express

### 2. Erro 404 Not Found
- ✅ **Corrigido**: Arquivos estão na pasta `api/` na raiz
- ✅ **Corrigido**: `vercel.json` configurado para `api/**/*.js`

### 3. Problemas de CORS
- ✅ **Corrigido**: CORS implementado nativamente
- ✅ **Configurável**: Via variável `CORS_ORIGIN`

### 4. Problemas de Upload
- ✅ **Corrigido**: Parse manual de multipart implementado
- ✅ **Corrigido**: Sem dependência do Multer

## 🎯 Resultado Esperado

Após o deploy, você deve conseguir acessar:

- `https://seu-projeto.vercel.app/api/test` → GET funcionando
- `https://seu-projeto.vercel.app/api/compress-image` → POST funcionando
- `https://seu-projeto.vercel.app/api/contato` → POST funcionando
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
5. **Upload**: Parse manual de multipart implementado (sem Multer)
6. **CORS**: Implementado nativamente (sem middleware Express)

## 🚨 Diferenças Importantes

### Antes (Express):
```javascript
app.post('/compress', upload.single('image'), (req, res) => {
  const file = req.file;  // ❌ Não existe na Vercel
  const body = req.body;  // ❌ Não existe na Vercel
});
```

### Agora (Vercel):
```javascript
export default async function handler(req, res) {
  const buffer = await parseRequestBody(req);  // ✅ Parse manual
  const parts = parseMultipart(buffer, boundary);  // ✅ Parse multipart
  const imagePart = parts.find(part => part.name === 'image');  // ✅ Dados do arquivo
}
```
