import './assets/main.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import router from './components/router';
import { createApp } from 'vue';
import App from './App.vue';
import axios from 'axios';
import { createHead } from '@vueuse/head';

// Configure Axios base URL from environment variable
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Global Axios error interceptor
axios.interceptors.response.use(
  response => response,
  error => {
    let errorMessage = 'Ocorreu um erro inesperado. Por favor, tente novamente.';
    let errorTitle = 'Erro';
    
    if (error.response) {
      // O servidor respondeu com um status fora do range 2xx
      if (error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error;
      } else if (error.response.status === 400) {
        errorTitle = 'Dados Inválidos';
        errorMessage = 'Verifique os dados enviados e tente novamente.';
      } else if (error.response.status === 404) {
        errorTitle = 'Não Encontrado';
        errorMessage = 'O recurso solicitado não foi encontrado.';
      } else if (error.response.status === 500) {
        errorTitle = 'Erro do Servidor';
        errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
      }
    } else if (error.request) {
      // A requisição foi feita, mas nenhuma resposta foi recebida
      errorTitle = 'Sem Conexão';
      errorMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão.';
    }

    // Mostrar notificação de erro
    if (window.showNotification) {
      window.showNotification.error(errorTitle, errorMessage, 8000);
    }
    
    // Log para desenvolvedores
    console.error('Erro na requisição:', errorTitle, errorMessage, error);
    
    return Promise.reject(new Error(errorMessage));
  }
);

const head = createHead();

createApp(App)
  .use(router)
  .use(head)
  .mount('#app');
