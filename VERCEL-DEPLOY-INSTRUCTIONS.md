# 🚀 Deploy no Vercel - Instruções Completas

## ✅ O que foi corrigido

1. **Configuração do vercel.json principal** - Agora inclui build do frontend e APIs
2. **Conversão para CommonJS** - Todas as APIs foram convertidas de ES modules para CommonJS
3. **Estrutura de pastas** - Configurada corretamente para o Vercel
4. **Dependências** - Configuradas para funcionar no ambiente serverless

## 📁 Estrutura correta para o Vercel

```
/
├── vercel.json (configuração principal)
├── package.json (dependências das APIs)
├── api/ (todas as APIs serverless)
│   ├── compress-image.js
│   ├── health.js
│   └── utils/
├── frontend/client/ (aplicação Vue)
│   ├── package.json
│   ├── vercel.json (configuração específica do frontend)
│   └── src/
└── .vercelignore
```

## 🔧 Como fazer o deploy

### 1. Instalar Vercel CLI
```bash
npm i -g vercel
```

### 2. Fazer login
```bash
vercel login
```

### 3. Deploy
```bash
vercel --prod
```

### 4. Ou fazer deploy direto pelo GitHub
- Conecte seu repositório no Vercel
- Configure as variáveis de ambiente se necessário
- Faça push para a branch main

## 🧪 Testando após o deploy

### Teste da API
```bash
curl https://seu-dominio.vercel.app/api/health
```

### Teste do frontend
Acesse: `https://seu-dominio.vercel.app`

## 🔍 Troubleshooting

### Se a API não funcionar:
1. Verifique se o arquivo está em `/api/` (não em `/server/api/`)
2. Confirme que usa `module.exports` (não `export default`)
3. Verifique os logs no dashboard do Vercel

### Se o frontend não funcionar:
1. Confirme que o build foi bem-sucedido
2. Verifique se o `distDir` está correto no vercel.json
3. Teste a rota `/api/health` primeiro

### Se der erro de dependência:
1. Confirme que todas as dependências estão no `package.json` da raiz
2. Verifique se não há conflitos de versão
3. Use `npm install` na raiz antes do deploy

## 📝 Arquivos importantes

- **vercel.json** - Configuração principal do projeto
- **package.json** - Dependências das APIs
- **frontend/client/package.json** - Dependências do frontend
- **.vercelignore** - Arquivos a ignorar no deploy

## 🎯 Endpoints de teste

- `GET /api/health` - Status da API
- `GET /api/test` - Teste básico
- `POST /api/compress-image` - Compressão de imagem

## 💡 Dicas importantes

1. **Sempre teste localmente primeiro** com `vercel dev`
2. **Use o dashboard do Vercel** para ver logs e erros
3. **Configure variáveis de ambiente** se necessário
4. **Monitore o uso** das funções serverless
5. **Faça deploy em staging** antes de produção

## 🆘 Suporte

Se ainda houver problemas:
1. Verifique os logs no dashboard do Vercel
2. Teste endpoint por endpoint
3. Confirme que a estrutura de pastas está correta
4. Verifique se todas as dependências estão instaladas
