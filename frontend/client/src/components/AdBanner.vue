<template>
  <div class="ad-banner">
    <ins class="adsbygoogle"
         style="display:block;width:100%"
         :data-ad-client="adClient"
         :data-ad-slot="adSlot"
         data-ad-format="auto"
         data-full-width-responsive="true"></ins>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

const props = defineProps({
  adClient: { type: String, default: 'ca-pub-5604948783210108' },
  adSlot: { type: String, default: '1098157652' }
});

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
  margin: 1rem auto;
  text-align: center;
}
</style>
