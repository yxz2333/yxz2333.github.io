<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { RouterLink } from 'vue-router'
import { renderLatex } from '../composables/useKatex.js'

const emit = defineEmits(['close'])
const query = ref('')
const inputRef = ref(null)
const notes = ref([])
const selectedIdx = ref(0)
const visible = ref(false)

onMounted(() => {
  document.body.style.overflow = 'hidden'
  requestAnimationFrame(() => { visible.value = true })
})
onUnmounted(() => { document.body.style.overflow = '' })

onMounted(async () => {
  const all = []
  for (const d of ['p', 'k', 'c', 'other']) {
    const res = await fetch(`${import.meta.env.BASE_URL}${d}/index.json`)
    if (res.ok) {
      try { all.push(...(await res.json()).notes) } catch { /* Vite fallback HTML */ }
    }
  }
  notes.value = all.map(n => ({
    slug: n.slug,
    title: n.title,
    type: n.type,
    tags: n.tags || [],
    summary: n.summary || '',
    route: `/${n.type_directory || ({'题目':'p','知识点':'k','比赛':'c','其它':'other'}[n.type]) || 'notes'}/${n.slug}`,
  }))
  nextTick(() => inputRef.value?.focus())
})

onMounted(() => document.addEventListener('keydown', onKey))
onUnmounted(() => document.removeEventListener('keydown', onKey))

const results = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return []
  return notes.value
    .filter(n => {
      if (n.title.toLowerCase().includes(q)) return true
      if (n.tags.some(t => t.toLowerCase().includes(q))) return true
      if (n.summary.toLowerCase().includes(q)) return true
      return false
    })
    .slice(0, 20)
})

function doClose() {
  visible.value = false
  setTimeout(() => emit('close'), 300)
}

function onKey(e) {
  if (e.key === 'Escape') { doClose(); return }
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    selectedIdx.value = Math.min(selectedIdx.value + 1, results.value.length - 1)
  }
  if (e.key === 'ArrowUp') {
    e.preventDefault()
    selectedIdx.value = Math.max(selectedIdx.value - 1, 0)
  }
  if (e.key === 'Enter' && results.value[selectedIdx.value]) {
    // 通过点击隐藏的 RouterLink 触发导航
    document.getElementById(`search-result-${selectedIdx.value}`)?.click()
    doClose()
  }
}

// query 变化时重置选中
watch(query, () => { selectedIdx.value = 0 })
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-[300] transition-opacity duration-300" :class="visible ? 'opacity-100' : 'opacity-0 pointer-events-none'">
      <!-- 遮罩 -->
      <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="doClose"></div>
      <!-- 搜索框 -->
      <div class="absolute inset-x-0 top-[20vh] mx-auto max-w-[36rem] px-4">
        <div class="glass-panel rounded-3xl overflow-hidden shadow-2xl border border-white/20">
        <!-- 输入区 -->
        <div class="flex items-center gap-3 px-5 py-4 border-b border-white/10">
          <svg class="w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <input
            ref="inputRef"
            v-model="query"
            type="text"
            placeholder="搜索笔记标题 / 标签 / 摘要..."
            class="flex-1 bg-transparent text-white text-base outline-none placeholder-gray-500"
          />
          <button @click="doClose()" class="text-gray-400 hover:text-white shrink-0">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <!-- 结果列表 -->
        <div v-if="results.length" class="max-h-[50vh] overflow-y-auto divide-y divide-white/5">
          <RouterLink
            v-for="(n, i) in results"
            :key="n.slug"
            :id="`search-result-${i}`"
            :to="n.route"
            @click="doClose()"
            class="block px-5 py-3 hover:bg-white/5 transition-colors"
            :class="{ 'bg-white/10': i === selectedIdx }"
          >
            <div class="flex items-center gap-2 mb-0.5">
              <span class="text-xs px-1.5 py-0.5 rounded font-bold uppercase tracking-wider"
                :class="n.type === '题目' ? 'bg-accent/20 text-accent' : n.type === '知识点' ? 'bg-blue-500/20 text-blue-400' : n.type === '比赛' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-purple-500/20 text-purple-400'">
                {{ n.type }}
              </span>
              <span class="text-sm font-bold text-gray-200">{{ n.title }}</span>
            </div>
            <p v-if="n.summary" class="text-xs text-gray-500 line-clamp-1 mt-1" v-html="renderLatex(n.summary)"></p>
          </RouterLink>
        </div>
        <div v-else-if="query.trim()" class="px-5 py-8 text-center text-sm text-gray-500">
          未找到相关笔记
        </div>
      </div>
    </div>
    </div>
  </Teleport>
</template>
