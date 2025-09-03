<template>
  <div v-if="show" class="ad-modal-overlay" @click="handleOverlayClick">
    <div class="ad-modal" @click.stop>
      <div class="ad-modal-header">
        <h3>🎯 Apoie nosso site!</h3>
        <button class="close-btn" @click="closeModal" :disabled="isProcessing">×</button>
      </div>
      
      <div class="ad-modal-body">
        <div class="ad-instruction">
          <div class="instruction-icon">📢</div>
          <p class="instruction-text">
            Para continuar com seu download <strong>{{ fileName }}</strong>, 
            clique no anúncio abaixo e depois no botão "Liberar Download".
          </p>
          <p class="support-text">
            Isso nos ajuda a manter o site gratuito para todos! 🙏
          </p>
        </div>

        <div class="ad-container">
          <AdBanner 
            :ad-client="adClient" 
            :ad-slot="adSlot" 
            @ad-clicked="handleAdClick"
            :track-clicks="true"
            class="modal-ad"
          />
          
          <!-- Aviso sobre comportamento normal do AdSense -->
          <div class="adsense-notice" v-if="!adClicked">
            <p class="notice-text">
              💡 <strong>Importante:</strong> Clique no anúncio acima para apoiar o site.
              <br><small>Aguarde alguns segundos após clicar para liberar seu download.</small>
            </p>
          </div>
        </div>

        <div class="progress-section" v-if="adClicked">
          <div class="success-message">
            <span class="success-icon">✅</span>
            Obrigado! Seu download será liberado em {{ timeLeft }} segundos...
          </div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progressWidth + '%' }"></div>
          </div>
        </div>

        <div class="modal-actions">
          <button 
            v-if="!adClicked"
            class="action-btn wait-btn"
            disabled
          >
            ⏳ Aguardando clique no anúncio...
          </button>
          
          <button 
            v-else-if="timeLeft > 0"
            class="action-btn countdown-btn"
            disabled
          >
            ⏱️ Aguarde {{ timeLeft }}s...
          </button>
          
          <button 
            v-else
            class="action-btn download-btn"
            @click="proceedWithDownload"
            :disabled="isProcessing"
          >
            <span v-if="isProcessing" class="spinner"></span>
            {{ isProcessing ? 'Processando...' : '🚀 Liberar Download!' }}
          </button>
        </div>
      </div>

      <div class="ad-modal-footer">
        <p class="privacy-note">
          <small>
            💡 Seu download está seguro e será iniciado automaticamente após a verificação.
          </small>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'
import AdBanner from './AdBanner.vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  fileName: {
    type: String,
    default: 'arquivo'
  },
  adClient: {
    type: String,
    default: 'ca-pub-5604948783210108'
  },
  adSlot: {
    type: String,
    default: '1098157652'
  },
  waitTime: {
    type: Number,
    default: 10 // segundos para esperar após clicar no anúncio
  }
})

const emit = defineEmits(['close', 'download-approved', 'ad-clicked'])

// Estados reativo
const adClicked = ref(false)
const timeLeft = ref(props.waitTime)
const isProcessing = ref(false)
let countdownInterval = null

// Computed
const progressWidth = computed(() => {
  if (!adClicked.value) return 0
  return ((props.waitTime - timeLeft.value) / props.waitTime) * 100
})

// Métodos
const handleAdClick = () => {
  if (adClicked.value) return
  
  adClicked.value = true
  timeLeft.value = props.waitTime
  
  console.log('Anúncio clicado - iniciando countdown')
  
  emit('ad-clicked')
  startCountdown()
}

const startCountdown = () => {
  countdownInterval = setInterval(() => {
    timeLeft.value--
    
    if (timeLeft.value <= 0) {
      clearInterval(countdownInterval)
    }
  }, 1000)
}

const proceedWithDownload = () => {
  if (timeLeft.value > 0 || !adClicked.value) return
  
  isProcessing.value = true
  
  // Simula um pequeno delay para dar feedback visual
  setTimeout(() => {
    emit('download-approved')
    resetModal()
  }, 1000)
}

const closeModal = () => {
  if (isProcessing.value) return
  emit('close')
  resetModal()
}

const handleOverlayClick = () => {
  if (isProcessing.value) return
  closeModal()
}

const resetModal = () => {
  adClicked.value = false
  timeLeft.value = props.waitTime
  isProcessing.value = false
  
  if (countdownInterval) {
    clearInterval(countdownInterval)
    countdownInterval = null
  }
}

// Watch para resetar quando o modal for fechado
watch(() => props.show, (newValue) => {
  if (!newValue) {
    resetModal()
  } else if (newValue) {
    // Modal foi aberto - verificar se já teve clique anterior
    console.log('Modal aberto')
  }
})

// Cleanup
onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
})
</script>

<style scoped>
.ad-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  backdrop-filter: blur(5px);
}

.ad-modal {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-50px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.ad-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e9ecef;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 16px 16px 0 0;
}

.ad-modal-header h3 {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.8rem;
  color: white;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}

.close-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ad-modal-body {
  padding: 2rem;
}

.ad-instruction {
  text-align: center;
  margin-bottom: 2rem;
}

.instruction-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.instruction-text {
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: #333;
  line-height: 1.6;
}

.support-text {
  color: #666;
  font-style: italic;
  margin: 0;
}

.ad-container {
  margin: 2rem 0;
  padding: 1rem;
  border: 2px dashed #ddd;
  border-radius: 12px;
  background: #f8f9fa;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-ad {
  width: 100%;
}

.adsense-notice {
  margin-top: 1rem;
  padding: 0.75rem;
  background: #fff3cd;
  border-left: 4px solid #ffc107;
  border-radius: 4px;
}

.notice-text {
  margin: 0;
  color: #856404;
  font-size: 0.9rem;
  line-height: 1.4;
}

.notice-text strong {
  color: #533f03;
}

.notice-text small {
  color: #6c757d;
  font-style: italic;
}

.progress-section {
  margin: 2rem 0;
  text-align: center;
}

.success-message {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: #28a745;
  font-weight: 500;
  font-size: 1.1rem;
}

.success-icon {
  font-size: 1.2rem;
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #28a745, #20c997);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.modal-actions {
  text-align: center;
  margin-top: 2rem;
}

.action-btn {
  padding: 12px 32px;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 200px;
  justify-content: center;
}

.wait-btn {
  background: #6c757d;
  color: white;
  cursor: not-allowed;
  opacity: 0.7;
}

.countdown-btn {
  background: #fd7e14;
  color: white;
  cursor: not-allowed;
  animation: pulse 1s infinite;
}

.download-btn {
  background: linear-gradient(135deg, #28a745, #20c997);
  color: white;
  transform: scale(1);
}

.download-btn:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(40, 167, 69, 0.4);
}

.download-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.ad-modal-footer {
  padding: 1rem 2rem;
  border-top: 1px solid #e9ecef;
  background: #f8f9fa;
  border-radius: 0 0 16px 16px;
  text-align: center;
}

.privacy-note {
  margin: 0;
  color: #6c757d;
}

/* Responsive */
@media (max-width: 768px) {
  .ad-modal {
    width: 95%;
    margin: 1rem;
  }
  
  .ad-modal-header {
    padding: 1rem 1.5rem;
  }
  
  .ad-modal-header h3 {
    font-size: 1.2rem;
  }
  
  .ad-modal-body {
    padding: 1.5rem;
  }
  
  .instruction-text {
    font-size: 1rem;
  }
  
  .action-btn {
    font-size: 1rem;
    padding: 10px 24px;
    min-width: 180px;
  }
}
</style>
