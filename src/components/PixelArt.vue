<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const LETTERS = {
  L: [
    [1, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1],
  ],
  Y: [
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [0, 1, 0, 0, 0, 1, 0],
    [0, 0, 1, 0, 1, 0, 0],
    [0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0],
  ],
  N: [
    [1, 0, 0, 0, 0, 0, 1],
    [1, 1, 0, 0, 0, 0, 1],
    [1, 1, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 0, 0, 1],
    [1, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 1, 1],
  ],
  I: [
    [0, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 0],
  ],
  A: [
    [0, 0, 0, 1, 0, 0, 0],
    [0, 0, 1, 0, 1, 0, 0],
    [0, 1, 0, 0, 0, 1, 0],
    [0, 1, 0, 0, 0, 1, 0],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
  ],
  H: [
    [0, 1, 0, 0, 0, 1, 0],
    [1, 1, 1, 0, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 0, 0],
    [0, 0, 0, 1, 0, 0, 0],
  ],
}

const ORDER = ['L', 'Y', 'N', 'I', 'A', 'H']
const HOLD = 2000
const SCRAMBLE = 800
const TICK = 60

const grid = ref(Array(49).fill(false))
let seq = 0
let holdId = null
let tickId = null

function flat(key) { return LETTERS[key].flat() }
function apply(pat) { grid.value = [...pat] }

function nextPat() {
  seq = (seq + 1) % ORDER.length
  return flat(ORDER[seq])
}

// 打乱→凝聚：noiseRate 从 1.0 线性衰减到 0.2，噪声覆盖逐渐让位给 target
function scrambleTo(target) {
  const t0 = performance.now()

  function tick() {
    const dt = performance.now() - t0
    if (dt >= SCRAMBLE) {
      apply(target)
      holdId = setTimeout(() => scrambleTo(nextPat()), HOLD)
      return
    }
    const r = 1 - (dt / SCRAMBLE) * 0.8
    grid.value = target.map(want =>
      Math.random() < r ? Math.random() > 0.45 : want
    )
    tickId = setTimeout(tick, TICK)
  }
  tick()
}

onMounted(() => {
  apply(flat('L'))
  holdId = setTimeout(() => scrambleTo(nextPat()), HOLD)
})

onUnmounted(() => {
  clearTimeout(holdId)
  clearTimeout(tickId)
})
</script>

<template>
  <div class="glass-card rounded-3xl p-5 animate-fade-in-up">
    <h3 class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Beyond Code</h3>
    <div class="grid gap-[3px] mx-auto" style="grid-template-columns: repeat(7, 1fr); max-width: 196px;">
      <div v-for="(on, i) in grid" :key="i" class="aspect-square rounded-[2px] transition-all duration-200"
        :class="on ? 'bg-accent shadow-[0_0_6px_rgba(179,139,54,0.4)]' : 'bg-white/5'"></div>
    </div>
  </div>
</template>
