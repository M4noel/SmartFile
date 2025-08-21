# Página de Contato

## Visão Geral
A página de contato permite que os usuários enviem mensagens diretamente para o administrador do site através de um formulário profissional e responsivo.

## Funcionalidades

### 📧 Formulário de Contato
- **Nome**: Campo obrigatório para identificação
- **Email**: Campo obrigatório para resposta
- **Assunto**: Seleção de categoria da mensagem
- **Mensagem**: Campo obrigatório para o conteúdo

### 🎯 Categorias de Assunto
- Dúvida sobre ferramentas
- Reportar problema
- Sugestão
- Proposta de parceria
- Outro

### 📱 Design Responsivo
- Layout adaptável para mobile e desktop
- Cards informativos com ícones
- Seção de FAQ para dúvidas comuns

## Integração com Backend

### API Endpoint
```
POST /api/contato
```

### Dados Enviados
```json
{
  "nome": "Nome do usuário",
  "email": "email@exemplo.com",
  "assunto": "duvida",
  "mensagem": "Conteúdo da mensagem"
}
```

### Resposta
```json
{
  "success": true
}
```

## Configuração de Email

### Variáveis de Ambiente Necessárias
```bash
# Opção 1: SMTP Genérico
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-de-app
SMTP_FROM=seu-email@gmail.com

# Opção 2: Gmail (mais simples)
GMAIL_USER=seu-email@gmail.com
GMAIL_PASS=sua-senha-de-app
```

### Configuração do Gmail
1. Ative a verificação em 2 etapas
2. Gere uma "Senha de App" específica
3. Use essa senha no campo `GMAIL_PASS`

## Segurança

### Validações
- Todos os campos são obrigatórios
- Validação de formato de email
- Sanitização de dados no backend

### Rate Limiting
- Implementar rate limiting para evitar spam
- Log de todas as mensagens recebidas

## Monitoramento

### Logs
- Todas as mensagens são logadas no console
- Sucesso/falha no envio de emails
- Fallback para quando SMTP não está configurado

### Notificações
- Usa o sistema global de notificações
- Feedback visual para o usuário
- Limpeza automática do formulário após sucesso

## Personalização

### Cores e Estilos
- Cores consistentes com o tema do site
- Gradientes e sombras modernas
- Animações suaves de hover

### Conteúdo
- FAQ personalizável
- Informações de contato editáveis
- Mensagens de sucesso/erro customizáveis

## Troubleshooting

### Problemas Comuns
1. **Email não enviado**: Verificar configuração SMTP
2. **Erro de validação**: Verificar campos obrigatórios
3. **Problema de CORS**: Verificar configuração do backend

### Debug
- Verificar logs do console
- Testar endpoint da API separadamente
- Verificar variáveis de ambiente
