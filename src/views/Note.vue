<script setup>
import { ref, watch, onMounted, onUnmounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { renderLatex } from '../composables/useKatex.js'
import { slugify } from '../composables/useHeading.js'
import TocSidebar from '../components/TocSidebar.vue'
import NoteSection from '../components/NoteSection.vue'
import CommentSection from '../components/CommentSection.vue'

const route = useRoute()
const router = useRouter()
const note = ref(null)
const loading = ref(true)
const error = ref('')

// ======== 滚动进度条 ========
const scrollProgress = ref(0)
function handleScroll() {
  const top = document.body.scrollTop || document.documentElement.scrollTop
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight
  scrollProgress.value = height ? (top / height) * 100 : 0
}
onMounted(() => window.addEventListener('scroll', handleScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))

// ======== 数据加载 ========
const ROUTE_DIR = { 'note-p': 'p', 'note-k': 'k', 'note-c': 'c', 'note-other': 'other', 'note': 'notes' }

async function load() {
  loading.value = true
  error.value = ''
  try {
    const slug = route.params.slug
    const dir = ROUTE_DIR[route.name] || 'notes'
    const res = await fetch(`${import.meta.env.BASE_URL}${dir}/${slug}.json`)
    if (res.ok) {
      try {
        note.value = await res.json()
        note.value.sections = preprocess(note.value.sections)
        loading.value = false
        return
      } catch { /* Vite 返回 HTML fallback，非 JSON → 走别名 */ }
    }
    // slug 不存在或非 JSON → 查别名
    const aliasRes = await fetch(`${import.meta.env.BASE_URL}${dir}/aliases.json`)
    if (aliasRes.ok) {
      const aliases = await aliasRes.json()
      const canonical = aliases[slug]
      if (canonical) {
        router.replace(`/${dir}/${canonical}`)
        return
      }
    }
    throw new Error('not found')
  } catch {
    error.value = '笔记未找到'
  } finally {
    loading.value = false
  }
}

function preprocess(secs) {
  return secs.map(sec => {
    if (sec.type === 'p') return { ...sec, html: renderLatex(sec.html) }
    if (sec.type === 'math') return { ...sec, html: renderLatex(sec.latex) }
    if (sec.type === 'table') return { ...sec, html: rowsToHtml(sec.rows) }
    if (sec.type === 'html') return sec  // 纯 HTML 原样传递
    if (sec.blocks) sec.blocks = preprocess(sec.blocks)
    return sec
  })
}

function rowsToHtml(rows) {
  if (!rows || rows.length === 0) return ''
  // 防御性过滤分隔行
  const dataRows = rows.filter(r => !/^\|[\s\-:|]+\|$/.test(r.trim()))
  if (dataRows.length === 0) return ''
  function cellHtml(raw) {
    return renderLatex(raw.trim())
  }
  const th = dataRows[0]; const tb = dataRows.slice(1)
  const thead = `<thead><tr>${th.split('|').filter(Boolean).map(c => `<th>${cellHtml(c)}</th>`).join('')}</tr></thead>`
  const tbody = tb.length > 0 ? `<tbody>${tb.map(r => `<tr>${r.split('|').filter(Boolean).map(c => `<td>${cellHtml(c)}</td>`).join('')}</tr>`).join('')}</tbody>` : ''
  return `<table class="note-table">${thead}${tbody}</table>`
}

// ======== TOC ========
const tocItems = computed(() => {
  if (!note.value) return []
  const items = []
  function walk(secs) {
    for (const s of secs) {
      if (s.heading) {
        const display = renderLatex(s.heading)
        if (display) {
          items.push({
            id: slugify(s.heading),
            title: display,
            level: s.level - 1,
          })
        }
      }
      if (s.blocks) walk(s.blocks)
    }
  }
  walk(note.value.sections)
  return items
})

const difficultyStars = computed(() => {
  if (!note.value || note.value.difficulty === null) return []
  const d = note.value.difficulty
  const valid = new Set([1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5])
  if (!valid.has(d)) return null
  const result = []
  for (let i = 0; i < Math.floor(d); i++) result.push('full')
  if (d - Math.floor(d) > 0.3) result.push('half')
  return result
})

const hasCode = computed(() => note.value?.code_languages?.length > 0)

const renderedSummary = computed(() => {
  if (!note.value?.summary) return ''
  return renderLatex(note.value.summary)
})

// ======== 推荐数据加载 ========
const recs = ref([])
const hasRecs = computed(() => recs.value.some(g => g.items.length > 0))
const recsSectionId = 'recommendations-section'

async function loadRecs() {
  recs.value = []
  try {
    const res = await fetch(`${import.meta.env.BASE_URL}recommendations.json`)
    if (!res.ok) return
    const data = await res.json()
    const all = data.recommendations || {}
    // 按 block_index 分组，每组取前 3
    const groups = {}
    for (const [key, items] of Object.entries(all)) {
      const m = key.match(/^(.+)::(\d+)$/)
      if (!m || m[1] !== note.value.slug) continue
      const bi = parseInt(m[2])
      if (!groups[bi]) groups[bi] = []
      for (const item of items) {
        groups[bi].push(item)
      }
    }
    // 1 个代码块 → 取 6 篇；2 个代码块 → 各取 3 篇
    const blockIds = Object.keys(groups).sort()
    const perBlock = blockIds.length <= 1 ? 6 : 3
    const result = []
    for (const bi of blockIds) {
      result.push({
        blockIndex: parseInt(bi),
        items: groups[bi].slice(0, perBlock),
      })
    }
    recs.value = result
  } catch { /* 推荐数据不存在或格式错误 */ }
}

const recBlockCount = computed(() => recs.value.length)

onMounted(() => load())
watch(() => route.params.slug, () => load())
// note 加载完成后拉推荐
watch(note, (val) => { if (val) loadRecs() })
</script>

<template>
  <div class="min-h-screen text-gray-300 font-sans relative selection:bg-accent/30 selection:text-accent">
    <!-- 阅读进度条 — 渐变发光 -->
    <div
      class="fixed top-0 left-0 h-1 bg-gradient-to-r from-accent to-yellow-300 z-[60] transition-all duration-150 ease-out shadow-[0_0_10px_rgba(179,139,54,0.8)]"
      :style="{ width: scrollProgress + '%' }"></div>

    <!-- Loading / Error -->
    <div v-if="loading" class="flex items-center justify-center py-40">
      <div
        class="bg-[#121214]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-10 flex flex-col items-center gap-4 shadow-2xl">
        <div class="w-10 h-10 border-4 border-accent/20 border-t-accent rounded-full animate-spin"></div>
        <span class="text-sm text-gray-400 font-medium tracking-widest uppercase">Loading Note...</span>
      </div>
    </div>
    <div v-else-if="error" class="text-center py-40 animate-fade-in-up">
      <p class="text-4xl mb-4">📄</p>
      <h1 class="text-2xl font-bold text-white mb-2">笔记未找到</h1>
      <p class="text-gray-500 mb-8">{{ error }}</p>
      <RouterLink to="/"
        class="inline-block px-6 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-white/10 transition-colors">
        返回首页</RouterLink>
    </div>

    <template v-else>
      <!-- 笔记头部 -->
      <section class="pt-28 pb-10 max-w-[88rem] mx-auto px-5 sm:px-6 lg:px-8 relative z-10 animate-fade-in-up">
        <div class="flex flex-wrap items-center gap-3 mb-6 text-xs">
          <span v-if="note.type" class="px-3 py-1 rounded-md font-bold uppercase tracking-wider"
            :class="note.type === '题目' ? 'bg-accent/20 text-accent border border-accent/30 shadow-[0_0_10px_rgba(179,139,54,0.2)]' : note.type === '知识点' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]' : note.type === '比赛' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(52,211,153,0.2)]' : 'bg-purple-500/20 text-purple-400 border border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.2)]'">
            {{ note.type }}
          </span>
          <span v-if="difficultyStars === null"
            class="text-xs text-gray-500 bg-gray-500/10 px-3 py-1 rounded-md border border-gray-500/20">
            难度未知
          </span>
          <span v-else-if="difficultyStars.length"
            class="text-xs text-yellow-400 font-mono bg-yellow-400/10 px-3 py-1 rounded-md border border-yellow-400/20"
            :title="`难度 ${note.difficulty}`">
            <span v-for="(s, i) in difficultyStars" :key="i"
              :class="s === 'half' ? 'star-half' : ''">★</span>
          </span>
          <span v-if="note.source" class="text-gray-400" v-html="note.source"></span>
        </div>
        <h1
          class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight tracking-wide drop-shadow-md">
          {{ note.title }}
        </h1>
        <div class="flex flex-wrap items-center gap-4 text-xs text-gray-500">
          <span v-if="note.updated_at" class="flex items-center gap-1">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
            {{ note.updated_at }}
          </span>
          <span v-if="note.parsed_at" class="flex items-center gap-1">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
            {{ note.parsed_at.slice(0, 10) }}
          </span>
          <a v-if="note.link" :href="note.link" target="_blank"
            class="flex items-center gap-1 hover:text-accent transition-colors">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1">
              </path>
            </svg>
            原题链接
          </a>
          <RouterLink v-for="tag in note.tags" :key="tag" :to="`/tag/${encodeURIComponent(tag)}`" class="hover:text-white cursor-pointer transition-colors"># {{ tag
            }}</RouterLink>
        </div>
      </section>
      <!-- 主内容网格 -->
      <main class="max-w-[88rem] mx-auto px-5 sm:px-6 lg:px-8 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        <!-- 左侧正文 -->
        <div class="lg:col-span-9 space-y-6">
          <!-- 作者导读 -->
          <div v-if="note.summary"
            class="relative overflow-hidden bg-gradient-to-r from-accent/10 to-transparent border-l-4 border-accent rounded-r-2xl p-5 shadow-sm animate-fade-in-up">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-lg">✍️</span>
              <span class="text-sm font-bold text-accent tracking-widest uppercase">作者导读</span>
            </div>
            <p class="text-sm text-gray-300 leading-relaxed font-medium" v-html="renderedSummary"></p>
          </div>

          <!-- 正文 -->
          <article class="glass-panel p-4 sm:p-5 lg:p-8 animate-fade-in-up" style="animation-delay: 0.2s">
            <div class="prose max-w-none">
              <NoteSection :sections="note.sections" />
            </div>
          </article>

          <!-- 尾部信息 -->
          <div v-if="note.source || note.link"
            class="relative overflow-hidden glass-card rounded-3xl p-6 mt-12 transition-all hover:border-white/10 group animate-fade-in-up">
            <div
              class="absolute -right-8 -bottom-12 text-[150px] font-bold text-white opacity-[0.03] select-none transition-transform duration-500 group-hover:scale-110">
              &lt;/&gt;</div>
            <h3 class="text-lg font-bold text-gray-200 mb-4 relative z-10">{{ note.title }}</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm relative z-10">
              <div v-if="note.type">
                <p class="text-gray-500 text-xs mb-1">类型</p>
                <p class="text-gray-300 font-medium">{{ note.type }}</p>
              </div>
              <div v-if="note.source">
                <p class="text-gray-500 text-xs mb-1">来源</p>
                <p class="text-gray-300 font-mono" v-html="note.source"></p>
              </div>
              <div v-if="note.difficulty !== null">
                <p class="text-gray-500 text-xs mb-1">难度</p>
                <p class="text-gray-300 font-mono">{{ note.difficulty }}</p>
              </div>
              <div v-if="note.link">
                <p class="text-gray-500 text-xs mb-1">链接</p><a :href="note.link" target="_blank"
                  class="text-accent hover:underline decoration-dashed underline-offset-4">原题链接</a>
              </div>
            </div>
          </div>

          <!-- 底部代码语言 -->
          <footer v-if="hasCode" class="flex items-center gap-3 text-xs text-gray-500 animate-fade-in-up">
            <span class="flex items-center gap-1"><svg class="w-4 h-4" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
              </svg> 代码语言：</span>
            <div class="flex flex-wrap gap-2">
              <span v-for="lang in note.code_languages" :key="lang"
                class="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 font-mono shadow-sm">{{ lang }}</span>
            </div>
          </footer>

          <!-- 相关推荐 -->
          <div v-if="hasRecs" :id="recsSectionId" class="mt-12 pt-8 border-t border-white/5 animate-fade-in-up">
            <h3 class="text-xl font-bold text-gray-200 mb-6 flex items-center gap-2">
              <span class="text-accent">🧠</span> 相关推荐
            </h3>
            <div v-for="group in recs" :key="group.blockIndex" class="mb-6 last:mb-0">
              <div v-if="recBlockCount > 1" class="flex items-center gap-2 mb-3">
                <span class="text-[10px] font-bold text-gray-500 uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded">代码 {{ group.blockIndex + 1 }}</span>
                <div class="h-px flex-1 bg-white/5"></div>
              </div>
              <div class="space-y-2">
                <RouterLink
                  v-for="r in group.items"
                  :key="r.slug"
                  :to="r.route"
                  class="glass-card rounded-2xl px-4 py-3 flex items-center justify-between gap-3 group hover:border-white/10 transition-colors"
                >
                  <h4 class="text-sm font-bold text-gray-200 group-hover:text-accent transition-colors line-clamp-1">{{ r.title }}</h4>
                  <span class="text-xs font-mono shrink-0"
                    :class="r.similarity >= 0.5 ? 'text-accent' : r.similarity >= 0.3 ? 'text-yellow-400' : 'text-gray-400'">{{ Math.round(r.similarity * 100) }}%</span>
                </RouterLink>
              </div>
            </div>
          </div>

          <!-- 评论区 -->
          <CommentSection />
        </div>

        <!-- 右侧 TOC -->
        <aside class="hidden lg:block lg:col-span-3 animate-fade-in-up" style="animation-delay: 0.3s">
          <div class="sticky top-24">
            <TocSidebar :items="tocItems" />
          </div>
        </aside>
      </main>
    </template>
  </div>
