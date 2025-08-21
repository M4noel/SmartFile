<template>
  <div class="cookie-manager">
    <!-- Banner de Cookies -->
    <CookieBanner 
      v-if="!cookiesAccepted" 
      @cookies-accepted="handleCookiesAccepted"
    />
    
    <!-- Ícone Flutuante de Cookies -->
    <CookieIcon 
      v-if="cookiesAccepted" 
      @preferences-updated="handlePreferencesUpdated"
      @cookies-revoked="handleCookiesRevoked"
    />
  </div>
</template>

<script>
import { useCookies } from '../composables/useCookies'
import CookieBanner from './CookieBanner.vue'
import CookieIcon from './CookieIcon.vue'

export default {
  name: 'CookieManager',
  components: {
    CookieBanner,
    CookieIcon
  },
  setup() {
    const {
      cookiesAccepted,
      acceptAllCookies,
      savePreferences,
      revokeAllCookies
    } = useCookies()

    const handleCookiesAccepted = () => {
      acceptAllCookies()
    }

    const handlePreferencesUpdated = (preferences) => {
      savePreferences(preferences)
    }

    const handleCookiesRevoked = () => {
      revokeAllCookies()
    }

    return {
      cookiesAccepted,
      handleCookiesAccepted,
      handlePreferencesUpdated,
      handleCookiesRevoked
    }
  }
}
</script>

<style scoped>
.cookie-manager {
  /* Este componente não precisa de estilos específicos */
}
</style>
