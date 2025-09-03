<template>
  <div v-if="show" class="ad-modal-overlay" @click="handleOverlayClick">
    <div class="ad-modal" @click.stop>
      <div class="ad-modal-header">
        <h3>🎯 Apoie nosso site!</h3>
        <button class="close-btn" @click="closeModal" :disabled="isProcessing">×</button>
      </div>
      
      <div class="ad-modal-body">
        <div class="ad-instruction">
          <div class="instruction-icon">🕒</div>
          <p class="instruction-text">
            Aguarde <strong>{{ timeLeft }} segundos</strong> para baixar <strong>{{ fileName }}</strong>.
          </p>
          <p class="support-text">
            Enquanto isso, que tal dar uma olhada no anúncio abaixo? Isso nos ajuda a manter o site gratuito! 🙏
          </p>
        </div>

        <div class="ad-container">
          <!-- Placeholder para anúncios -->
          <div class="ad-placeholder" v-if="!adLoaded">
            <div class="placeholder-content">
              📱 <strong>Publicidade</strong>
              <br><small>Aguardando carregamento...</small>
            </div>
          </div>
          
          <AdBanner 
            :ad-client="adClient" 
            :ad-slot="adSlot" 
            class="modal-ad"
            @ad-loaded="adLoaded = true"
            @ad-error="adLoaded = false"
          />
          
          <!-- Informação sobre o anúncio -->
          <div class="ad-info-notice">
            <p class="info-text">
              💡 <strong>Apoie nosso site:</strong> Os anúncios nos ajudam a manter o SmartFile gratuito para todos!
            </p>
          </div>
        </div>

        <div class="progress-section">
          <div class="countdown-message" :class="{ 'ready': timeLeft <= 0 }">
            <span class="countdown-icon">{{ timeLeft <= 0 ? '✅' : '⏳' }}</span>
            {{ timeLeft <= 0 ? 'Download liberado!' : `Aguarde ${timeLeft} segundos...` }}
          </div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progressWidth + '%' }"></div>
          </div>
        </div>

        <div class="modal-actions">
          <button 
            v-if="timeLeft > 0"
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
            {{ isProcessing ? 'Processando...' : '🚀 Baixar Agora!' }}
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
const timeLeft = ref(props.waitTime)
const isProcessing = ref(false)
const adLoaded = ref(false)
let countdownInterval = null

// Computed
const progressWidth = computed(() => {
  return ((props.waitTime - timeLeft.value) / props.waitTime) * 100
})

// Métodos
const startTimer = () => {
  if (countdownInterval) return // Já está rodando
  
  timeLeft.value = props.waitTime
  console.log('Iniciando timer de', props.waitTime, 'segundos')
  
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
  if (timeLeft.value > 0) return
  
  // Fechar modal imediatamente
  emit('download-approved')
  
  // Resetar modal após fechar
  setTimeout(() => {
    resetModal()
  }, 100)
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
  timeLeft.value = props.waitTime
  isProcessing.value = false
  
  if (countdownInterval) {
    clearInterval(countdownInterval)
    countdownInterval = null
  }
}

// Watch para iniciar timer quando modal abrir
watch(() => props.show, (newValue) => {
  if (!newValue) {
    resetModal()
  } else if (newValue) {
    // Modal foi aberto - iniciar timer automaticamente
    console.log('Modal aberto - iniciando timer')
    startTimer()
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

.ad-placeholder {
  width: 100%;
  min-height: 100px;
  background: #f8f9fa;
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.placeholder-content {
  text-align: center;
  color: #6c757d;
  font-size: 0.9rem;
  line-height: 1.4;
}

.placeholder-content strong {
  color: #495057;
  font-size: 1rem;
}

.ad-info-notice {
  margin-top: 1rem;
  padding: 0.75rem;
  background: #e8f5e8;
  border-left: 4px solid #28a745;
  border-radius: 4px;
}

.info-text {
  margin: 0;
  color: #155724;
  font-size: 0.9rem;
  line-height: 1.4;
}

.info-text strong {
  color: #0f3b21;
}

.countdown-message {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: #fd7e14;
  font-weight: 600;
  font-size: 1.1rem;
  transition: color 0.3s ease;
}

.countdown-message.ready {
  color: #28a745;
}

.countdown-icon {
  font-size: 1.2rem;
  animation: pulse 1.5s infinite;
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
