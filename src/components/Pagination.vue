<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  page: { type: Number, required: true },
  total: { type: Number, required: true },
  compact: { type: Boolean, default: false },
})
const emit = defineEmits(['update:page'])

const jump = ref('')
function doJump() {
  const n = parseInt(jump.value)
  if (n >= 1 && n <= props.total) emit('update:page', n)
  jump.value = ''
}

const numberedPages = computed(() => {
  const t = props.total
  if (t <= 7) return Array.from({ length: t }, (_, i) => i + 1)
  const p = props.page
  const arr = [1]
  if (p > 3) arr.push(-1)
  for (let i = Math.max(2, p - 1); i <= Math.min(t - 1, p + 1); i++) arr.push(i)
  if (p < t - 2) arr.push(-1)
  arr.push(t)
  return arr
})
</script>

<template>
  <div v-if="total > 1" class="flex items-center gap-1.5"
    :class="compact ? 'justify-end' : 'justify-center'">
    <!-- 左箭头 -->
    <button @click="emit('update:page', Math.max(1, page - 1))" :disabled="page === 1"
      class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/5 disabled:opacity-20 disabled:cursor-not-allowed transition-colors">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
    </button>

    <!-- compact: 页码文字 -->
    <span v-if="compact" class="text-xs text-gray-500 tabular-nums min-w-[3rem] text-center">{{ page }} / {{ total }}</span>

    <!-- full: 数字方块 -->
    <template v-if="!compact">
      <template v-for="n in numberedPages" :key="n">
        <span v-if="n === -1" class="w-8 h-8 flex items-center justify-center text-xs text-gray-600">…</span>
        <button v-else @click="emit('update:page', n)"
          class="w-8 h-8 rounded-lg text-xs font-medium transition-all"
          :class="page === n ? 'bg-accent text-white shadow-sm shadow-accent/20' : 'text-gray-400 hover:text-white hover:bg-white/5'">
          {{ n }}
        </button>
      </template>
    </template>

    <!-- 右箭头 -->
    <button @click="emit('update:page', Math.min(total, page + 1))" :disabled="page === total"
      class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/5 disabled:opacity-20 disabled:cursor-not-allowed transition-colors">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
    </button>

    <!-- 跳转输入 -->
    <form @submit.prevent="doJump" class="flex items-center gap-1">
      <input v-model="jump" type="text" inputmode="numeric"
        class="w-9 h-7 rounded-md bg-white/5 border border-white/10 text-xs text-center text-gray-300 placeholder-gray-600 outline-none focus:border-accent/50 transition-colors"
        :placeholder="String(total)" />
    </form>
  </div>
</template>
