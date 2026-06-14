<script setup>
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
import ParticleCanvas from '../components/ParticleCanvas.vue'
import MouseSpotlight from '../components/MouseSpotlight.vue'
</script>

<template>
  <div class="flex flex-col min-h-screen isolate bg-bg-dark">
    <ParticleCanvas />
    <MouseSpotlight />
    <AppHeader />
    <main class="flex-grow">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
