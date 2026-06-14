<script setup>
import { ref, computed, watch } from 'vue'
import ArticleCard from './ArticleCard.vue'
import Pagination from './Pagination.vue'

const props = defineProps({
  notes: { type: Array, required: true },
  itemsPerPage: { type: Number, default: 12 },
  columns: { type: Number, default: 1 },     // 1 或 2
  grouped: { type: Boolean, default: false },  // 是否按月分组
})

const page = ref(1)
watch(() => props.notes, () => { page.value = 1 })
watch(page, () => window.scrollTo({ top: 0, behavior: 'smooth' }))

// ---- 按月分组 ----
const months = computed(() => {
  if (!props.grouped) return []
  const map = {}
  for (const n of props.notes) {
    const ym = (n.date || '').slice(0, 7)
    if (!map[ym]) map[ym] = []
    map[ym].push(n)
  }
  return Object.entries(map).sort((a, b) => b[0].localeCompare(a[0]))
})

function monthLabel(ym) {
  const [y, m] = ym.split('-')
  return `${y} 年 ${parseInt(m)} 月`
}

// ---- 分页 ----
const totalPages = computed(() => {
  if (props.grouped) {
    const total = months.value.reduce((s, m) => s + m[1].length, 0)
    return Math.ceil(total / props.itemsPerPage)
  }
  return Math.ceil(props.notes.length / props.itemsPerPage)
})

const pagedMonths = computed(() => {
  if (!props.grouped) return []
  const start = (page.value - 1) * props.itemsPerPage
  const end = start + props.itemsPerPage
  let cursor = 0
  const groups = []
  for (const [ym, articles] of months.value) {
    const mStart = cursor
    const mEnd = cursor + articles.length
    cursor = mEnd
    if (mEnd <= start) continue
    if (mStart >= end) break
    const slice = articles.slice(
      Math.max(0, start - mStart),
      Math.min(articles.length, end - mStart)
    )
    groups.push({ ym, label: monthLabel(ym), count: slice.length, articles: slice })
  }
  return groups
})

const pagedFlat = computed(() => {
  if (props.grouped) return []
  const start = (page.value - 1) * props.itemsPerPage
  return props.notes.slice(start, start + props.itemsPerPage)
})
</script>

<template>
  <div>
    <!-- 顶栏：slot 放标题 + compact 分页 -->
    <div class="mb-12 animate-fade-in-up">
      <div class="flex items-end justify-between">
        <div>
          <slot name="header" />
        </div>
        <Pagination compact :page="page" :total="totalPages" @update:page="page = $event" />
      </div>
    </div>

    <!-- 按月分组模式 -->
    <template v-if="grouped">
      <div v-for="g in pagedMonths" :key="g.ym" class="mb-12">
        <h2 class="text-lg font-bold text-gray-400 mb-4 flex items-center gap-3">
          <span class="w-2 h-2 rounded-full bg-accent"></span>
          {{ g.label }}
          <span class="text-xs text-gray-600 font-normal">{{ g.count }} 篇</span>
        </h2>
        <div :class="columns === 2 ? 'grid grid-cols-1 lg:grid-cols-2 gap-4' : 'space-y-4'">
          <ArticleCard v-for="(a, i) in g.articles" :key="a.id" :article="a" :index="i" />
        </div>
      </div>
    </template>

    <!-- 平铺模式 -->
    <template v-else>
      <div :class="columns === 2 ? 'grid grid-cols-1 lg:grid-cols-2 gap-4 mb-12' : 'space-y-4 mb-12'">
        <ArticleCard v-for="(a, i) in pagedFlat" :key="a.id" :article="a" :index="i" />
      </div>
    </template>

    <!-- 底部分页 -->
    <div class="mt-12">
      <Pagination :page="page" :total="totalPages" @update:page="page = $event" />
    </div>
  </div>
</template>
