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
            aguarde o anúncio carregar e o tempo acabar.
          </p>
          <p class="support-text">
            Isso nos ajuda a manter o site gratuito para todos! 🙏
          </p>
        </div>

        <div class="ad-container">
          <AdBanner 
            :ad-client="adClient" 
            :ad-slot="adSlot" 
            @ad-loaded="startCountdown"
            class="modal-ad"
          />
        </div>

        <div class="progress-section" v-if="countdownStarted">
          <div class="success-message">
            <span class="success-icon">✅</span>
            Seu download será liberado em {{ timeLeft }} segundos...
          </div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progressWidth + '%' }"></div>
          </div>
        </div>

        <div class="modal-actions">
          <button 
            v-if="!countdownStarted"
            class="action-btn wait-btn"
            disabled
          >
            ⏳ Aguardando anúncio carregar...
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
import { ref, computed, onUnmounted } from 'vue'
import AdBanner from './AdBanner.vue'

const props = defineProps({
  show: { type: Boolean, default: false },
  fileName: { type: String, default: 'arquivo' },
  adClient: { type: String, default: 'ca-pub-5604948783210108' },
  adSlot: { type: String, default: '1098157652' },
  waitTime: { type: Number, default: 10 } // segundos
})

const emit = defineEmits(['close', 'download-approved'])

// Estados reativos
const countdownStarted = ref(false)
const timeLeft = ref(props.waitTime)
const isProcessing = ref(false)
let countdownInterval = null

// Computed
const progressWidth = computed(() => {
  if (!countdownStarted.value) return 0
  return ((props.waitTime - timeLeft.value) / props.waitTime) * 100
})

// Métodos
const startCountdown = () => {
  if (countdownStarted.value) return
  countdownStarted.value = true
  timeLeft.value = props.waitTime

  countdownInterval = setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) {
      clearInterval(countdownInterval)
    }
  }, 1000)
}

const proceedWithDownload = () => {
  if (timeLeft.value > 0 || !countdownStarted.value) return
  
  isProcessing.value = true
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
  if (!isProcessing.value) closeModal()
}

const resetModal = () => {
  countdownStarted.value = false
  timeLeft.value = props.waitTime
  isProcessing.value = false

  if (countdownInterval) {
    clearInterval(countdownInterval)
    countdownInterval = null
  }
}

// Cleanup
onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
})
</script>
