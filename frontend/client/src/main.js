// src/main.js

import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/main.css'; // seu CSS personalizado

import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // melhor manter o router em src/router/index.js
import axios from 'axios';
import { createHead } from '@vueuse/head';

// --- Configuração do Axios ---
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || ''; 
// Se VITE_API_BASE_URL não estiver definida, usa mesma origem

// Interceptor global de erros do Axios
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    let errorMessage = 'Ocorreu um erro inesperado. Por favor, tente novamente.';
    let errorTitle = 'Erro';

    if (error.response) {
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
      errorTitle = 'Sem Conexão';
      errorMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão.';
    }

    if (window.showNotification) {
      window.showNotification.error(errorTitle, errorMessage, 8000);
    }

    console.error('Erro na requisição:', errorTitle, errorMessage, error);

    return Promise.reject(error); 
  }
);

// --- Configuração do Vue ---
const head = createHead();

createApp(App)
  .use(router)
  .use(head)
  .mount('#app');
