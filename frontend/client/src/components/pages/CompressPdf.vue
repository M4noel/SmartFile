<template>
  <div class="compress-pdf-page">
    <div class="feature-badges">
      <span class="badge large-file">Até 50 MB por arquivo</span>
      <span class="badge no-watermark">Sem marca d'água</span>
      <span class="badge fast">Processamento em segundos</span>
    </div>
    
    <h1>📦 Comprimir PDF</h1>
    <p class="subtitle">Reduza o tamanho dos seus arquivos PDF mantendo a qualidade!</p>
    
    <FileDrop @file-changed="handleFile" accept=".pdf" />
    
    <!-- Preview do PDF carregado -->
    <div class="pdf-preview-section">
      <h2>Preview do PDF</h2>
      <div class="pdf-viewer-container">
        <div class="pdf-viewer-wrapper">
          <div v-if="file" class="pdf-info">
            <div class="pdf-icon">📄</div>
            <div class="pdf-details">
              <h3>{{ file.name }}</h3>
              <p>Tamanho: {{ formatSize(file.size) }}</p>
              <p v-if="pageCount">Páginas: {{ pageCount }}</p>
            </div>
          </div>
          <div v-else class="preview-placeholder">
            <div class="placeholder-content">
              <div class="placeholder-icon">📄</div>
              <p>Selecione um PDF para comprimir</p>
              <p class="placeholder-subtext">Ou arraste e solte um PDF aqui</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Opções para compressão -->
    <div class="compression-options">
      <h3>Configurações de Compressão</h3>
      <div class="form-group">
        <label for="quality">Qualidade de Compressão:</label>
        <select 
          id="quality" 
          v-model="quality" 
          class="quality-select"
        >
          <option value="low">Baixa (Máxima compressão)</option>
          <option value="medium">Média (Compressão equilibrada)</option>
          <option value="high">Alta (Mínima compressão)</option>
        </select>
      </div>
      
      <p class="info-text">
        <strong>Baixa:</strong> Reduz significativamente o tamanho, pode afetar a qualidade<br>
        <strong>Média:</strong> Compressão equilibrada entre tamanho e qualidade<br>
        <strong>Alta:</strong> Reduz pouco o tamanho, mantém a qualidade original
      </p>
    </div>

    <div v-if="processing" class="progress-bar">
      <div class="progress-fill" :style="{ width: progress + '%' }"></div>
    </div>

    <button @click="compressPdf" :disabled="!file || processing" class="primary-btn">
      {{ processing ? 'Comprimindo PDF...' : 'Comprimir PDF' }}
    </button>

    <AdBanner v-if="!result" size="300x250" />

    <div v-if="result" class="result">
      <h3>✅ PDF comprimido com sucesso!</h3>
      <p>Seu PDF foi comprimido e está pronto para download.</p>
      <div class="compression-stats">
        <p><strong>Tamanho original:</strong> {{ formatSize(originalSize) }}</p>
        <p><strong>Tamanho comprimido:</strong> {{ formatSize(result.size) }}</p>
        <p><strong>Redução:</strong> {{ result.reduction }}%</p>
      </div>
      <a :href="result.url" download="pdf-comprimido.pdf" class="download-btn">Baixar PDF Comprimido</a>
    </div>
    
    <div v-if="error" class="error">
      <h3>❌ Erro ao comprimir PDF</h3>
      <p>{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import FileDrop from '@/components/FileDrop.vue';
import AdBanner from '@/components/AdBanner.vue';

const file = ref(null);
const quality = ref('medium');
const processing = ref(false);
const progress = ref(0);
const result = ref(null);
const error = ref(null);
const pageCount = ref(0);
const originalSize = ref(0);

const handleFile = (uploadedFile) => {
  file.value = uploadedFile;
  result.value = null;
  error.value = null;
  progress.value = 0;
  pageCount.value = 0;
  originalSize.value = uploadedFile ? uploadedFile.size : 0;
  
  // Tentar estimar o número de páginas com base no tamanho do arquivo
  if (uploadedFile) {
    // Estimativa mais precisa baseada em estatísticas reais de PDFs
    const sizeInKB = uploadedFile.size / 1024;
    
    // Estimativa baseada em tamanho médio por página
    // PDFs com texto simples: ~50-100KB por página
    // PDFs com imagens: ~200-500KB por página
    // PDFs com gráficos complexos: ~500KB-1MB por página
    
    if (sizeInKB < 50) {
      pageCount.value = 1;
    } else if (sizeInKB < 150) {
      pageCount.value = 1;
    } else if (sizeInKB < 300) {
      pageCount.value = 2;
    } else if (sizeInKB < 600) {
      pageCount.value = 3;
    } else if (sizeInKB < 1000) {
      pageCount.value = 4;
    } else if (sizeInKB < 2000) {
      pageCount.value = 5;
    } else {
      // Para arquivos muito grandes, usar uma estimativa mais conservadora
      pageCount.value = Math.max(5, Math.min(20, Math.floor(sizeInKB / 300)));
    }
  }
};

const compressPdf = async () => {
  if (!file.value) {
    error.value = 'Por favor, selecione um arquivo PDF.';
    return;
  }

  processing.value = true;
  progress.value = 0;
  result.value = null;
  error.value = null;
  
  // Simulate progress for better UX
  const progressInterval = setInterval(() => {
    if (progress.value < 90) {
      progress.value += 10;
    }
  }, 200);
  
  const formData = new FormData();
  formData.append('pdf', file.value);
  formData.append('quality', quality.value);

  try {
    const response = await axios.post('/api/compress-pdf', formData, {
      responseType: 'blob',
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          progress.value = Math.round((progressEvent.loaded / progressEvent.total) * 50);
        }
      }
    });
    
    // Complete progress
    progress.value = 100;
    
    // Calcular estatísticas de compressão
    const compressedSize = response.data.size;
    const reduction = Math.round((1 - compressedSize / originalSize.value) * 100);
    
    result.value = {
      url: URL.createObjectURL(response.data),
      size: compressedSize,
      reduction: reduction
    };
  } catch (err) {
    if (err.response?.data) {
      // Tentar ler a mensagem de erro como texto
      const reader = new FileReader();
      reader.onload = () => {
        error.value = reader.result || 'Erro ao comprimir PDF.';
      };
      reader.onerror = () => {
        error.value = 'Erro ao comprimir PDF.';
      };
      reader.readAsText(err.response.data);
    } else {
      error.value = 'Erro ao comprimir PDF: ' + (err.message || 'Erro desconhecido');
    }
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
</script>

<style scoped>
.compress-pdf-page {
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

.pdf-preview-section {
  margin: 2rem 0;
}

.pdf-preview-section h2 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.pdf-viewer-container {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  overflow: hidden;
  background: #f8f9fa;
}

.pdf-viewer-wrapper {
  position: relative;
  min-height: 200px;
  background: #fff;
}

.pdf-info {
  display: flex;
  align-items: center;
  padding: 2rem;
  gap: 1.5rem;
}

.pdf-icon {
  font-size: 4rem;
  color: #3498db;
}

.pdf-details h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.2rem;
}

.pdf-details p {
  margin: 0.25rem 0;
  color: #666;
  font-size: 1rem;
}

.preview-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
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

.compression-options {
  margin: 2rem 0;
  padding: 1.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  background: #fff;
}

.compression-options h3 {
  margin-top: 0;
  color: #333;
  font-size: 1.3rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.75rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #444;
}

.quality-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;
  background: white;
}

