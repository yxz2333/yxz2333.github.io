<script setup>
import { ref, onMounted, computed } from 'vue'
import { homeSections } from '../data/site.js'

const notes = ref([])
onMounted(async () => {
  const dirs = ['p', 'k', 'c']
  const all = []
  for (const d of dirs) {
    const res = await fetch(`${import.meta.env.BASE_URL}${d}/index.json`)
    if (res.ok) all.push(...(await res.json()).notes)
  }
  // 全量排序：parsed_at 倒序 → updated_at 倒序
  all.sort((a, b) => (b.parsed_at || '').localeCompare(a.parsed_at || '')
    || (b.updated_at || '').localeCompare(a.updated_at || ''))
  notes.value = all
})

const TYPE_LABEL = { '题目': '题目题解', '知识点': '算法知识点', '比赛': '比赛题解' }

const categories = computed(() => {
  const map = {}
  for (const n of notes.value) {
    const name = TYPE_LABEL[n.type] || n.type
    if (!map[name]) map[name] = { name, count: 0, latest: null }
    map[name].count++
    // 已全局排序，首次遇到即为最新
    if (!map[name].latest) map[name].latest = n
  }
  // order by homeSections
  const order = homeSections.map(s => s.name)
  return Object.values(map).sort((a, b) => {
    const ai = order.indexOf(a.name), bi = order.indexOf(b.name)
    return (ai >= 0 ? ai : 99) - (bi >= 0 ? bi : 99)
  })
})
</script>

<template>
  <div class="min-h-screen text-gray-300 font-sans relative">
    <main class="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-20">
      <div class="mb-12 animate-fade-in-up">
        <h1 class="text-3xl md:text-4xl font-bold text-white mb-4">全部分类</h1>
        <p class="text-gray-500">共 {{ categories.length }} 个分类，{{ notes.length }} 篇笔记</p>
      </div>

      <div class="space-y-4">
        <RouterLink
          v-for="cat in categories"
          :key="cat.name"
          :to="`/type/${cat.name}`"
          class="glass-card rounded-3xl p-6 animate-fade-in-up hover:border-white/10 transition-all cursor-pointer group block"
        >
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-xl font-bold text-gray-200 group-hover:text-accent transition-colors">
                📁 {{ cat.name }}
              </h2>
              <p class="text-sm text-gray-500 mt-1">最新：{{ cat.latest?.title }}</p>
            </div>
            <div class="text-right">
              <span class="text-3xl font-bold text-accent font-mono">{{ cat.count }}</span>
              <p class="text-xs text-gray-500">篇</p>
            </div>
          </div>
        </RouterLink>
      </div>
    </main>
  </div>
</template>
