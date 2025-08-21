<template>
  <div v-if="showIcon" class="cookie-icon-float" @click="openSettings">
    <div class="cookie-icon-wrapper">
      <span class="cookie-emoji">🍪</span>
      <div class="tooltip">Configurações de Cookies</div>
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

        <div class="cookie-info-section">
          <h5>Informações sobre Cookies</h5>
          <p>Os cookies são pequenos arquivos de texto armazenados no seu dispositivo que nos ajudam a:</p>
          <ul>
            <li>Lembrar suas preferências e configurações</li>
            <li>Analisar o uso do site para melhorias</li>
            <li>Personalizar conteúdo e anúncios</li>
            <li>Garantir a segurança e funcionalidade</li>
          </ul>
        </div>
      </div>
      <div class="modal-footer">
        <button @click="savePreferences" class="btn btn-primary">Salvar Preferências</button>
        <button @click="revokeCookies" class="btn btn-danger">Revogar Todos</button>
        <button @click="closeSettings" class="btn btn-outline-secondary">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CookieIcon',
  data() {
    return {
      showIcon: false,
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
    this.loadPreferences();
  },
  methods: {
    checkCookieStatus() {
      const cookiesAccepted = localStorage.getItem('cookiesAccepted');
      if (cookiesAccepted) {
        this.showIcon = true;
      }
    },
    
    loadPreferences() {
      const savedPreferences = localStorage.getItem('cookiePreferences');
      if (savedPreferences) {
        this.cookiePreferences = JSON.parse(savedPreferences);
      }
    },
    
    openSettings() {
      this.showSettings = true;
    },
    
    closeSettings() {
      this.showSettings = false;
    },
    
    savePreferences() {
      localStorage.setItem('cookiePreferences', JSON.stringify(this.cookiePreferences));
      this.showSettings = false;
      this.$emit('preferences-updated', this.cookiePreferences);
    },
    
    revokeCookies() {
      if (confirm('Tem certeza que deseja revogar todos os cookies? Isso pode afetar a funcionalidade do site.')) {
        localStorage.removeItem('cookiesAccepted');
        localStorage.removeItem('cookiePreferences');
        this.showIcon = false;
        this.showSettings = false;
        this.$emit('cookies-revoked');
        // Recarregar a página para aplicar as mudanças
        window.location.reload();
      }
    }
  }
}
</script>

<style scoped>
.cookie-icon-float {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 9998;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cookie-icon-float:hover {
  transform: scale(1.1);
}

.cookie-icon-wrapper {
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.cookie-icon-wrapper:hover {
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.3);
  transform: translateY(-2px);
}

.cookie-emoji {
  font-size: 2rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.tooltip {
  position: absolute;
  bottom: 70px;
  right: 0;
  background: #333;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  pointer-events: none;
}

.tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  right: 20px;
  border: 5px solid transparent;
  border-top-color: #333;
}

.cookie-icon-wrapper:hover .tooltip {
  opacity: 1;
  visibility: visible;
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
  max-width: 600px;
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

.cookie-info-section {
  margin-top: 32px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  border-left: 4px solid #667eea;
}

.cookie-info-section h5 {
  margin: 0 0 16px 0;
  color: #333;
  font-size: 1.1rem;
}

.cookie-info-section p {
  margin: 0 0 16px 0;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
}

.cookie-info-section ul {
  margin: 0;
  padding-left: 20px;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.6;
}

.cookie-info-section li {
  margin-bottom: 8px;
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
  flex-wrap: wrap;
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
  background: #667eea;
  color: white;
}

.btn-primary:hover {
  background: #5a6fd8;
  transform: translateY(-2px);
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover {
  background: #c82333;
  transform: translateY(-2px);
}

.btn-outline-secondary {
  background: transparent;
  color: #666;
  border: 2px solid #ddd;
}

.btn-outline-secondary:hover {
  background: #f8f9fa;
  border-color: #adb5bd;
}

/* Responsividade */
@media (max-width: 768px) {
  .cookie-icon-float {
    bottom: 20px;
    right: 20px;
  }
  
  .cookie-icon-wrapper {
    width: 50px;
    height: 50px;
  }
  
  .cookie-emoji {
    font-size: 1.5rem;
  }
  
  .modal-content {
    margin: 20px;
    max-height: calc(100vh - 40px);
  }
  
  .modal-footer {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
}
</style>
