<template>
  <div class="ad-banner">
    <ins class="adsbygoogle"
         style="display:block"
         data-ad-client="ca-pub-3940256099942544"
         data-ad-slot="2005665936"
         data-ad-format="auto"
         data-full-width-responsive="true"></ins>
  </div>
</template>

<script>
export default {
  name: "AdBanner",
  mounted() {
    try {
      (adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("Erro ao carregar anúncio de teste:", e);
    }
  }
};
</script>
