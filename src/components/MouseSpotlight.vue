<script setup>
import { useMouseSpotlight } from '../composables/useMouseSpotlight'

const { mouseX, mouseY, isActive } = useMouseSpotlight()
</script>

<template>
  <div
    class="pointer-light transition-opacity duration-300"
    :style="{ left: mouseX + 'px', top: mouseY + 'px', opacity: isActive ? 1 : 0 }"
  ></div>
</template>
