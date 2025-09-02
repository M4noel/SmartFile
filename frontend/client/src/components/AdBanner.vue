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
  size: { type: String, default: 'auto' }, // 'auto' ou '728x90', '300x250' etc.
  adSlot: { type: String, required: true } // coloque aqui seu slot do AdSense
});

const adContainer = ref(null);
const adClient = computed(() => 'ca-pub-5604948783210108');
const adFormat = computed(() => props.size === 'auto' ? 'auto' : undefined);

const containerStyle = computed(() => {
  if (props.size === 'auto') return { width: '100%', height: 'auto' };
  const parts = props.size.split('x');
  return { width: parts[0] + 'px', height: parts[1] + 'px', margin: '0 auto' };
});

onMounted(() => {
  const initAd = () => {
    if (!window.adsbygoogle) {
      // espera 200ms e tenta de novo até o script carregar
      setTimeout(initAd, 200);
      return;
    }
    try {
      (adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('Erro ao carregar anúncio:', e);
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
  margin: 1rem 0;
}
</style>
