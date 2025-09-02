<template>
  <div class="ad-banner" :style="{ width: sizeWidth, height: sizeHeight }">
    <ins class="adsbygoogle"
         style="display:block"
         :data-ad-client="adClient"
         :data-ad-slot="adSlot"
         data-ad-format="auto"
         data-full-width-responsive="true"></ins>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';

const props = defineProps({
  size: { type: String, default: '300x250' },
  adSlot: { type: String, required: true } // Cada anúncio terá seu ID do AdSense
});

const adClient = 'ca-pub-5604948783210108'; // Seu ID do AdSense

const sizeParts = props.size.split('x');
const sizeWidth = sizeParts[0] + 'px';
const sizeHeight = sizeParts[1] + 'px';

onMounted(() => {
  try {
    (adsbygoogle = window.adsbygoogle || []).push({});
  } catch (e) {
    console.error('Erro ao carregar AdSense:', e);
  }
});
</script>

<style scoped>
.ad-banner {
  display: flex;
  justify-content: center;
  margin: 1rem auto;
}
</style>
