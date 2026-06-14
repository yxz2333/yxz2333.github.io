<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import NoteList from '../components/NoteList.vue'

const route = useRoute()
const nameMap = { '题目题解': 'p', '算法知识点': 'k', '比赛题解': 'c' }
const typeMap = { 'p': '题目', 'k': '知识点', 'c': '比赛' }

const notes = ref([])
const loading = ref(true)

// 知识点：双列按月分组 24/页；题目/比赛：单列 12/页
const isKnowledge = computed(() => route.params.name === '算法知识点')
const listConfig = computed(() => ({
  itemsPerPage: isKnowledge.value ? 24 : 12,
  columns: isKnowledge.value ? 2 : 1,
  grouped: isKnowledge.value,
}))

onMounted(() => load())
watch(() => route.params.name, () => load())

async function load() {
  loading.value = true
  const dir = nameMap[route.params.name]
  if (!dir) { notes.value = []; loading.value = false; return }
  const res = await fetch(`${import.meta.env.BASE_URL}${dir}/index.json`)
  if (res.ok) {
    const all = (await res.json()).notes
    all.sort((a, b) => (b.parsed_at || '').localeCompare(a.parsed_at || '')
      || (b.updated_at || '').localeCompare(a.updated_at || ''))
    notes.value = all.map(n => ({
      id: n.slug,
      title: n.title,
      category: typeMap[n.type_directory] || n.type,
      summary: n.summary || '',
      tags: n.tags || [],
      date: (n.updated_at || n.parsed_at || '').slice(0, 10),
      slug: n.slug,
      route: `/${n.type_directory || (typeMap[n.type] === '题目' ? 'p' : typeMap[n.type] === '知识点' ? 'k' : 'c')}/${n.slug}`,
    }))
  }
  loading.value = false
}
</script>

<template>
  <div class="min-h-screen text-gray-300 font-sans relative">
    <main class="relative z-10 max-w-[88rem] mx-auto px-4 lg:px-6 pt-32 pb-20">
      <div v-if="loading" class="flex justify-center py-20">
        <div class="w-8 h-8 border-4 border-accent/20 border-t-accent rounded-full animate-spin"></div>
      </div>

      <template v-else>
        <NoteList
          :notes="notes"
          :itemsPerPage="listConfig.itemsPerPage"
          :columns="listConfig.columns"
          :grouped="listConfig.grouped"
        >
          <template #header>
            <h1 class="text-3xl md:text-4xl font-bold text-white mb-4">{{ route.params.name }}</h1>
            <p class="text-gray-500">共 {{ notes.length }} 篇笔记</p>
          </template>
        </NoteList>
      </template>
    </main>
  </div>
</template>
