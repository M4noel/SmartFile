import { ref, reactive, onMounted } from 'vue'

export function useCookies() {
  const cookiesAccepted = ref(false)
  const cookiePreferences = reactive({
    essential: true,
    analytics: false,
    marketing: false
  })

  // Verificar status dos cookies ao montar
  onMounted(() => {
    checkCookieStatus()
    loadPreferences()
  })

  // Verificar se os cookies foram aceitos
  const checkCookieStatus = () => {
    const accepted = localStorage.getItem('cookiesAccepted')
    cookiesAccepted.value = !!accepted
  }

  // Carregar preferências salvas
  const loadPreferences = () => {
    const saved = localStorage.getItem('cookiePreferences')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        Object.assign(cookiePreferences, parsed)
      } catch (error) {
        console.error('Erro ao carregar preferências de cookies:', error)
      }
    }
  }

  // Aceitar todos os cookies
  const acceptAllCookies = () => {
    cookiesAccepted.value = true
    cookiePreferences.essential = true
    cookiePreferences.analytics = true
    cookiePreferences.marketing = true
    
    localStorage.setItem('cookiesAccepted', 'true')
    localStorage.setItem('cookiePreferences', JSON.stringify(cookiePreferences))
    
    return true
  }

  // Salvar preferências específicas
  const savePreferences = (preferences = null) => {
    if (preferences) {
      Object.assign(cookiePreferences, preferences)
    }
    
    cookiesAccepted.value = true
    localStorage.setItem('cookiesAccepted', 'true')
    localStorage.setItem('cookiePreferences', JSON.stringify(cookiePreferences))
    
    return true
  }

  // Revogar todos os cookies
  const revokeAllCookies = () => {
    cookiesAccepted.value = false
    cookiePreferences.essential = true // Essenciais sempre ativos
    cookiePreferences.analytics = false
    cookiePreferences.marketing = false
    
    localStorage.removeItem('cookiesAccepted')
    localStorage.removeItem('cookiePreferences')
    
    return true
  }

  // Verificar se um tipo específico de cookie está ativo
  const isCookieTypeActive = (type) => {
    if (type === 'essential') return true // Sempre ativo
    return cookiesAccepted.value && cookiePreferences[type]
  }

  // Verificar se analytics está ativo
  const isAnalyticsActive = () => {
    return isCookieTypeActive('analytics')
  }

  // Verificar se marketing está ativo
  const isMarketingActive = () => {
    return isCookieTypeActive('marketing')
  }

  // Obter status geral dos cookies
  const getCookieStatus = () => {
    return {
      accepted: cookiesAccepted.value,
      preferences: { ...cookiePreferences }
    }
  }

  // Atualizar uma preferência específica
  const updatePreference = (type, value) => {
    if (type === 'essential') return false // Não pode ser alterado
    
    cookiePreferences[type] = value
    if (cookiesAccepted.value) {
      localStorage.setItem('cookiePreferences', JSON.stringify(cookiePreferences))
    }
    
    return true
  }

  // Limpar dados de cookies (para logout ou reset)
  const clearCookieData = () => {
    localStorage.removeItem('cookiesAccepted')
    localStorage.removeItem('cookiePreferences')
    cookiesAccepted.value = false
    cookiePreferences.analytics = false
    cookiePreferences.marketing = false
  }

  return {
    // Estado reativo
    cookiesAccepted,
    cookiePreferences,
    
    // Métodos
    checkCookieStatus,
    loadPreferences,
    acceptAllCookies,
    savePreferences,
    revokeAllCookies,
    isCookieTypeActive,
    isAnalyticsActive,
    isMarketingActive,
    getCookieStatus,
    updatePreference,
    clearCookieData
  }
}
