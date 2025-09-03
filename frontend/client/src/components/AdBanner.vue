<template>
  <div class="ad-banner" ref="adContainer">
    <ins class="adsbygoogle"
         style="display:block;width:100%"
         :data-ad-client="adClient"
         :data-ad-slot="adSlot"
         data-ad-format="auto"
         data-full-width-responsive="true"></ins>
    
    <!-- Overlay invisível para detectar cliques -->
    <div 
      class="ad-click-detector" 
      @click="handleAdAreaClick"
      v-if="trackClicks"
    ></div>
  </div>
</template>

<script setup>
import { onMounted, ref, nextTick } from 'vue'

const props = defineProps({
  adClient: { type: String, default: 'ca-pub-5604948783210108' },
  adSlot: { type: String, default: '1098157652' },
  trackClicks: { type: Boolean, default: false }
})

const emit = defineEmits(['ad-clicked', 'ad-loaded', 'ad-error'])

const adContainer = ref(null)
let clickDetectionActive = false
let adLoadTimeout = null

const handleAdAreaClick = (event) => {
  if (!clickDetectionActive) return
  
  // Registrar clique no anúncio
  console.log('Clique detectado na área do anúncio')
  emit('ad-clicked', { 
    timestamp: new Date(),
    event: event
  })
  
  // Desativar detecção por alguns segundos para evitar múltiplos cliques
  clickDetectionActive = false
  setTimeout(() => {
    clickDetectionActive = true
  }, 2000)
}

const setupAdClickDetection = () => {
  if (!props.trackClicks || !adContainer.value) return
  
  // Detectar cliques em elementos filhos do anúncio
  const adElement = adContainer.value.querySelector('.adsbygoogle')
  if (adElement) {
    // Usar mutation observer para detectar quando o anúncio é carregado
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // Anúncio foi carregado
          clickDetectionActive = true
          emit('ad-loaded')
          observer.disconnect()
        }
      })
    })
    
    observer.observe(adElement, {
      childList: true,
      subtree: true
    })
    
    // Fallback: ativar detecção após um tempo
    adLoadTimeout = setTimeout(() => {
      clickDetectionActive = true
      observer.disconnect()
    }, 3000)
  }
}

onMounted(() => {
  try {
    (adsbygoogle = window.adsbygoogle || []).push({})
    
    // Configurar detecção de cliques se necessário
    nextTick(() => {
      setupAdClickDetection()
    })
  } catch (e) {
    console.error('Erro ao carregar AdSense:', e)
    emit('ad-error', e)
  }
})
</script>

<style scoped>
.ad-banner {
  margin: 1rem auto;
  text-align: center;
  position: relative;
  min-height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ad-click-detector {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  cursor: pointer;
  background: transparent;
}

/* Fallback para quando o anúncio não carrega */
.ad-banner:empty::after {
  content: 'Publicidade';
  display: block;
  color: #999;
  font-size: 0.8rem;
  padding: 2rem;
  border: 1px dashed #ccc;
  border-radius: 4px;
}
</style>
