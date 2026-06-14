<script setup>
import { ref, computed, watch } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
  tags: { type: Array, default: () => [] },
  limit: { type: Number, default: 10 },
})

const shuffled = ref([])
watch(() => props.tags, (list) => {
  const arr = [...list]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  shuffled.value = arr
}, { immediate: true })

const visible = computed(() => shuffled.value.slice(0, props.limit))
const hasMore = computed(() => props.tags.length > props.limit)

function getBrightness(count, max) {
  if (!max || max === 0) return 0.3
  return 0.3 + (count / max) * 0.7  // 0.3 ~ 1.0
}
</script>

<template>
  <div class="glass-card rounded-2xl p-5 animate-fade-in-up">
    <h3 class="text-sm font-bold text-gray-200 mb-4 flex items-center gap-2">
      <svg class="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path></svg>
      热门标签
    </h3>
    <div class="flex flex-wrap gap-2">
      <RouterLink
        v-for="tag in visible"
        :key="tag.name"
        :to="`/tag/${encodeURIComponent(tag.name)}`"
        class="px-3 py-1 rounded-full bg-white/5 hover:bg-accent/20 hover:text-accent transition-all duration-200 border border-white/5 hover:border-accent/30 text-xs"
        :style="{ opacity: getBrightness(tag.count, visible[0]?.count || 1) }"
      >
        {{ tag.name }}
        <span class="ml-1 text-[10px] text-gray-500">({{ tag.count }})</span>
      </RouterLink>
    </div>
    <RouterLink
      v-if="hasMore"
      to="/tags"
      class="block mt-3 text-center text-xs text-gray-500 hover:text-accent transition-colors"
    >
      更多 →
    </RouterLink>
  </div>
</template>
