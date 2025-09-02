<template>
  <div class="ad-banner" ref="adContainer" :style="containerStyle">
    <ins class="adsbygoogle"
         :style="{ display: 'block' }"
         :data-ad-client="adClient"
         :data-ad-slot="adSlot"
         :data-ad-format="adFormat"
         data-full-width-responsive="true">
    </ins>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, computed } from 'vue';

const props = defineProps({
  size: { type: String, default: 'auto' },        // ex: "728x90", "300x250" ou "auto"
  adSlot: { type: String, default: '1098157652' }, // seu slot real
  mode: { type: String, default: 'prod' }         // 'prod' ou 'test'
});

const adContainer = ref(null);

const adClient = computed(() => {
  // Se for modo teste, usar ID de teste do Google
  return props.mode === 'test'
    ? 'ca-pub-3940256099942544'
    : 'ca-pub-5604948783210108'; // substitua pelo seu ID real
});

// Determina formato do anúncio
const adFormat = computed(() => {
  return props.size === 'auto' ? 'auto' : undefined;
});

// Determina tamanho do container
const containerStyle = computed(() => {
  if (props.size === 'auto') return { width: '100%', height: 'auto' };
  const parts = props.size.split('x');
  return { width: parts[0] + 'px', height: parts[1] + 'px' };
});

onMounted(() => {
  // Garante que o container tenha largura antes de inicializar
  const initAd = () => {
    if (!adContainer.value) return;
    const width = adContainer.value.offsetWidth;
    if (width > 0) {
      try {
        (adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error('Erro ao carregar anúncio:', e);
      }
    } else {
      // Tenta novamente em 200ms se ainda não tem largura
      setTimeout(initAd, 200);
    }
  };

  initAd();
});
</script>

<style scoped>
.ad-banner {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1rem auto;
}
</style>
