<template>
  <div class="cookie-usage-example">
    <h2>Exemplo de Uso do Sistema de Cookies</h2>
    
    <div class="example-section">
      <h3>Status dos Cookies</h3>
      <div class="status-grid">
        <div class="status-item">
          <span class="status-label">Cookies Aceitos:</span>
          <span class="status-value" :class="{ active: cookiesAccepted }">
            {{ cookiesAccepted ? '✅ Sim' : '❌ Não' }}
          </span>
        </div>
        <div class="status-item">
          <span class="status-label">Analytics:</span>
          <span class="status-value" :class="{ active: isAnalyticsActive() }">
            {{ isAnalyticsActive() ? '✅ Ativo' : '❌ Inativo' }}
          </span>
        </div>
        <div class="status-item">
          <span class="status-label">Marketing:</span>
          <span class="status-value" :class="{ active: isMarketingActive() }">
            {{ isMarketingActive() ? '✅ Ativo' : '❌ Inativo' }}
          </span>
        </div>
      </div>
    </div>

    <div class="example-section">
      <h3>Exemplo de Carregamento Condicional</h3>
      <div class="example-code">
        <p>Este exemplo mostra como carregar recursos baseado nas preferências de cookies:</p>
        
        <div v-if="isAnalyticsActive()" class="analytics-demo">
          <h4>📊 Analytics Ativo</h4>
          <p>Google Analytics seria carregado aqui...</p>
          <div class="demo-metric">
            <span class="metric-label">Usuários ativos:</span>
            <span class="metric-value">{{ activeUsers }}</span>
          </div>
        </div>
        
        <div v-else class="analytics-disabled">
          <h4>📊 Analytics Desabilitado</h4>
          <p>Analytics não será carregado devido às preferências do usuário.</p>
        </div>

        <div v-if="isMarketingActive()" class="marketing-demo">
          <h4>🎯 Marketing Ativo</h4>
          <p>Facebook Pixel seria carregado aqui...</p>
          <div class="demo-metric">
            <span class="metric-label">Conversões:</span>
            <span class="metric-value">{{ conversions }}</span>
          </div>
        </div>
        
        <div v-else class="marketing-disabled">
          <h4>🎯 Marketing Desabilitado</h4>
          <p>Marketing não será carregado devido às preferências do usuário.</p>
        </div>
      </div>
    </div>

    <div class="example-section">
      <h3>Controles de Teste</h3>
      <div class="test-controls">
        <button @click="simulateAnalytics" class="btn btn-primary">
          Simular Analytics
        </button>
        <button @click="simulateMarketing" class="btn btn-success">
          Simular Marketing
        </button>
        <button @click="resetDemo" class="btn btn-warning">
          Reset Demo
        </button>
      </div>
    </div>

    <div class="example-section">
      <h3>Código de Implementação</h3>
      <div class="code-example">
        <pre><code>// Em qualquer componente Vue
import { useCookies } from '@/composables/useCookies'

export default {
  setup() {
    const { 
      cookiesAccepted, 
      isAnalyticsActive, 
      isMarketingActive 
    } = useCookies()

    // Carregar recursos condicionalmente
    if (isAnalyticsActive()) {
      // Carregar Google Analytics
      loadGoogleAnalytics()
    }

    if (isMarketingActive()) {
      // Carregar Facebook Pixel
      loadFacebookPixel()
    }

    return {
      cookiesAccepted,
      isAnalyticsActive,
      isMarketingActive
    }
  }
}</code></pre>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useCookies } from '../../composables/useCookies'

export default {
  name: 'CookieUsageExample',
  setup() {
    const { cookiesAccepted, isAnalyticsActive, isMarketingActive } = useCookies()
    
    // Dados de exemplo
    const activeUsers = ref(0)
    const conversions = ref(0)

    // Simular dados de analytics
    const simulateAnalytics = () => {
      if (isAnalyticsActive()) {
        activeUsers.value = Math.floor(Math.random() * 1000) + 100
      }
    }

    // Simular dados de marketing
    const simulateMarketing = () => {
      if (isMarketingActive()) {
        conversions.value = Math.floor(Math.random() * 50) + 5
      }
    }

    // Reset do demo
    const resetDemo = () => {
      activeUsers.value = 0
      conversions.value = 0
    }

    // Simular dados iniciais
    onMounted(() => {
      if (isAnalyticsActive()) {
        activeUsers.value = 342
      }
      if (isMarketingActive()) {
        conversions.value = 23
      }
    })

    return {
      cookiesAccepted,
      isAnalyticsActive,
      isMarketingActive,
      activeUsers,
      conversions,
      simulateAnalytics,
      simulateMarketing,
      resetDemo
    }
  }
}
</script>

<style scoped>
.cookie-usage-example {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.example-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  background: #f8f9fa;
}

.example-section h3 {
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.2rem;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #dee2e6;
}

.status-label {
  font-weight: 500;
  color: #495057;
}

.status-value {
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  background: #f8f9fa;
}

.status-value.active {
  background: #d4edda;
  color: #155724;
}

.example-code {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #dee2e6;
}

.analytics-demo,
.marketing-demo,
.analytics-disabled,
.marketing-disabled {
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 8px;
  border-left: 4px solid;
}

.analytics-demo {
  background: #d1ecf1;
  border-left-color: #17a2b8;
}

.marketing-demo {
  background: #d4edda;
  border-left-color: #28a745;
}

.analytics-disabled,
.marketing-disabled {
  background: #f8d7da;
  border-left-color: #dc3545;
}

.demo-metric {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 4px;
}

.metric-label {
  font-weight: 500;
}

.metric-value {
  font-weight: 600;
  color: #007bff;
}

.test-controls {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover {
  background: #0056b3;
}

.btn-success {
  background: #28a745;
  color: white;
}

.btn-success:hover {
  background: #1e7e34;
}

.btn-warning {
  background: #ffc107;
  color: #212529;
}

.btn-warning:hover {
  background: #e0a800;
}

.code-example {
  background: #2d3748;
  color: #e2e8f0;
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
}

.code-example pre {
  margin: 0;
}

.code-example code {
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  line-height: 1.5;
}

/* Responsividade */
@media (max-width: 768px) {
  .cookie-usage-example {
    padding: 1rem;
  }
  
  .status-grid {
    grid-template-columns: 1fr;
  }
  
  .test-controls {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
}
</style>
