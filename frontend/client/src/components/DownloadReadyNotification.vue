<template>
  <Teleport to="body">
    <div v-if="show" class="download-ready-overlay" @click="handleOverlayClick">
      <div class="download-ready-modal" @click.stop>
        <div class="success-header">
          <div class="success-icon">🎉</div>
          <h3>Download Liberado!</h3>
        </div>
        
        <div class="notification-body">
          <p class="success-message">
            Obrigado por clicar no anúncio! 🙏
          </p>
          <p class="file-info">
            Seu arquivo <strong>{{ fileName }}</strong> está pronto para download.
          </p>
          
          <div class="unlock-status">
            <div class="status-indicator">✅</div>
            <div class="status-text">
              <span>Downloads liberados por {{ Math.floor(timeRemaining / 60) }} minutos</span>
              <small>Você pode baixar outros arquivos sem esperar!</small>
            </div>
          </div>
        </div>
        
        <div class="notification-actions">
          <button @click="startDownload" class="download-now-btn">
            🚀 Fazer Download Agora
          </button>
          <button @click="closeNotification" class="close-btn-secondary">
            Fechar
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  fileName: {
    type: String,
    default: 'arquivo'
  },
  timeRemaining: {
    type: Number,
    default: 600 // 10 minutos em segundos
  }
})

const emit = defineEmits(['close', 'download'])

const autoCloseTimer = ref(null)

const closeNotification = () => {
  emit('close')
}

const startDownload = () => {
  emit('download')
  closeNotification()
}

const handleOverlayClick = () => {
  closeNotification()
}

// Auto-fechar após 10 segundos se não interagir
onMounted(() => {
  if (props.show) {
    autoCloseTimer.value = setTimeout(() => {
      closeNotification()
    }, 10000)
  }
})

onUnmounted(() => {
  if (autoCloseTimer.value) {
    clearTimeout(autoCloseTimer.value)
  }
})
</script>

<style scoped>
.download-ready-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  backdrop-filter: blur(3px);
}

.download-ready-modal {
  background: white;
  border-radius: 20px;
  width: 90%;
  max-width: 450px;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
  animation: modalBounceIn 0.5s ease-out;
}

@keyframes modalBounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3) translateY(-100px);
  }
  50% {
    opacity: 1;
    transform: scale(1.05) translateY(0);
  }
  100% {
    transform: scale(1);
  }
}

.success-header {
  background: linear-gradient(135deg, #28a745, #20c997);
  color: white;
  padding: 2rem;
  text-align: center;
}

.success-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

.success-header h3 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.notification-body {
  padding: 2rem;
  text-align: center;
}

.success-message {
  color: #28a745;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.file-info {
  color: #333;
  font-size: 1rem;
  margin-bottom: 1.5rem;
}

.file-info strong {
  color: #2c3e50;
}

.unlock-status {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 12px;
  border-left: 4px solid #28a745;
}

.status-indicator {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.status-text {
  text-align: left;
  flex: 1;
}

.status-text span {
  display: block;
  font-weight: 600;
  color: #28a745;
  margin-bottom: 0.25rem;
}

.status-text small {
  color: #6c757d;
  font-style: italic;
}

.notification-actions {
  padding: 1.5rem 2rem;
  display: flex;
  gap: 1rem;
  justify-content: center;
  background: #f8f9fa;
}

.download-now-btn {
  background: linear-gradient(135deg, #28a745, #20c997);
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 25px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  max-width: 200px;
}

.download-now-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(40, 167, 69, 0.4);
}

.close-btn-secondary {
  background: transparent;
  color: #6c757d;
  border: 2px solid #dee2e6;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-btn-secondary:hover {
  background: #e9ecef;
  color: #495057;
  border-color: #adb5bd;
}

/* Responsive */
@media (max-width: 768px) {
  .download-ready-modal {
    width: 95%;
    margin: 1rem;
  }
  
  .success-header {
    padding: 1.5rem;
  }
  
  .success-header h3 {
    font-size: 1.3rem;
  }
  
  .notification-body {
    padding: 1.5rem;
  }
  
  .notification-actions {
    padding: 1rem 1.5rem;
    flex-direction: column;
  }
  
  .download-now-btn,
  .close-btn-secondary {
    max-width: none;
  }
}
</style>
