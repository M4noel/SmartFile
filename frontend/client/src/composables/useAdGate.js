import { ref, reactive } from 'vue'

// Estado global compartilhado
const adGateState = reactive({
  isUnlocked: false,
  lastAdClick: null,
  unlockExpiry: null,
  sessionClicks: 0
})

// Configurações
const AD_GATE_CONFIG = {
  UNLOCK_DURATION: 10 * 60 * 1000, // 10 minutos em ms
  MAX_SESSION_CLICKS: 3, // Máximo de cliques por sessão
  COOLDOWN_BETWEEN_CLICKS: 2 * 60 * 1000, // 2 minutos entre cliques
  STORAGE_KEY: 'smartfile_ad_gate'
}

export function useAdGate() {
  const showModal = ref(false)
  const currentFileName = ref('')
  const pendingDownload = ref(null)

  // Carregar estado do localStorage
  const loadState = () => {
    try {
      const saved = localStorage.getItem(AD_GATE_CONFIG.STORAGE_KEY)
      if (saved) {
        const data = JSON.parse(saved)
        
        // Verificar se ainda está dentro do período de unlock
        if (data.unlockExpiry && new Date(data.unlockExpiry) > new Date()) {
          adGateState.isUnlocked = true
          adGateState.lastAdClick = new Date(data.lastAdClick)
          adGateState.unlockExpiry = new Date(data.unlockExpiry)
          adGateState.sessionClicks = data.sessionClicks || 0
        } else {
          // Expirou, limpar estado
          clearState()
        }
      }
    } catch (error) {
      console.warn('Erro ao carregar estado do AdGate:', error)
      clearState()
    }
  }

  // Salvar estado no localStorage
  const saveState = () => {
    try {
      const data = {
        isUnlocked: adGateState.isUnlocked,
        lastAdClick: adGateState.lastAdClick?.toISOString(),
        unlockExpiry: adGateState.unlockExpiry?.toISOString(),
        sessionClicks: adGateState.sessionClicks
      }
      localStorage.setItem(AD_GATE_CONFIG.STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
      console.warn('Erro ao salvar estado do AdGate:', error)
    }
  }

  // Limpar estado
  const clearState = () => {
    adGateState.isUnlocked = false
    adGateState.lastAdClick = null
    adGateState.unlockExpiry = null
    adGateState.sessionClicks = 0
    
    try {
      localStorage.removeItem(AD_GATE_CONFIG.STORAGE_KEY)
    } catch (error) {
      console.warn('Erro ao limpar estado do AdGate:', error)
    }
  }

  // Verificar se o download pode ser liberado
  const canDownload = () => {
    loadState() // Sempre verificar o estado atual
    
    if (!adGateState.isUnlocked) {
      return false
    }
    
    // Verificar se ainda está dentro do período de unlock
    if (adGateState.unlockExpiry && new Date() > adGateState.unlockExpiry) {
      clearState()
      return false
    }
    
    return true
  }

  // Verificar se precisa mostrar o modal
  const needsAdClick = () => {
    return !canDownload()
  }

  // Processar clique no anúncio
  const handleAdClick = () => {
    const now = new Date()
    
    // Verificar cooldown entre cliques
    if (adGateState.lastAdClick) {
      const timeSinceLastClick = now - adGateState.lastAdClick
      if (timeSinceLastClick < AD_GATE_CONFIG.COOLDOWN_BETWEEN_CLICKS) {
        console.warn('Cooldown ativo, clique ignorado')
        return false
      }
    }
    
    // Verificar limite de cliques por sessão
    if (adGateState.sessionClicks >= AD_GATE_CONFIG.MAX_SESSION_CLICKS) {
      console.warn('Limite de cliques por sessão atingido')
      return false
    }
    
    // Registrar o clique
    adGateState.lastAdClick = now
    adGateState.unlockExpiry = new Date(now.getTime() + AD_GATE_CONFIG.UNLOCK_DURATION)
    adGateState.isUnlocked = true
    adGateState.sessionClicks++
    
    saveState()
    
    console.log('Clique no anúncio processado, download liberado por', AD_GATE_CONFIG.UNLOCK_DURATION / 60000, 'minutos')
    return true
  }

  // Iniciar processo de download protegido
  const requestDownload = (fileName, downloadFunction) => {
    currentFileName.value = fileName
    
    if (canDownload()) {
      // Download já está liberado, executar imediatamente
      console.log('Download já liberado, executando:', fileName)
      return downloadFunction()
    }
    
    // Precisa mostrar o modal
    pendingDownload.value = downloadFunction
    showModal.value = true
    
    console.log('Mostrando modal para liberar download:', fileName)
  }

  // Aprovar download após clique no anúncio
  const approveDownload = () => {
    if (pendingDownload.value && canDownload()) {
      const downloadFn = pendingDownload.value
      
      // Limpar estado do modal
      showModal.value = false
      pendingDownload.value = null
      currentFileName.value = ''
      
      // Executar download
      console.log('Download aprovado e executando')
      return downloadFn()
    }
    
    console.warn('Tentativa de aprovar download sem permissão')
  }

  // Cancelar modal
  const cancelModal = () => {
    showModal.value = false
    pendingDownload.value = null
    currentFileName.value = ''
    console.log('Modal de download cancelado')
  }

  // Obter tempo restante até expirar
  const getTimeRemaining = () => {
    if (!adGateState.unlockExpiry) return 0
    
    const remaining = adGateState.unlockExpiry - new Date()
    return Math.max(0, Math.floor(remaining / 1000)) // segundos
  }

  // Obter estatísticas
  const getStats = () => {
    return {
      isUnlocked: adGateState.isUnlocked,
      sessionClicks: adGateState.sessionClicks,
      maxClicks: AD_GATE_CONFIG.MAX_SESSION_CLICKS,
      timeRemaining: getTimeRemaining(),
      lastClickTime: adGateState.lastAdClick
    }
  }

  // Debug - forçar unlock (apenas para desenvolvimento)
  const forceUnlock = () => {
    if (process.env.NODE_ENV === 'development') {
      const now = new Date()
      adGateState.lastAdClick = now
      adGateState.unlockExpiry = new Date(now.getTime() + AD_GATE_CONFIG.UNLOCK_DURATION)
      adGateState.isUnlocked = true
      saveState()
      console.log('Debug: Download forçado a ser liberado')
    }
  }

  // Debug - limpar estado (apenas para desenvolvimento)
  const debugClear = () => {
    if (process.env.NODE_ENV === 'development') {
      clearState()
      console.log('Debug: Estado do AdGate limpo')
    }
  }

  // Inicializar ao usar o composable
  loadState()

  return {
    // Estado reativo
    showModal,
    currentFileName,
    
    // Métodos principais
    canDownload,
    needsAdClick,
    requestDownload,
    handleAdClick,
    approveDownload,
    cancelModal,
    
    // Utilidades
    getTimeRemaining,
    getStats,
    
    // Debug (apenas desenvolvimento)
    forceUnlock,
    debugClear,
    
    // Configurações (readonly)
    config: { ...AD_GATE_CONFIG }
  }
}
