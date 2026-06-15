<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import ClockCard from '../components/ClockCard.vue'
import QuoteCard from '../components/QuoteCard.vue'
import SiteStats from '../components/SiteStats.vue'
import TagCloud from '../components/TagCloud.vue'
import ArticleCard from '../components/ArticleCard.vue'
import PixelArt from '../components/PixelArt.vue'
import { homeSections } from '../data/site.js'

// ============ 打字机效果 ============
const roles = ['算法竞赛选手', '全栈开发者', 'AI 探索者', '开源贡献者']
const typedText = ref('')
let roleIdx = 0
let charIdx = 0
let isDeleting = false
let typeTimer = null

function typeEffect() {
  const current = roles[roleIdx]
  if (isDeleting) {
    typedText.value = current.substring(0, charIdx - 1)
    charIdx--
  } else {
    typedText.value = current.substring(0, charIdx + 1)
    charIdx++
  }

  let speed = isDeleting ? 50 : 150
  if (!isDeleting && charIdx === current.length) {
    speed = 2000
    isDeleting = true
  } else if (isDeleting && charIdx === 0) {
    isDeleting = false
    roleIdx = (roleIdx + 1) % roles.length
    speed = 500
  }
  typeTimer = setTimeout(typeEffect, speed)
}

// ============ 标签云数据 ============
const tagCloud = computed(() => {
  const acc = []
  for (const n of noteIndex.value) {
    for (const t of (n.tags || [])) {
      const item = acc.find(x => x.name === t)
      if (item) item.count++
      else acc.push({ name: t, count: 1 })
    }
  }
  return acc
})

// ============ 笔记数据加载 ============
const noteIndex = ref([])
onMounted(async () => {
  const dirs = ['p', 'k', 'c', 'other']
  const all = []
  for (const d of dirs) {
    const res = await fetch(`${import.meta.env.BASE_URL}${d}/index.json`)
    if (res.ok) {
      try { all.push(...(await res.json()).notes) } catch { /* Vite fallback HTML */ }
    }
  }
  noteIndex.value = all
})

// ============ 分类标签 ============
const activeTab = ref('首页')
const categoryTabs = homeSections.map(s => s.name)
const MAX_PER_TAB = 8
const TYPE_TO_DIR = { '题目': 'p', '知识点': 'k', '比赛': 'c', '其它': 'other' }
const TYPE_TO_TAB = { '题目': '题目题解', '知识点': '算法知识点', '比赛': '比赛题解', '其它': '其它' }

function noteToArticle(n, opts = {}) {
  const dir = n.type_directory || TYPE_TO_DIR[n.type] || 'notes'
  return {
    id: n.slug,
    title: n.title,
    category: n.type,
    summary: n.summary || '',
    tags: n.tags || [],
    date: (n.updated_at || n.parsed_at || '').slice(0, 10),
    slug: n.slug,
    route: `/${dir}/${n.slug}`,
    pinned: opts.pinned || false,
  }
}

const filteredArticles = computed(() => {
  const section = homeSections.find(s => s.name === activeTab.value)
  if (!section) return []

  // 首页：按 articles 数组顺序，标记置顶
  if (activeTab.value === '首页') {
    const slugMap = {}
    for (const n of noteIndex.value) slugMap[n.slug] = n
    return section.articles
      .map(slug => slugMap[slug])
      .filter(Boolean)
      .map(n => noteToArticle(n, { pinned: true }))
  }

  // 其他分类：置顶文章在前，剩余按时间补足
  const slugMap = {}
  for (const n of noteIndex.value) slugMap[n.slug] = n
  const pinned = section.articles.map(slug => slugMap[slug]).filter(Boolean)
  const pinnedSet = new Set(pinned.map(n => n.slug))
  const rest = noteIndex.value
    .filter(n => TYPE_TO_TAB[n.type] === activeTab.value && !pinnedSet.has(n.slug))
  rest.sort((a, b) => (b.parsed_at || '').localeCompare(a.parsed_at || '')
    || (b.updated_at || '').localeCompare(a.updated_at || ''))
  return [
    ...pinned.map(n => noteToArticle(n, { pinned: true })),
    ...rest.slice(0, MAX_PER_TAB - pinned.length).map(n => noteToArticle(n)),
  ]
})

onMounted(() => typeEffect())
onUnmounted(() => clearTimeout(typeTimer))
</script>

<template>
  <div class="min-h-screen text-gray-300 font-sans relative z-0 selection:bg-accent/30 selection:text-accent">
    <!-- ======== 内容层 ======== -->
    <main class="relative z-10 max-w-[88rem] mx-auto px-4 lg:px-6 pt-32 pb-20">
      <!-- Hero -->
      <section class="mb-20 flex flex-col items-center justify-center text-center">
        <h1 class="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 mb-6 tracking-tight">
          Hello World.
        </h1>
        <div class="text-xl md:text-2xl text-gray-400 font-light flex items-center gap-1">
          <span>一个热爱技术与生活的</span>
          <strong class="text-accent">{{ typedText }}</strong>
          <span class="animate-blink text-accent font-normal">|</span>
        </div>
      </section>

      <!-- 主网格 -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- 左侧：文章列表 -->
        <div class="lg:col-span-9 space-y-6">
          <!-- 分类标签栏 -->
          <div class="glass-card rounded-full p-1 flex items-center overflow-x-auto scrollbar-hide animate-fade-in-up">
            <button
              v-for="tab in categoryTabs"
              :key="tab"
              class="px-6 py-2 rounded-full text-sm font-medium transition-all shrink-0"
              :class="activeTab === tab ? 'bg-accent text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-white/5'"
              @click="activeTab = tab"
            >
              {{ tab }}
            </button>
            <div class="flex-grow"></div>
            <RouterLink to="/categories" class="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors shrink-0 flex items-center gap-1">» 更多</RouterLink>
          </div>

          <!-- 文章卡片 -->
          <div class="space-y-4">
            <ArticleCard v-for="(article, i) in filteredArticles" :key="article.id" :article="article" :index="i" />
          </div>
        </div>

        <!-- 右侧：侧边栏 -->
        <aside class="hidden lg:block lg:col-span-3 space-y-6">
          <ClockCard />
          <QuoteCard />
          <SiteStats />
          <TagCloud :tags="tagCloud" />
          <PixelArt />
        </aside>
      </div>
    </main>
  </div>
</template>
