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
  COUNTDOWN_TIME: 10, // Segundos de countdown após clicar
  STORAGE_KEY: 'smartfile_ad_gate',
  PENDING_DOWNLOAD_KEY: 'smartfile_pending_download'
}

export function useAdGate() {
  const showModal = ref(false)
  const currentFileName = ref('')
  const pendingDownload = ref(null)
  const modalState = ref('waiting') // 'waiting', 'clicked', 'ready'
  const awaitingReturn = ref(false)

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
        
        // Restaurar estado do modal se estava aguardando retorno
        if (data.awaitingReturn && data.modalOpen) {
          showModal.value = true
          modalState.value = data.modalState || 'waiting'
          currentFileName.value = data.fileName || ''
          awaitingReturn.value = true
          console.log('Estado do modal restaurado após retorno do usuário')
        }
      }
      
      // Verificar se existe download pendente
      const pendingDownload = loadPendingDownload()
      if (pendingDownload && canDownload()) {
        // Usuário voltou e já pode fazer download!
        console.log('Download pendente encontrado e liberado:', pendingDownload.fileName)
        showPendingDownloadNotification(pendingDownload.fileName)
        clearPendingDownload()
      } else if (pendingDownload) {
        // Ainda precisa clicar no anúncio
        console.log('Download pendente encontrado, mas ainda precisa clicar no anúncio')
        currentFileName.value = pendingDownload.fileName
        showModal.value = true
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
        sessionClicks: adGateState.sessionClicks,
        // Salvar estado do modal também
        modalOpen: showModal.value,
        modalState: modalState.value,
        fileName: currentFileName.value,
        awaitingReturn: awaitingReturn.value
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

  // Aprovar download após timer (substitui o clique no anúncio)
  const approveAfterTimer = () => {
    const now = new Date()
    
    // Registrar a aprovação
    adGateState.lastAdClick = now
    adGateState.unlockExpiry = new Date(now.getTime() + AD_GATE_CONFIG.UNLOCK_DURATION)
    adGateState.isUnlocked = true
    adGateState.sessionClicks++
    modalState.value = 'approved'
    
    saveState()
    
    console.log('Download aprovado após timer, downloads liberados por', AD_GATE_CONFIG.UNLOCK_DURATION / 60000, 'minutos')
    return true
  }

  // Salvar download pendente no localStorage (para persistir mesmo se sair da página)
  const savePendingDownload = (fileName) => {
    try {
      const pendingData = {
        fileName,
        timestamp: new Date().toISOString(),
        url: window.location.href
      }
      localStorage.setItem(AD_GATE_CONFIG.PENDING_DOWNLOAD_KEY, JSON.stringify(pendingData))
    } catch (error) {
      console.warn('Erro ao salvar download pendente:', error)
    }
  }
  
  // Carregar download pendente
  const loadPendingDownload = () => {
    try {
      const saved = localStorage.getItem(AD_GATE_CONFIG.PENDING_DOWNLOAD_KEY)
      if (saved) {
        const data = JSON.parse(saved)
        // Verificar se não é muito antigo (máximo 1 hora)
        const age = new Date() - new Date(data.timestamp)
        if (age < 60 * 60 * 1000) { // 1 hora
          return data
        } else {
          localStorage.removeItem(AD_GATE_CONFIG.PENDING_DOWNLOAD_KEY)
        }
      }
    } catch (error) {
      console.warn('Erro ao carregar download pendente:', error)
      localStorage.removeItem(AD_GATE_CONFIG.PENDING_DOWNLOAD_KEY)
    }
    return null
  }
  
  // Limpar download pendente
  const clearPendingDownload = () => {
    try {
      localStorage.removeItem(AD_GATE_CONFIG.PENDING_DOWNLOAD_KEY)
    } catch (error) {
      console.warn('Erro ao limpar download pendente:', error)
    }
  }
  
  // Iniciar processo de download protegido
  const requestDownload = (fileName, downloadFunction) => {
    currentFileName.value = fileName
    
    if (canDownload()) {
      // Download já está liberado, executar imediatamente
      console.log('Download já liberado, executando:', fileName)
      clearPendingDownload()
      return downloadFunction()
    }
    
    // Salvar o download pendente
    savePendingDownload(fileName)
    
    // Precisa mostrar o modal
    pendingDownload.value = downloadFunction
    showModal.value = true
    modalState.value = 'waiting'
    awaitingReturn.value = false
    
    saveState() // Salvar estado imediatamente
    console.log('Mostrando modal para liberar download:', fileName)
  }

  // Mostrar notificação de download pendente
  const showPendingDownloadNotification = (fileName) => {
    // Criar uma notificação visual simples
    const notification = document.createElement('div')
    notification.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10001;
        font-family: Arial, sans-serif;
        max-width: 300px;
      ">
        🎉 <strong>Download Liberado!</strong><br>
        <small>Seu arquivo ${fileName} está pronto para download!</small>
      </div>
    `
    
    document.body.appendChild(notification.firstElementChild)
    
    // Remover após 5 segundos
    setTimeout(() => {
      const element = document.querySelector('div[style*="position: fixed"]')
      if (element) {
        element.remove()
      }
    }, 5000)
  }
  
  // Aprovar download após timer
  const approveDownload = () => {
    // Primeiro, aprovar o acesso
    approveAfterTimer()
    
    if (pendingDownload.value && canDownload()) {
      const downloadFn = pendingDownload.value
      
      // Fechar modal IMEDIATAMENTE
      showModal.value = false
      
      console.log('Download aprovado - executando imediatamente')
      
      // Executar download imediatamente
      const result = downloadFn()
      
      // Limpar estado após executar
      pendingDownload.value = null
      currentFileName.value = ''
      clearPendingDownload()
      
      return result
    }
    
    console.warn('Erro ao aprovar download')
  }

  // Cancelar modal
  const cancelModal = () => {
    showModal.value = false
    pendingDownload.value = null
    currentFileName.value = ''
    modalState.value = 'waiting'
    awaitingReturn.value = false
    clearPendingDownload() // Limpar download pendente
    saveState() // Salvar estado ao cancelar
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

  // Configurar detecção de foco da aba
  const setupFocusDetection = () => {
    // Detectar quando o usuário volta para a aba
    const handleVisibilityChange = () => {
      if (!document.hidden && awaitingReturn.value) {
        console.log('Usuário voltou para a aba')
        awaitingReturn.value = false
        
        // Se o download já foi liberado, mostrar o modal pronto
        if (canDownload() && showModal.value) {
          modalState.value = 'ready'
          saveState()
        }
      }
    }
    
    // Detectar quando o usuário sai da aba (clicou no anúncio)
    const handleBlur = () => {
      if (showModal.value && modalState.value === 'clicked') {
        console.log('Usuário saiu da aba (possivelmente clicou no anúncio)')
        awaitingReturn.value = true
        saveState()
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('blur', handleBlur)
    
    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('blur', handleBlur)
    }
  }
  
  // Inicializar ao usar o composable
  loadState()
  const cleanupFocusDetection = setupFocusDetection()

  return {
    // Estado reativo
    showModal,
    currentFileName,
    modalState,
    awaitingReturn,
    
    // Métodos principais
    canDownload,
    needsAdClick,
    requestDownload,
    approveDownload,
    cancelModal,
    
    // Utilidades
    getTimeRemaining,
    getStats,
    
    // Debug (apenas desenvolvimento)
    forceUnlock,
    debugClear,
    
    // Cleanup
    cleanup: cleanupFocusDetection,
    
    // Configurações (readonly)
    config: { ...AD_GATE_CONFIG }
  }
}
