<script setup>
import { ref, computed } from 'vue'
import hljs from 'highlight.js/lib/core'
import cpp from 'highlight.js/lib/languages/cpp'
import python from 'highlight.js/lib/languages/python'
import plaintext from 'highlight.js/lib/languages/plaintext'

hljs.registerLanguage('cpp', cpp)
hljs.registerLanguage('python', python)
hljs.registerLanguage('plaintext', plaintext)

const props = defineProps({
  code: { type: String, required: true, default: '' },
  language: { type: String, default: '' },
})

const displayCode = computed(() => {
  if (!props.code) return ''
  return props.code.trimEnd()
})

const lineCount = computed(() => {
  if (!displayCode.value) return 0
  return (displayCode.value.match(/\n/g) || []).length + 1
})

const lineNumbers = computed(() => {
  if (!lineCount.value) return ''
  const nums = []
  for (let i = 1; i <= lineCount.value; i++) nums.push(i)
  return nums.join('\n')
})

const highlighted = computed(() => {
  if (!displayCode.value) return ''
  const lang = props.language && hljs.getLanguage(props.language) ? props.language : 'plaintext'
  const result = hljs.highlight(displayCode.value, { language: lang })
  return result.value
})

const showCopy = computed(() => !!displayCode.value)

const copied = ref(false)
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(props.code)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch { /* ignore */ }
}
</script>

<template>
  <div class="group relative my-6 rounded-xl overflow-hidden border border-white/[0.06]">
    <!-- 右上角：语言 + 复制 -->
    <div class="absolute top-2 right-3 z-10 flex items-center gap-2">
      <span class="text-[11px] text-gray-500 font-mono">{{ language || 'plain' }}</span>
      <button
        v-if="showCopy"
        @click="copyToClipboard"
        class="text-[11px] text-gray-500 hover:text-gray-200 transition-colors flex items-center gap-1"
      >
        <svg v-if="copied" class="w-3 h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <svg v-else class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
        </svg>
      </button>
    </div>

    <div class="flex overflow-x-auto text-xs sm:text-[0.85rem] font-mono leading-[1.6] bg-white/[0.04]">
      <pre v-if="lineCount > 0" class="text-gray-600/50 text-right pl-4 pr-3 py-3 select-none border-r border-white/[0.06] shrink-0 !m-0">{{ lineNumbers }}</pre>
      <pre class="text-gray-300 w-full whitespace-pre font-mono py-3 pr-4 pl-3 !m-0" v-html="highlighted"></pre>
    </div>
  </div>
</template>

<style scoped>
:deep(.hljs-keyword) { color: #c678dd; }
:deep(.hljs-type) { color: #e5c07b; }
:deep(.hljs-string) { color: #98c379; }
:deep(.hljs-number) { color: #d19a66; }
:deep(.hljs-comment) { color: #5c6370; font-style: italic; }
:deep(.hljs-function) { color: #61afef; }
:deep(.hljs-title) { color: #61afef; }
:deep(.hljs-built_in) { color: #e6c07b; }
:deep(.hljs-meta) { color: #e06c75; }
:deep(.hljs-attr) { color: #d19a66; }
:deep(.hljs-params) { color: #abb2bf; }
:deep(.hljs-literal) { color: #56b6c2; }
:deep(.hljs-operator) { color: #56b6c2; }
:deep(.hljs-punctuation) { color: #abb2bf; }
</style>
