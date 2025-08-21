// Utilitários para notificações
export const notificationUtils = {
  // Sucesso
  success: (title, message, duration = 5000) => {
    if (window.showNotification) {
      window.showNotification.success(title, message, duration);
    }
  },

  // Erro
  error: (title, message, duration = 8000) => {
    if (window.showNotification) {
      window.showNotification.error(title, message, duration);
    }
  },

  // Aviso
  warning: (title, message, duration = 6000) => {
    if (window.showNotification) {
      window.showNotification.warning(title, message, duration);
    }
  },

  // Informação
  info: (title, message, duration = 5000) => {
    if (window.showNotification) {
      window.showNotification.info(title, message, duration);
    }
  },

  // Notificações específicas para operações comuns
  fileUploadSuccess: (filename) => {
    notificationUtils.success(
      'Arquivo Enviado!',
      `${filename} foi processado com sucesso.`,
      4000
    );
  },

  fileUploadError: (filename, error) => {
    notificationUtils.error(
      'Erro no Upload',
      `Não foi possível processar ${filename}. ${error}`,
      8000
    );
  },

  processingStart: (operation) => {
    notificationUtils.info(
      'Processando...',
      `${operation} em andamento. Aguarde um momento.`,
      3000
    );
  },

  processingComplete: (operation) => {
    notificationUtils.success(
      'Concluído!',
      `${operation} foi finalizado com sucesso.`,
      4000
    );
  },

  downloadReady: (filename) => {
    notificationUtils.success(
      'Download Pronto!',
      `${filename} está pronto para download.`,
      5000
    );
  },

  validationError: (field, message) => {
    notificationUtils.warning(
      'Dados Inválidos',
      `${field}: ${message}`,
      6000
    );
  },

  networkError: () => {
    notificationUtils.error(
      'Sem Conexão',
      'Verifique sua conexão com a internet e tente novamente.',
      8000
    );
  },

  serverError: () => {
    notificationUtils.error(
      'Erro do Servidor',
      'Ocorreu um erro interno. Tente novamente em alguns instantes.',
      8000
    );
  }
};

// Função para substituir alert() facilmente
export const replaceAlert = (message, type = 'info', title = 'Aviso') => {
  switch (type) {
    case 'success':
      notificationUtils.success(title, message);
      break;
    case 'error':
      notificationUtils.error(title, message);
      break;
    case 'warning':
      notificationUtils.warning(title, message);
      break;
    default:
      notificationUtils.info(title, message);
  }
};

// Função para notificações de erro de API
export const handleApiError = (error, customMessage = null) => {
  let title = 'Erro';
  let message = customMessage;

  if (!message) {
    if (error.response) {
      // Erro do servidor
      if (error.response.status === 400) {
        title = 'Dados Inválidos';
        message = 'Verifique as informações enviadas e tente novamente.';
      } else if (error.response.status === 404) {
        title = 'Não Encontrado';
        message = 'O recurso solicitado não foi encontrado.';
      } else if (error.response.status === 500) {
        title = 'Erro do Servidor';
        message = 'Erro interno do servidor. Tente novamente mais tarde.';
      } else {
        message = error.response.data?.error || 'Ocorreu um erro inesperado.';
      }
    } else if (error.request) {
      // Sem resposta do servidor
      title = 'Sem Conexão';
      message = 'Não foi possível conectar ao servidor. Verifique sua conexão.';
    } else {
      // Erro na requisição
      message = error.message || 'Ocorreu um erro inesperado.';
    }
  }

  notificationUtils.error(title, message);
};

export default notificationUtils;

