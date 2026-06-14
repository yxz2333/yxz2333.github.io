<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { renderLatex } from '../composables/useKatex.js'

const route = useRoute()
const selectedTag = ref(null)
const notes = ref([])

// 抽屉打开时锁定 body 滚动
watch(selectedTag, (val) => {
  document.body.style.overflow = val ? 'hidden' : ''
})

onMounted(async () => {
  const dirs = ['p', 'k', 'c']
  const all = []
  for (const d of dirs) {
    const res = await fetch(`${import.meta.env.BASE_URL}${d}/index.json`)
    if (res.ok) all.push(...(await res.json()).notes)
  }
  notes.value = all
  const q = route.query.tag
  if (q) selectedTag.value = decodeURIComponent(q)
})

const slugToNote = computed(() => {
  const map = {}
  for (const n of notes.value) map[n.slug] = n
  return map
})

function kpUrl(tagName) {
  // tag "博弈论/巴什博弈" → look for note with parent="博弈论" + title="巴什博弈"
  const parts = tagName.split('/')
  if (parts.length === 2) {
    for (const n of notes.value) {
      if (n.parent === parts[0] && n.title === parts[1] && n.type === '知识点') {
        return `/k/${n.slug}`
      }
    }
  }
  // tag "巴什博弈" or "01字典树" → look for direct match
  for (const n of notes.value) {
    if (n.title === tagName && n.type === '知识点') {
      return `/k/${n.slug}`
    }
  }
  return null
}

const allTags = computed(() => {
  const map = {}
  for (const n of notes.value) {
    for (const t of (n.tags || [])) {
      if (!map[t]) map[t] = { name: t, count: 0, articles: [] }
      map[t].count++
      map[t].articles.push({
        id: n.slug,
        title: n.title,
        summary: n.summary || '',
        tags: n.tags || [],
        slug: n.slug,
        route: `/${n.type_directory || ({'题目':'p','知识点':'k','比赛':'c'}[n.type]) || 'notes'}/${n.slug}`,
      })
    }
  }
  return Object.values(map).sort((a, b) => b.count - a.count)
})

const maxCount = computed(() => allTags.value[0]?.count || 1)
function tagOpacity(count) {
  return 0.35 + (count / maxCount.value) * 0.65  // 0.35 ~ 1.0
}

const filteredArticles = computed(() => {
  if (!selectedTag.value) return []
  const tag = allTags.value.find(t => t.name === selectedTag.value)
  return tag ? tag.articles : []
})

const currentKpUrl = computed(() => selectedTag.value ? kpUrl(selectedTag.value) : null)

function cardSummary(summary) {
  if (!summary) return ''
  return renderLatex(summary)
}

function selectTag(name) {
  if (selectedTag.value === name) {
    selectedTag.value = null
    history.replaceState(null, '', '/tags')
  } else {
    selectedTag.value = name
    history.replaceState(null, '', `/tags?tag=${encodeURIComponent(name)}`)
  }
}
</script>

<template>
  <div class="min-h-screen text-gray-300 font-sans relative">
    <main class="relative z-10 max-w-[88rem] mx-auto px-4 lg:px-6 pt-32 pb-20">
      <div class="mb-12 animate-fade-in-up">
        <h1 class="text-3xl md:text-4xl font-bold text-white mb-4">全部标签</h1>
        <p class="text-gray-500">共 {{ allTags.length }} 个标签，{{ notes.length }} 篇笔记</p>
      </div>

      <div class="flex flex-wrap gap-3 mb-12 animate-fade-in-up">
        <button
          v-for="tag in allTags"
          :key="tag.name"
          @click="selectTag(tag.name)"
          class="px-4 py-2 rounded-full transition-all duration-200 border text-sm"
          :class="selectedTag === tag.name
            ? 'bg-accent/20 border-accent/50 text-accent font-bold'
            : 'bg-white/5 border-white/5 hover:text-white hover:bg-white/10'"
          :style="selectedTag !== tag.name ? { opacity: tagOpacity(tag.count) } : {}"
        >
          {{ tag.name }}
          <span class="ml-1 text-xs opacity-70">({{ tag.count }})</span>
        </button>
      </div>
    </main>

    <!-- 抽屉遮罩 -->
    <Transition name="dr-backdrop">
      <div v-if="selectedTag" @click="selectTag(selectedTag)" class="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"></div>
    </Transition>

    <!-- 抽屉面板 -->
    <Transition name="dr-panel">
      <div v-if="selectedTag" class="fixed top-0 right-0 bottom-0 z-[201] w-[420px] max-w-[90vw] bg-[#121214]/90 backdrop-blur-2xl backdrop-saturate-150 border-l border-white/10 shadow-2xl flex flex-col">
        <div class="p-6 border-b border-white/10 shrink-0 space-y-3">
          <!-- 第一行：tag 名 + 计数 + 叉 -->
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-bold text-white truncate"># {{ selectedTag }}</h2>
            <div class="flex items-center gap-2 shrink-0">
              <p class="text-xs text-gray-500">{{ filteredArticles.length }} 篇</p>
              <button @click="selectTag(selectedTag)" class="text-gray-400 hover:text-white transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
          </div>
          <!-- 第二行：操作按钮 -->
          <div class="flex items-center gap-2">
            <RouterLink
              :to="`/tag/${encodeURIComponent(selectedTag)}`"
              class="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-xs font-bold hover:text-white hover:bg-white/10 transition-colors"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>
              展开全部
            </RouterLink>
            <a
              v-if="currentKpUrl"
              :href="currentKpUrl"
              target="_blank"
              class="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/20 text-accent text-xs font-bold hover:bg-accent/20 transition-colors"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
              知识点
            </a>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto p-6 space-y-3">

          <RouterLink
            v-for="a in filteredArticles"
            :key="a.id"
            :to="a.route"
            class="glass-card rounded-2xl p-4 block group hover:border-white/10 transition-all"
          >
            <h3 class="text-sm font-bold text-gray-200 group-hover:text-accent transition-colors line-clamp-2">{{ a.title }}</h3>
            <p v-if="a.summary" class="text-xs text-gray-500 mt-1.5 leading-relaxed line-clamp-2" v-html="cardSummary(a.summary)"></p>
            <div class="flex gap-2 mt-2 text-xs text-gray-500">
              <span v-for="t in a.tags?.slice(0, 3)" :key="t" class="px-2 py-0.5 rounded-full bg-white/5"># {{ t }}</span>
            </div>
          </RouterLink>

          <p v-if="filteredArticles.length === 0" class="text-sm text-gray-500 text-center py-8">暂无笔记</p>
        </div>
      </div>
    </Transition>
  </div>
</template>
