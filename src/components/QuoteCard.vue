<script setup>
import { ref, onMounted } from 'vue'
import { quotes } from '../data/site.js'

const quoteText = ref('')
const quoteSource = ref('')

onMounted(() => {
  const random = quotes[Math.floor(Math.random() * quotes.length)]
  quoteText.value = random.text
  quoteSource.value = `— ${random.source}`
})
</script>

<template>
  <div class="glass-card rounded-2xl p-5 relative overflow-hidden group animate-fade-in-up hover:border-white/10 transition-colors">
    <!-- Decorative background -->
    <div class="absolute -right-4 -bottom-4 text-7xl opacity-5 text-accent rotate-12 group-hover:scale-110 transition-transform duration-500 select-none">❀</div>

    <div class="relative z-10">
      <h3 class="text-sm font-bold text-gray-200 mb-4 flex items-center gap-2">
        <span class="text-accent">❝</span> 每日一言
      </h3>
      <div class="min-h-[80px] flex flex-col justify-center">
        <p class="text-sm text-gray-300 leading-relaxed font-medium tracking-wide">{{ quoteText }}</p>
        <p class="text-xs text-gray-500 mt-3 text-right block">{{ quoteSource }}</p>
      </div>
    </div>
  </div>
</template>
