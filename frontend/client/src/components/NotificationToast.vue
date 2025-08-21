<template>
  <div class="notification-container">
    <TransitionGroup name="notification" tag="div">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="[
          'notification-toast',
          `notification-${notification.type}`,
          { 'notification-show': notification.show }
        ]"
        @click="removeNotification(notification.id)"
      >
        <div class="notification-icon">
          <span v-if="notification.type === 'success'">✅</span>
          <span v-else-if="notification.type === 'error'">❌</span>
          <span v-else-if="notification.type === 'warning'">⚠️</span>
          <span v-else>ℹ️</span>
        </div>
        <div class="notification-content">
          <h4 class="notification-title">{{ notification.title }}</h4>
          <p class="notification-message">{{ notification.message }}</p>
        </div>
        <button class="notification-close" @click.stop="removeNotification(notification.id)">
          ×
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const notifications = ref([]);
let nextId = 1;

// Função para adicionar notificação
const addNotification = (type, title, message, duration = 5000) => {
  const id = nextId++;
  const notification = {
    id,
    type,
    title,
    message,
    show: false,
    timer: null
  };

  notifications.value.push(notification);

  // Mostrar com animação
  setTimeout(() => {
    notification.show = true;
  }, 100);

  // Auto-remover após duração
  if (duration > 0) {
    notification.timer = setTimeout(() => {
      removeNotification(id);
    }, duration);
  }

  return id;
};

// Função para remover notificação
const removeNotification = (id) => {
  const index = notifications.value.findIndex(n => n.id === id);
  if (index > -1) {
    const notification = notifications.value[index];
    
    // Limpar timer se existir
    if (notification.timer) {
      clearTimeout(notification.timer);
    }

    // Animar saída
    notification.show = false;
    
    // Remover após animação
    setTimeout(() => {
      notifications.value.splice(index, 1);
    }, 300);
  }
};

// Funções de conveniência
const success = (title, message, duration) => addNotification('success', title, message, duration);
const error = (title, message, duration) => addNotification('error', title, message, duration);
const warning = (title, message, duration) => addNotification('warning', title, message, duration);
const info = (title, message, duration) => addNotification('info', title, message, duration);

// Expor funções para uso global
defineExpose({
  success,
  error,
  warning,
  info,
  addNotification,
  removeNotification
});

// Limpar notificações ao desmontar
onMounted(() => {
  // Limpar notificações antigas a cada 30 segundos
  setInterval(() => {
    const now = Date.now();
    notifications.value = notifications.value.filter(n => {
      if (n.timer && now - n.createdAt > 30000) {
        clearTimeout(n.timer);
        return false;
      }
      return true;
    });
  }, 30000);
});
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  pointer-events: none;
}

.notification-toast {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  padding: 16px;
  margin-bottom: 12px;
  min-width: 320px;
  max-width: 400px;
  transform: translateX(100%);
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: auto;
  border-left: 4px solid transparent;
}

.notification-show {
  transform: translateX(0);
  opacity: 1;
}

.notification-success {
  border-left-color: #10b981;
}

.notification-error {
  border-left-color: #ef4444;
}

.notification-warning {
  border-left-color: #f59e0b;
}

.notification-info {
  border-left-color: #3b82f6;
}

.notification-icon {
  flex-shrink: 0;
  font-size: 20px;
  margin-top: 2px;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-title {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  line-height: 1.2;
}

.notification-message {
  margin: 0;
  font-size: 13px;
  color: #6b7280;
  line-height: 1.4;
}

.notification-close {
  background: none;
  border: none;
  color: #9ca3af;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
  flex-shrink: 0;
}

.notification-close:hover {
  background: #f3f4f6;
  color: #6b7280;
}

/* Animações */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.notification-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.notification-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* Responsivo */
@media (max-width: 480px) {
  .notification-container {
    top: 10px;
    right: 10px;
    left: 10px;
  }

  .notification-toast {
    min-width: auto;
    max-width: none;
  }
}

/* Tema escuro (opcional) */
@media (prefers-color-scheme: dark) {
  .notification-toast {
    background: #1f2937;
    color: white;
  }

  .notification-title {
    color: #f9fafb;
  }

  .notification-message {
    color: #d1d5db;
  }

  .notification-close:hover {
    background: #374151;
    color: #d1d5db;
  }
}
</style>