</template>

<style scoped>
/* ---- Logseq 大纲风格 引流线 + 定制 bullet ---- */
:deep(.prose ul) {
  list-style-type: none;
  padding-left: 1.5rem;
  margin-top: 0.75rem;
  margin-bottom: 0.75rem;
}

:deep(.prose ul ul) {
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  margin-left: -0.6rem;
  padding-left: 1.6rem;
}

:deep(.prose ul ul:hover) {
  border-left-color: rgba(179, 139, 54, 0.4);
}

:deep(.prose li) {
  position: relative;
  margin-bottom: 0.75rem;
  color: #a1a1aa;
  line-height: 1.8;
  font-size: 1.05rem;
}

:deep(.prose li::before) {
  content: '';
  position: absolute;
  left: -1.25rem;
  top: 0.7rem;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #52525b;
  transition: all 0.2s ease;
}

:deep(.prose li:hover > ::before) {
  background-color: #b38b36;
  box-shadow: 0 0 0 3px rgba(179, 139, 54, 0.2);
}

:deep(.prose blockquote) {
  border-left: 4px solid #b38b36;
  background: rgba(255, 255, 255, 0.03);
  padding: 0.75rem 1.25rem;
  border-radius: 0 0.5rem 0.5rem 0;
  margin: 1rem 0;
  font-style: italic;
  color: #9ca3af;
}

/* ---- 表格 ---- */
:deep(.note-table) {
  width: 100%;
  border-collapse: hidden;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1);
  font-size: 0.875rem;
}

:deep(.note-table th),
:deep(.note-table td) {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  text-align: left;
}

:deep(.note-table th) {
  background: rgba(255, 255, 255, 0.04);
  color: #e4e4e7;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
}

:deep(.note-table tr:last-child td) {
  border-bottom: none;
}

:deep(.note-table tbody tr:hover) {
  background: rgba(255, 255, 255, 0.02);
}

:deep(.note-table td) {
  color: #a1a1aa;
}

/* ---- Katex + 滚动条 ---- */
:deep(.katex-display) {
  overflow-x: auto;
  overflow-y: hidden;
  padding: 0.5rem 0;
}

::-webkit-scrollbar {
  height: 6px;
  width: 6px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(179, 139, 54, 0.5);
}

.star-half {
  background: linear-gradient(to right, currentColor 50%, rgba(255,255,255,0.12) 50%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>
