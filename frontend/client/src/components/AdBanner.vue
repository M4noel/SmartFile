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
import { ref, onMounted, computed } from 'vue';

const props = defineProps({
  size: { type: String, default: 'auto' },        // "728x90", "300x250" ou "auto"
  adSlot: { type: String, required: true }       // coloque o seu slot aqui, ex: "1098157652"
});

const adContainer = ref(null);

// Coloque seu ID do publisher aqui
const adClient = computed(() => 'ca-pub-5604948783210108');

// Formato do anúncio
const adFormat = computed(() => props.size === 'auto' ? 'auto' : undefined);

// Estilo do container
const containerStyle = computed(() => {
  if (props.size === 'auto') return { width: '100%', height: 'auto' };
  const parts = props.size.split('x');
  return { width: parts[0] + 'px', height: parts[1] + 'px' };
});

onMounted(() => {
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
      setTimeout(initAd, 200); // tenta novamente até carregar
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
