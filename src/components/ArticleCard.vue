<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useTiltCard } from '../composables/useTiltCard'
import { renderLatex } from '../composables/useKatex.js'

const props = defineProps({
  article: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    default: 0,
  },
})

const { tilt, reset } = useTiltCard()

const renderedSummary = computed(() => renderLatex(props.article.summary || ''))
</script>

<template>
  <RouterLink
    :to="article.route || `/posts/${article.slug}`"
    class="tilt-card group block glass-card rounded-3xl p-6 cursor-pointer transition-all duration-500 animate-fade-in-up"
    :style="{ animationDelay: `${0.1 + index * 0.1}s` }"
    @mousemove="tilt"
    @mouseleave="reset"
  >
    <!-- Category & pinned badge -->
    <div class="flex items-center gap-2 text-xs text-gray-500 mb-3">
      <span class="flex items-center gap-1">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
        {{ article.category }}
      </span>
      <span v-if="article.pinned" class="px-2 py-0.5 rounded-full bg-accent/20 text-accent text-[10px] font-bold border border-accent/30">置顶</span>
    </div>

    <!-- Title -->
    <h2 class="text-xl font-bold text-gray-200 mb-3 group-hover:text-accent transition-colors duration-300">
      {{ article.title }}
    </h2>

    <!-- Summary -->
    <p class="text-sm text-gray-400 mb-6 line-clamp-2 leading-relaxed" v-html="renderedSummary"></p>

    <!-- Meta -->
    <div class="flex items-center justify-between text-xs text-gray-500">
      <div class="flex gap-2">
        <span
          v-for="tag in article.tags?.slice(0, 3)"
          :key="tag"
          class="px-2 py-0.5 rounded-full bg-white/5 hover:bg-accent/20 hover:text-accent transition-colors"
        >
          # {{ tag }}
        </span>
      </div>
      <span class="flex items-center gap-1">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
        {{ article.date }}
      </span>
    </div>
  </RouterLink>
</template>
