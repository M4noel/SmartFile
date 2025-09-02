<template>
  <div class="ad-banner">
    <ins class="adsbygoogle"
         :style="adStyle"
         :data-ad-client="adClient"
         :data-ad-slot="adSlot"
         data-ad-format="auto"
         data-full-width-responsive="true"></ins>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';

const props = defineProps({
  adClient: {
    type: String,
    default: 'ca-pub-5604948783210108' // substitua pelo seu ID do publisher
  },
  adSlot: {
    type: String,
    default: '1098157652' // substitua pelo seu ID do anúncio
  },
  width: {
    type: [String, Number],
    default: '100%' // pode passar número em px ou % para responsivo
  },
  height: {
    type: [String, Number],
    default: 'auto' // altura automática
  }
});

// Computa o style do ins
const adStyle = ref(`display:block;width:${props.width};height:${props.height}`);

onMounted(() => {
  try {
    // Garante que o AdSense seja carregado quando o componente montar
    (adsbygoogle = window.adsbygoogle || []).push({});
  } catch (e) {
    console.error('Erro ao carregar AdSense:', e);
  }
});

// Recarrega o anúncio se as props width ou height mudarem
watch([() => props.width, () => props.height], () => {
  adStyle.value = `display:block;width:${props.width};height:${props.height}`;
  try {
    (adsbygoogle = window.adsbygoogle || []).push({});
  } catch (e) {
    console.error('Erro ao atualizar AdSense:', e);
  }
});
</script>

<style scoped>
.ad-banner {
  margin: 1rem auto;
  text-align: center;
}
</style>
