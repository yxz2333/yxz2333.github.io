<script setup>
import { slugify } from '../composables/useHeading.js'
import { renderLatex } from '../composables/useKatex.js'
import CodeBlock from './CodeBlock.vue'

defineProps({ sections: { type: Array, default: () => [] } })

function indentStyle(depth) {
  if (!depth) return {}
  return { paddingLeft: `${depth * 1.5}rem` }
}
</script>

<template>
  <template v-for="(sec, i) in sections" :key="i">
    <!-- 标题 -->
    <template v-if="sec.heading">
      <h2 v-if="sec.level === 2" :id="slugify(sec.heading)" class="toc-target group mt-14 mb-8">
        <div class="flex items-center gap-2 mb-2">
          <svg class="w-4 h-4 text-accent shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          <span class="text-2xl font-extrabold text-white"><span v-html="renderLatex(sec.heading)"></span></span>
        </div>
        <div class="h-px bg-gradient-to-r from-accent/60 via-accent/20 to-transparent"></div>
      </h2>
      <h3 v-else-if="sec.level === 3" :id="slugify(sec.heading)" class="toc-target group mt-10 mb-5">
        <div class="flex items-center gap-2 mb-1.5">
          <svg class="w-3.5 h-3.5 text-accent/70 shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          <span class="text-xl font-bold text-gray-100"><span v-html="renderLatex(sec.heading)"></span></span>
        </div>
        <div class="h-px bg-gradient-to-r from-white/10 to-transparent"></div>
      </h3>
      <h4 v-else :id="slugify(sec.heading)" class="toc-target mt-8 mb-3 flex items-center gap-2">
        <span class="text-[10px] text-accent/50">◆</span>
        <span class="text-lg font-bold text-gray-300"><span v-html="renderLatex(sec.heading)"></span></span>
      </h4>
      <NoteSection v-if="sec.blocks?.length" :sections="sec.blocks" />
    </template>

    <!-- 段落 -->
    <p v-else-if="sec.type === 'p'" class="text-gray-400 leading-relaxed! text-[1.05rem] mb-4!"
      :style="sec.depth ? indentStyle(sec.depth) : {}" :data-depth="sec.depth"
      :class="{ 'depth-marker': sec.depth >= 2 }" v-html="sec.html"></p>

    <!-- 代码块 -->
    <div v-else-if="sec.type === 'code'" :style="sec.depth ? indentStyle(sec.depth) : {}">
      <CodeBlock :code="sec.code" :language="sec.lang" />
    </div>

    <!-- 数学公式 -->
    <div v-else-if="sec.type === 'math'" class="my-1 overflow-x-auto py-1"
      :style="sec.depth ? indentStyle(sec.depth) : {}" v-html="sec.html"></div>

    <!-- 表格 -->
    <div v-else-if="sec.type === 'table'" class="my-8 overflow-x-auto rounded-xl border border-white/10"
      :style="sec.depth ? indentStyle(sec.depth) : {}" v-html="sec.html">
    </div>
  </template>
</template>

<style scoped>
.depth-marker::before {
  content: '◆\00a0\00a0\00a0';
  color: #b38b36;
}
.depth-marker:has(.note-img)::before {
  content: none;
}

.depth-marker[data-depth="2"]::before {
  font-size: 0.55rem;
  opacity: 0.5;
}

.depth-marker[data-depth="3"]::before {
  font-size: 0.45rem;
  opacity: 0.35;
}

.depth-marker[data-depth="4"]::before {
  font-size: 0.4rem;
  opacity: 0.25;
}

.depth-marker[data-depth="5"]::before {
  font-size: 0.35rem;
  opacity: 0.18;
}
</style>
