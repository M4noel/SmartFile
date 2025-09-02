<template>
  <div class="ad-banner">
    <ins
      class="adsbygoogle"
      :style="computedStyle"
      data-ad-client="ca-pub-5604948783210108"
      :data-ad-slot="adSlot"
      :data-ad-format="responsive ? 'auto' : undefined"
      :data-full-width-responsive="responsive ? 'true' : 'false'"
    ></ins>
  </div>
</template>

<script setup>
import { onMounted, computed } from "vue";

const props = defineProps({
  adSlot: {
    type: String,
    required: true
  },
  size: {
    type: String,
    default: "" // ex: "728x90" ou "300x250"
  },
  responsive: {
    type: Boolean,
    default: false
  }
});

// Estilo do <ins>
const computedStyle = computed(() => {
  if (props.responsive) {
    // Modo responsivo
    return "display:block; min-height:100px; text-align:center;";
  }

  if (props.size) {
    const [w, h] = props.size.split("x");
    return `display:inline-block;width:${w}px;height:${h}px;`;
  }

  // fallback
  return "display:block; min-height:100px;";
});

onMounted(() => {
  try {
    if (window.adsbygoogle && Array.isArray(window.adsbygoogle)) {
      window.adsbygoogle.push({});
    }
  } catch (e) {
    console.error("Erro ao carregar AdSense:", e);
  }
});
</script>

<style scoped>
.ad-banner {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1rem auto;
  min-height: 100px; /* reserva espaço mesmo antes de carregar */
}
</style>
