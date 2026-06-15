<script setup>
import { ref, onMounted } from 'vue'

const total = ref(0)

function countUp(target, duration = 1500) {
  let start = 0
  const step = target / (duration / 16)
  function animate() {
    start += step
    if (start < target) {
      total.value = Math.floor(start)
      requestAnimationFrame(animate)
    } else {
      total.value = target
    }
  }
  animate()
}

onMounted(async () => {
  let sum = 0
  for (const d of ['p', 'k', 'c', 'other']) {
    const res = await fetch(`${import.meta.env.BASE_URL}${d}/index.json`)
    if (res.ok) {
      try { sum += (await res.json()).count } catch { /* Vite fallback HTML */ }
    }
  }
  countUp(sum)
})
</script>

<template>
  <div class="glass-card rounded-3xl p-6 animate-fade-in-up">
    <h3 class="text-sm font-bold text-gray-300 mb-4 flex items-center gap-2">
      <svg class="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
      站点数据
    </h3>
    <div class="bg-white/5 rounded-2xl p-4 border border-white/5 text-center">
      <p class="text-xs text-gray-500 mb-1">📚 文章总数</p>
      <p class="text-3xl font-bold text-white font-mono">{{ total.toLocaleString() }} 篇</p>
    </div>
  </div>
</template>