.quality-select:focus {
  border-color: #2a75ff;
  outline: none;
  box-shadow: 0 0 0 2px rgba(42, 117, 255, 0.2);
}

.info-text {
  color: #666;
  font-size: 0.9rem;
  margin-top: 1rem;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 6px;
  line-height: 1.5;
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

.result, .error {
  margin-top: 2rem;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  text-align: center;
}

.result {
  background: linear-gradient(135deg, #f0fff0, #e6ffe6);
  border: 1px solid #d0f0d0;
}

.error {
  background: linear-gradient(135deg, #ffe0e0, #ffd0d0);
  border: 1px solid #ff0000;
}

.result h3, .error h3 {
  margin-top: 0;
}

.result h3 {
  color: #0d7a4f;
}

.error h3 {
  color: #c00000;
}

.compression-stats {
  margin: 1rem 0;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  text-align: left;
}

.compression-stats p {
  margin: 0.5rem 0;
  color: #333;
}

.download-btn {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.85rem 1.75rem;
  background: linear-gradient(135deg, #2a75ff, #1a65e0);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(42, 117, 255, 0.3);
}

.download-btn:hover {
  background: linear-gradient(135deg, #1a65e0, #0a55d0);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(42, 117, 255, 0.4);
}

@media (max-width: 768px) {
  .pdf-info {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .compression-options {
    padding: 1rem;
  }
}
</style>
