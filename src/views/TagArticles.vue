<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import NoteList from '../components/NoteList.vue'

const route = useRoute()
const tagName = computed(() => {
  const raw = route.params.name
  if (!raw) return ''
  // 某些字符可能未被 Vue Router 完全解码，手动补一次
  try { return decodeURIComponent(raw) } catch { return raw }
})

const notes = ref([])
const error = ref('')
const loading = ref(true)

const typeMap = { 'p': '题目', 'k': '知识点', 'c': '比赛' }

onMounted(() => load())
watch(() => route.params.name, () => load())

async function load() {
  loading.value = true
  error.value = ''
  try {
    const all = []
    for (const d of ['p', 'k', 'c', 'notes']) {
      try {
        const res = await fetch(`${import.meta.env.BASE_URL}${d}/index.json`)
        if (res.ok) {
          const data = await res.json()
          if (data.notes) all.push(...data.notes)
        }
      } catch { /* 目录无 index.json 或 JSON 解析失败，跳过 */ }
    }
    notes.value = all
      .filter(n => (n.tags || []).includes(tagName.value))
      .sort((a, b) => (b.parsed_at || '').localeCompare(a.parsed_at || '')
        || (b.updated_at || '').localeCompare(a.updated_at || ''))
      .map(n => ({
        id: n.slug,
        title: n.title,
        category: typeMap[n.type_directory] || n.type,
        summary: n.summary || '',
        tags: n.tags || [],
        date: (n.updated_at || n.parsed_at || '').slice(0, 10),
        slug: n.slug,
        route: `/${n.type_directory || ({'题目':'p','知识点':'k','比赛':'c'}[n.type]) || 'notes'}/${n.slug}`,
      }))
  } catch (e) {
    error.value = e.message || '加载失败'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen text-gray-300 font-sans relative">
    <main class="relative z-10 max-w-[88rem] mx-auto px-4 lg:px-6 pt-32 pb-20">
      <div v-if="loading" class="flex justify-center py-20">
        <div class="w-8 h-8 border-4 border-accent/20 border-t-accent rounded-full animate-spin"></div>
      </div>

      <div v-else-if="error" class="flex justify-center py-20">
        <p class="text-red-400">{{ error }}</p>
      </div>

      <template v-else>
        <NoteList :notes="notes" :itemsPerPage="12" :columns="1">
          <template #header>
            <h1 class="text-3xl md:text-4xl font-bold text-white mb-4">
              <span class="text-accent">#</span> {{ tagName }}
            </h1>
            <p class="text-gray-500">共 {{ notes.length }} 篇笔记</p>
          </template>
        </NoteList>
      </template>
    </main>
  </div>
</template>
