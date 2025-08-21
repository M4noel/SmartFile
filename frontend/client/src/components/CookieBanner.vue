<template>
  <div v-if="showBanner" class="cookie-banner">
    <div class="cookie-banner-content">
      <div class="cookie-info">
        <div class="cookie-icon">🍪</div>
        <div class="cookie-text">
          <h4>Cookies e Privacidade</h4>
          <p>Utilizamos cookies para melhorar sua experiência, analisar o tráfego e personalizar conteúdo. Ao continuar navegando, você concorda com nossa <a href="/privacidade" target="_blank">Política de Privacidade</a>.</p>
        </div>
      </div>
      <div class="cookie-actions">
        <button @click="acceptCookies" class="btn btn-primary accept-btn">
          Aceitar Todos
        </button>
        <button @click="showSettings = true" class="btn btn-outline-secondary settings-btn">
          Configurações
        </button>
      </div>
    </div>

    <!-- Modal de Configurações -->
    <div v-if="showSettings" class="cookie-settings-modal" @click="closeSettings">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Configurações de Cookies</h3>
          <button @click="closeSettings" class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <div class="cookie-category">
            <div class="category-header">
              <label class="switch">
                <input type="checkbox" v-model="cookiePreferences.essential" disabled checked>
                <span class="slider"></span>
              </label>
              <div class="category-info">
                <h5>Cookies Essenciais</h5>
                <p>Necessários para o funcionamento básico do site. Sempre ativos.</p>
              </div>
            </div>
          </div>

          <div class="cookie-category">
            <div class="category-header">
              <label class="switch">
                <input type="checkbox" v-model="cookiePreferences.analytics">
                <span class="slider"></span>
              </label>
              <div class="category-info">
                <h5>Cookies Analíticos</h5>
                <p>Nos ajudam a entender como você usa o site para melhorar nossos serviços.</p>
              </div>
            </div>
          </div>

          <div class="cookie-category">
            <div class="category-header">
              <label class="switch">
                <input type="checkbox" v-model="cookiePreferences.marketing">
                <span class="slider"></span>
              </label>
              <div class="category-info">
                <h5>Cookies de Marketing</h5>
                <p>Usados para mostrar anúncios relevantes e medir a eficácia das campanhas.</p>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="savePreferences" class="btn btn-primary">Salvar Preferências</button>
          <button @click="closeSettings" class="btn btn-outline-secondary">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CookieBanner',
  data() {
    return {
      showBanner: false,
      showSettings: false,
      cookiePreferences: {
        essential: true,
        analytics: false,
        marketing: false
      }
    }
  },
  mounted() {
    this.checkCookieStatus();
  },
  methods: {
    checkCookieStatus() {
      const cookiesAccepted = localStorage.getItem('cookiesAccepted');
      if (!cookiesAccepted) {
        this.showBanner = true;
      }
    },
    
    acceptCookies() {
      localStorage.setItem('cookiesAccepted', 'true');
      localStorage.setItem('cookiePreferences', JSON.stringify({
        essential: true,
        analytics: true,
        marketing: true
      }));
      this.showBanner = false;
      this.$emit('cookies-accepted');
    },
    
    savePreferences() {
      localStorage.setItem('cookiesAccepted', 'true');
      localStorage.setItem('cookiePreferences', JSON.stringify(this.cookiePreferences));
      this.showBanner = false;
      this.showSettings = false;
      this.$emit('cookies-accepted');
    },
    
    closeSettings() {
      this.showSettings = false;
    }
  }
}
</script>

<style scoped>
.cookie-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  z-index: 9999;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.cookie-banner-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.cookie-info {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  flex: 1;
}

.cookie-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.cookie-text h4 {
  margin: 0 0 8px 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.cookie-text p {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.4;
  opacity: 0.9;
}

.cookie-text a {
  color: #ffd700;
  text-decoration: underline;
}

.cookie-text a:hover {
  color: #fff;
}

.cookie-actions {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
  text-align: center;
}

.btn-primary {
  background: #ffd700;
  color: #333;
}

.btn-primary:hover {
  background: #ffed4e;
  transform: translateY(-2px);
}

.btn-outline-secondary {
  background: transparent;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.btn-outline-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.5);
}

/* Modal de Configurações */
.cookie-settings-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 16px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  padding: 24px 24px 16px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.3rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.3s ease;
}

.close-btn:hover {
  background: #f5f5f5;
}

.modal-body {
  padding: 24px;
}

.cookie-category {
  margin-bottom: 24px;
  padding: 16px;
  border: 1px solid #eee;
  border-radius: 12px;
  background: #fafafa;
}

.category-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.category-info h5 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 1rem;
}

.category-info p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
}

/* Switch Toggle */
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
  flex-shrink: 0;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.3s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #667eea;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.modal-footer {
  padding: 16px 24px 24px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

/* Responsividade */
@media (max-width: 768px) {
  .cookie-banner-content {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }
  
  .cookie-info {
    flex-direction: column;
    text-align: center;
  }
  
  .cookie-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .btn {
    width: 100%;
  }
  
  .modal-content {
    margin: 20px;
    max-height: calc(100vh - 40px);
  }
}
</style>
