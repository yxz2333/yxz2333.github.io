<script setup>
import { ref, onMounted } from 'vue'
import NoteList from '../components/NoteList.vue'

const allNotes = ref([])
const loading = ref(true)

onMounted(() => load())

async function load() {
  loading.value = true
  const all = []
  for (const d of ['p', 'k', 'c']) {
    const res = await fetch(`/${d}/index.json`)
    if (res.ok) all.push(...(await res.json()).notes)
  }
  all.sort((a, b) => (b.parsed_at || '').localeCompare(a.parsed_at || '')
    || (b.updated_at || '').localeCompare(a.updated_at || ''))

  allNotes.value = all.map(n => ({
    id: n.slug,
    title: n.title,
    category: n.type,
    summary: n.summary || '',
    tags: n.tags || [],
    date: (n.updated_at || n.parsed_at || '').slice(0, 10),
    slug: n.slug,
    route: `/${n.type_directory || ({'题目':'p','知识点':'k','比赛':'c'}[n.type]) || 'notes'}/${n.slug}`,
  }))
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
        <NoteList :notes="allNotes" :itemsPerPage="24" :columns="2" grouped>
          <template #header>
            <h1 class="text-3xl md:text-4xl font-bold text-white mb-4">文章列表</h1>
            <p class="text-gray-500">共 {{ allNotes.length }} 篇文章</p>
          </template>
        </NoteList>
      </template>
    </main>
  </div>
</template>
