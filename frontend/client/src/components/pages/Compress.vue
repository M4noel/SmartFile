<template>
  <div class="compress-page">
    <div class="feature-badges">
      <span class="badge large-file">Até 50 MB por arquivo</span>
      <span class="badge no-watermark">Sem marca d'água</span>
      <span class="badge fast">Processamento em segundos</span>
    </div>
    
    <h1>📷 Comprimir Imagem Profissional</h1>
    <p class="subtitle">Reduza o tamanho das suas imagens sem perder qualidade!</p>
    
    <FileDrop @file-changed="handleFile" accept="image/*" />
    
    <!-- Preview da imagem carregada -->
    <div class="image-preview-section">
      <h2>Preview da Imagem</h2>
      <div class="image-viewer-container">
        <div class="image-viewer-wrapper">
          <img v-if="preview" :src="preview" alt="Preview" class="preview-image" />
          <div v-else class="preview-placeholder">
            <div class="placeholder-content">
              <div class="placeholder-icon">📷</div>
              <p>Selecione uma imagem para visualizar</p>
              <p class="placeholder-subtext">Ou arraste e solte uma imagem aqui</p>
            </div>
          </div>
          <div v-if="file" class="image-info">
            <p>Tamanho original: {{ formatSize(originalSize) }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="processing" class="progress-bar">
      <div class="progress-fill" :style="{ width: progress + '%' }"></div>
    </div>

    <button @click="compress" :disabled="!file || processing" class="primary-btn">
      {{ processing ? 'Comprimindo...' : 'Comprimir' }}
    </button>

    <AdBanner v-if="!result" size="300x250" />

    <div v-if="result" class="result">
      <p>✅ Tamanho final: {{ formatSize(result.size) }} ({{ compressionRate }}% menor)</p>
      <button 
        @click="handleDownload" 
        class="download-btn"
        :disabled="processing"
      >
        🚀 Baixar Imagem Comprimida
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import axios from 'axios'
import FileDrop from '@/components/FileDrop.vue'
import AdBanner from '@/components/AdBanner.vue'

const file = ref(null)
const preview = ref(null)
const originalSize = ref(0)
const processing = ref(false)
const progress = ref(0)
const result = ref(null)

// Acessar o sistema AdGate global
const adGate = inject('adGate')
const showNotification = inject('showNotification')

const handleFile = (uploadedFile) => {
  file.value = uploadedFile;
  originalSize.value = uploadedFile.size;
  preview.value = URL.createObjectURL(uploadedFile);
  result.value = null;
  progress.value = 0;
};

const compress = async () => {
  processing.value = true
  progress.value = 0
  
  // Simulate progress for better UX
  const progressInterval = setInterval(() => {
    if (progress.value < 90) {
      progress.value += 10;
    }
  }, 200);
  
  const formData = new FormData();
  formData.append('image', file.value);

  try {
    const baseURL = import.meta.env.VITE_API_BASE_URL || '';
    const response = await axios.post(`${baseURL}/api/compress-image`, formData, {
      responseType: 'blob',
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          progress.value = Math.round((progressEvent.loaded / progressEvent.total) * 50);
        }
      }
    });
    
    // Complete progress
    progress.value = 100;
    
    // Get the actual size of the compressed image
    const compressedBlob = response.data;
    result.value = {
      size: compressedBlob.size,
      url: URL.createObjectURL(compressedBlob)
    };
  } catch (error) {
    alert('Erro ao comprimir: ' + error.message);
  } finally {
    clearInterval(progressInterval);
    processing.value = false;
  }
};

const formatSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const compressionRate = computed(() => {
  return result.value 
    ? Math.round((1 - result.value.size / originalSize.value) * 100)
    : 0
})

// Função para lidar com o download protegido por anúncios
const handleDownload = () => {
  if (!result.value) {
    console.error('Nenhum resultado para download')
    return
  }
  
  const fileName = `imagem-comprimida-${Date.now()}.jpg`
  console.log('Iniciando processo de download para:', fileName)
  
  // Função que executa o download real
  const executeDownload = () => {
    console.log('=== EXECUTANDO DOWNLOAD ===', fileName)
    
    try {
      const link = document.createElement('a')
      link.href = result.value.url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      console.log('Download iniciado com sucesso')
      
      // Mostrar notificação de sucesso após um pequeno delay
      setTimeout(() => {
        if (showNotification) {
          showNotification.success(
            'Download Iniciado!',
            `${fileName} está sendo baixado.`,
            4000
          )
        }
      }, 500)
      
    } catch (error) {
      console.error('Erro no download:', error)
      if (showNotification) {
        showNotification.error(
          'Erro no Download',
          'Houve um problema ao iniciar o download.',
          5000
        )
      }
    }
  }
  
  // Usar o sistema AdGate para controlar o download
  if (adGate) {
    adGate.requestDownload(fileName, executeDownload)
  } else {
    // Fallback se o AdGate não estiver disponível
    executeDownload()
  }
}
</script>

<style scoped>
.compress-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.subtitle {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 1.5rem;
}

.feature-badges {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.badge {
  padding: 0.35rem 1rem;
  border-radius: 25px;
  font-size: 0.85rem;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.large-file {
  background: linear-gradient(135deg, #e6fff4, #c2f5e9);
  color: #0d7a4f;
}

.no-watermark {
  background: linear-gradient(135deg, #fff8e6, #ffe8b8);
  color: #e67a00;
}

.fast {
  background: linear-gradient(135deg, #e7f3ff, #c2e0ff);
  color: #1a73e8;
}

.image-preview-section {
  margin: 2rem 0;
}

.image-preview-section h2 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.image-viewer-container {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  overflow: hidden;
  background: #f8f9fa;
}

.image-viewer-wrapper {
  position: relative;
  min-height: 300px;
  background: #fff;
}

.preview-image {
  max-width: 100%;
  max-height: 400px;
  display: block;
  margin: 0 auto;
  padding: 1rem;
}

.preview-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  background: #fafafa;
}

.placeholder-content {
  text-align: center;
  padding: 2rem;
}

.placeholder-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  color: #9e9e9e;
}

.placeholder-content p {
  margin: 0.5rem 0;
  color: #666;
  font-size: 1.1rem;
}

.placeholder-subtext {
  color: #999 !important;
  font-size: 0.9rem !important;
}

.image-info {
  padding: 1rem;
  background: #f8f9fa;
  border-top: 1px solid #eee;
}

.image-info p {
  margin: 0;
  font-weight: 600;
  color: #444;
}

.primary-btn {
  background: linear-gradient(135deg, #2a75ff, #1a65e0) !important;
  color: white !important;
  font-weight: 600 !important;
  padding: 0.85rem 1.75rem !important;
  margin-top: 1rem !important;
  box-shadow: 0 4px 12px rgba(42, 117, 255, 0.3) !important;
}

.primary-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #1a65e0, #0a55d0) !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 6px 16px rgba(42, 117, 255, 0.4) !important;
}

button {
  margin: 5px;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.progress-bar {
  width: 100%;
  height: 12px;
  background: #eee;
  border-radius: 6px;
  overflow: hidden;
  margin: 1.5rem 0;
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #2a75ff, #1a65e0);
  transition: width 0.3s ease;
}

.result {
  margin-top: 2rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f0fff0, #e6ffe6);
  border-radius: 12px;
  border: 1px solid #d0f0d0;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.download-btn {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.85rem 1.75rem;
  background: linear-gradient(135deg, #28a745, #20c997);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 600;
  font-size: 1rem;
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
}

.download-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #20c997, #17a2b8);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(40, 167, 69, 0.4);
}

.download-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}
</style>