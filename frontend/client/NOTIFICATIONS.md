# 🔔 Sistema de Notificações - SmartFiles

## 🎯 Visão Geral

O sistema de notificações substitui todos os `alert()` por notificações elegantes e profissionais que aparecem no canto superior direito da tela.

## ✨ Características

- 🎨 **Design moderno** com animações suaves
- 📱 **Responsivo** para mobile e desktop
- 🎭 **4 tipos**: Sucesso, Erro, Aviso, Informação
- ⏰ **Auto-remoção** configurável
- 🖱️ **Clicável** para fechar manualmente
- 🌙 **Tema escuro** automático (se preferido pelo usuário)

## 🚀 Como Usar

### 1. Uso Básico

```javascript
// Sucesso
window.showNotification.success('Título', 'Mensagem de sucesso');

// Erro
window.showNotification.error('Erro', 'Algo deu errado');

// Aviso
window.showNotification.warning('Atenção', 'Cuidado com isso');

// Informação
window.showNotification.info('Info', 'Informação importante');
```

### 2. Com Duração Personalizada

```javascript
// Notificação que desaparece em 10 segundos
window.showNotification.success('Sucesso!', 'Operação concluída', 10000);

// Notificação que não desaparece automaticamente
window.showNotification.info('Importante', 'Leia com atenção', 0);
```

### 3. Usando Utilitários

```javascript
import { notificationUtils } from '@/utils/notifications';

// Notificações específicas para operações comuns
notificationUtils.fileUploadSuccess('documento.pdf');
notificationUtils.processingStart('Compressão de imagem');
notificationUtils.downloadReady('imagem-comprimida.jpg');
```

## 🔧 Integração em Componentes Vue

### 1. Usando Inject (Recomendado)

```vue
<script setup>
import { inject } from 'vue';

const showNotification = inject('showNotification');

const handleSuccess = () => {
  showNotification.success('Sucesso!', 'Operação concluída');
};
</script>
```

### 2. Usando Window Global

```vue
<script setup>
const handleError = () => {
  window.showNotification.error('Erro', 'Algo deu errado');
};
</script>
```

### 3. Usando Utilitários

```vue
<script setup>
import { handleApiError } from '@/utils/notifications';

const handleApiCall = async () => {
  try {
    await api.uploadFile(file);
    window.showNotification.success('Upload', 'Arquivo enviado!');
  } catch (error) {
    handleApiError(error);
  }
};
</script>
```

## 📱 Exemplos de Uso

### Upload de Arquivo

```javascript
const uploadFile = async (file) => {
  try {
    // Mostrar início do processamento
    window.showNotification.info('Processando...', 'Enviando arquivo...', 0);
    
    const result = await api.upload(file);
    
    // Sucesso
    window.showNotification.success('Sucesso!', `${file.name} foi enviado!`);
    
    return result;
  } catch (error) {
    // Erro
    window.showNotification.error('Erro no Upload', error.message);
    throw error;
  }
};
```

### Validação de Formulário

```javascript
const validateForm = () => {
  if (!email.value) {
    window.showNotification.warning('Campo Obrigatório', 'Email é obrigatório');
    return false;
  }
  
  if (!password.value) {
    window.showNotification.warning('Campo Obrigatório', 'Senha é obrigatória');
    return false;
  }
  
  return true;
};
```

### Operações de API

```javascript
const processData = async () => {
  try {
    // Início
    window.showNotification.info('Processando...', 'Aguarde um momento...', 0);
    
    const result = await api.process();
    
    // Sucesso
    window.showNotification.success('Concluído!', 'Dados processados com sucesso!');
    
    return result;
  } catch (error) {
    // Erro específico
    if (error.response?.status === 400) {
      window.showNotification.warning('Dados Inválidos', 'Verifique as informações');
    } else {
      window.showNotification.error('Erro', 'Ocorreu um erro inesperado');
    }
    throw error;
  }
};
```

## 🎨 Personalização

### Cores dos Tipos

- **Sucesso**: Verde (#10b981)
- **Erro**: Vermelho (#ef4444)
- **Aviso**: Amarelo (#f59e0b)
- **Informação**: Azul (#3b82f6)

### Posicionamento

```css
.notification-container {
  top: 20px;        /* Distância do topo */
  right: 20px;      /* Distância da direita */
  z-index: 9999;    /* Camada superior */
}
```

### Duração Padrão

- **Sucesso**: 5 segundos
- **Erro**: 8 segundos
- **Aviso**: 6 segundos
- **Informação**: 5 segundos

## 🚨 Substituindo Alert

### Antes (Alert)

```javascript
// ❌ Não usar mais
alert('Arquivo enviado com sucesso!');
alert('Erro ao processar arquivo');
```

### Depois (Notificações)

```javascript
// ✅ Usar notificações
window.showNotification.success('Sucesso!', 'Arquivo enviado com sucesso!');
window.showNotification.error('Erro', 'Erro ao processar arquivo');
```

## 📋 Lista de Substituições

### Mensagens de Sucesso
- ✅ `alert('Operação concluída')` → `showNotification.success('Sucesso!', 'Operação concluída')`
- ✅ `alert('Arquivo salvo')` → `showNotification.success('Salvo!', 'Arquivo salvo com sucesso')`

### Mensagens de Erro
- ❌ `alert('Erro no upload')` → `showNotification.error('Erro', 'Erro no upload')`
- ❌ `alert('Arquivo muito grande')` → `showNotification.warning('Atenção', 'Arquivo muito grande')`

### Mensagens de Informação
- ℹ️ `alert('Processando...')` → `showNotification.info('Processando...', 'Aguarde um momento')`
- ℹ️ `alert('Campo obrigatório')` → `showNotification.warning('Campo Obrigatório', 'Preencha todos os campos')`

## 🔄 Migração

### 1. Identificar Alerts
```bash
# Buscar por alert() no projeto
grep -r "alert(" src/
```

### 2. Substituir por Notificações
```javascript
// Antes
alert('Mensagem');

// Depois
window.showNotification.info('Título', 'Mensagem');
```

### 3. Testar
- Verificar se as notificações aparecem
- Confirmar que não há mais alerts
- Testar em diferentes dispositivos

---

## 🎉 Sistema Configurado!

**Agora você tem:**
- 🔔 Notificações profissionais em vez de alerts
- 🎨 Design moderno e responsivo
- 📱 Experiência de usuário melhorada
- 🚀 Sistema global e fácil de usar

**Substitua todos os `alert()` por notificações elegantes! 🚀**

