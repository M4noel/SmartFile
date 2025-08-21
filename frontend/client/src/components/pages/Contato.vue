<template>
  <div class="contato-container">
    <div class="contato-header">
      <h1>Entre em Contato</h1>
      <p>Precisa de ajuda? Tem uma sugestão? Quer reportar um problema? Entre em contato conosco!</p>
    </div>

    <div class="contato-content">
      <div class="contato-info">
        <div class="info-card">
          <div class="info-icon">📧</div>
          <h3>Email</h3>
          <!-- <p>murilomanoel221@gmail.com</p> -->
        </div>
        
        <div class="info-card">
          <div class="info-icon">⚡</div>
          <h3>Resposta Rápida</h3>
          <p>Respondemos em até 24 horas</p>
        </div>
        
        <div class="info-card">
          <div class="info-icon">🛠️</div>
          <h3>Suporte Técnico</h3>
          <p>Problemas com as ferramentas</p>
        </div>
      </div>

      <div class="contato-form">
        <h2>Envie sua Mensagem</h2>
        <form @submit.prevent="enviarMensagem">
          <div class="form-group">
            <label for="nome">Nome *</label>
            <input 
              type="text" 
              id="nome" 
              v-model="form.nome" 
              required 
              placeholder="Seu nome completo"
            />
          </div>

          <div class="form-group">
            <label for="email">Email *</label>
            <input 
              type="email" 
              id="email" 
              v-model="form.email" 
              required 
              placeholder="seu@email.com"
            />
          </div>

          <div class="form-group">
            <label for="assunto">Assunto *</label>
            <select id="assunto" v-model="form.assunto" required>
              <option value="">Selecione um assunto</option>
              <option value="duvida">Dúvida sobre ferramentas</option>
              <option value="problema">Reportar problema</option>
              <option value="sugestao">Sugestão</option>
              <option value="parceria">Proposta de parceria</option>
              <option value="outro">Outro</option>
            </select>
          </div>

          <div class="form-group">
            <label for="mensagem">Mensagem *</label>
            <textarea 
              id="mensagem" 
              v-model="form.mensagem" 
              required 
              rows="6"
              placeholder="Descreva sua dúvida, problema ou sugestão..."
            ></textarea>
          </div>

          <button type="submit" :disabled="enviando" class="btn-enviar">
            <span v-if="enviando">Enviando...</span>
            <span v-else>Enviar Mensagem</span>
          </button>
        </form>
      </div>
    </div>

    <div class="contato-faq">
      <h2>Perguntas Frequentes</h2>
      <div class="faq-item">
        <h3>Como usar as ferramentas de PDF?</h3>
        <p>Nossas ferramentas são intuitivas! Basta fazer upload do arquivo, configurar as opções desejadas e baixar o resultado.</p>
      </div>
      
      <div class="faq-item">
        <h3>Os arquivos ficam seguros?</h3>
        <p>Sim! Todos os arquivos são processados localmente e excluídos automaticamente após o processamento. Não armazenamos seus dados.</p>
      </div>
      
      <div class="faq-item">
        <h3>Quais formatos são suportados?</h3>
        <p>Suportamos PDF, JPG, PNG, DOC, DOCX e muitos outros formatos. Consulte a página de cada ferramenta para detalhes.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import axios from 'axios'

export default {
  name: 'Contato',
  setup() {
    const form = ref({
      nome: '',
      email: '',
      assunto: '',
      mensagem: ''
    })
    
    const enviando = ref(false)

    const enviarMensagem = async () => {
      if (enviando.value) return
      
      enviando.value = true
      
      try {
        const response = await axios.post('/api/contato', {
          nome: form.value.nome,
          email: form.value.email,
          assunto: form.value.assunto,
          mensagem: form.value.mensagem
        })
        
        if (response.data.success) {
          if (window.showNotification) {
            window.showNotification.success('Mensagem enviada com sucesso! Entraremos em contato em breve.')
          } else {
            alert('Mensagem enviada com sucesso! Entraremos em contato em breve.')
          }
          
          // Limpar formulário
          form.value = {
            nome: '',
            email: '',
            assunto: '',
            mensagem: ''
          }
        }
      } catch (error) {
        console.error('Erro ao enviar mensagem:', error)
        if (window.showNotification) {
          window.showNotification.error('Erro ao enviar mensagem. Tente novamente.')
        } else {
          alert('Erro ao enviar mensagem. Tente novamente.')
        }
      } finally {
        enviando.value = false
      }
    }

    return {
      form,
      enviando,
      enviarMensagem
    }
  }
}
</script>

<style scoped>
.contato-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.contato-header {
  text-align: center;
  margin-bottom: 3rem;
}

.contato-header h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.contato-header p {
  font-size: 1.1rem;
  color: #7f8c8d;
  max-width: 600px;
  margin: 0 auto;
}

.contato-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 3rem;
  margin-bottom: 4rem;
}

.contato-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-card {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  border: 1px solid #e9ecef;
  transition: transform 0.2s, box-shadow 0.2s;
}

.info-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
}

.info-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.info-card h3 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.info-card p {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.contato-form {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  border: 1px solid #e9ecef;
}

.contato-form h2 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 500;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3498db;
}

.form-group textarea {
  resize: vertical;
  min-height: 120px;
}

.btn-enviar {
  width: 100%;
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-enviar:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(52, 152, 219, 0.3);
}

.btn-enviar:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.contato-faq {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid #e9ecef;
}

.contato-faq h2 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 1.8rem;
}

.faq-item {
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.faq-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.faq-item h3 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.faq-item p {
  color: #7f8c8d;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .contato-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .contato-header h1 {
    font-size: 2rem;
  }
  
  .contato-container {
    padding: 1rem;
  }
}
</style>
