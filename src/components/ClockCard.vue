<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'

// ======== 时钟 ========
const hourDeg = ref(0)
const minDeg = ref(0)
const secDeg = ref(0)
const hovered = ref(false)
let frameId = null

function tick() {
  const now = new Date()
  secDeg.value = (now.getSeconds() + now.getMilliseconds() / 1000) * 6
  minDeg.value = now.getMinutes() * 6 + now.getSeconds() * 0.1
  hourDeg.value = (now.getHours() % 12) * 30 + now.getMinutes() * 0.5
  frameId = requestAnimationFrame(tick)
}

// ======== 问候语 ========
const greet = ref('')
let greetId = null

function pickGreet() {
  const h = new Date().getHours()
  if (h < 6)       greet.value = '夜深了，注意休息。'
  else if (h < 12) greet.value = '早安，新的一天。'
  else if (h < 18) greet.value = '下午好，喝杯咖啡吧。'
  else             greet.value = '晚上好，欢迎归来。'
}

// ======== 月相 ========
const phase = computed(() => {
  // 新月参考日: 2000-01-06
  const ref = new Date(2000, 0, 6).getTime()
  const days = (Date.now() - ref) / (1000 * 60 * 60 * 24)
  const raw = (days % 29.53 + 29.53) % 29.53 / 29.53
  return raw  // 0 = 新月, 0.5 = 满月, 1 ≈ 新月
})

// 月相阴影球的 x 坐标 — 向右移 = 露出左边亮部（waning），向左移 = 露出右边亮部（waxing）
const shadowX = computed(() => {
  const p = phase.value
  if (p <= 0.5) {
    // waxing: 阴影从中心 (14) 退到左侧 (-10)，露出右边亮部
    return 14 - p * 48
  }
  // waning: 阴影从左侧 (-10) 移至中心 (14)，盖住亮部
  return -10 + (p - 0.5) * 48
})

const phaseName = computed(() => {
  const p = phase.value
  if (p < 0.03 || p > 0.97) return '新月'
  if (p < 0.22) return '蛾眉月'
  if (p < 0.28) return '上弦月'
  if (p < 0.47) return '盈凸月'
  if (p < 0.53) return '满月'
  if (p < 0.72) return '亏凸月'
  if (p < 0.78) return '下弦月'
  return '残月'
})

// ======== 生命周期 ========
onMounted(() => {
  frameId = requestAnimationFrame(tick)
  pickGreet()
  greetId = setInterval(pickGreet, 30000)
})

onUnmounted(() => {
  cancelAnimationFrame(frameId)
  clearInterval(greetId)
})
</script>

<template>
  <div
    class="bg-accent rounded-2xl relative overflow-hidden shadow-lg shadow-black/20 animate-fade-in-up select-none cursor-default"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
  >
    <!-- ======== 月相装饰 · 右下 ======== -->
    <div class="absolute right-3 bottom-3 z-0 flex items-center gap-1.5 opacity-40">
      <svg width="24" height="24" viewBox="0 0 28 28" class="shrink-0">
        <defs>
          <clipPath id="moon-clip">
            <circle cx="14" cy="14" r="11" />
          </clipPath>
        </defs>
        <g clip-path="url(#moon-clip)">
          <!-- 月球基底 — 微弱白色 -->
          <circle cx="14" cy="14" r="11" fill="rgba(255,255,255,0.20)" />
          <!-- 阴影球 — 卡片同色 (bg-accent)，左右移动露出/遮盖亮部 -->
          <circle :cx="shadowX" cy="14" r="11" fill="#b38b36" />
        </g>
      </svg>
      <span class="text-[10px] text-white/60 font-medium tracking-wide">{{ phaseName }}</span>
    </div>

    <div class="p-6">
      <!-- ======== 问候语 ======== -->
      <p class="text-white/90 text-sm font-medium mb-4 relative z-10">{{ greet }}</p>

      <!-- ======== 时钟主体 ======== -->
      <div class="relative w-36 h-36 mx-auto">
        <div
          class="w-full h-full bg-[#2c2c2e] border-4 border-[#3a3a3c] rounded-full relative shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]"
          :class="hovered ? 'scale-75 opacity-0 translate-y-6' : 'scale-100 opacity-100 translate-y-0'"
          style="transition: all 0.55s cubic-bezier(0.34, 1.56, 0.64, 1);"
        >
          <div class="absolute w-1.5 h-10 bg-white bottom-1/2 left-1/2 origin-bottom rounded-full" :style="{ transform: `translateX(-50%) rotate(${hourDeg}deg)` }"></div>
          <div class="absolute w-1 h-14 bg-white/80 bottom-1/2 left-1/2 origin-bottom rounded-full" :style="{ transform: `translateX(-50%) rotate(${minDeg}deg)` }"></div>
          <div class="absolute w-0.5 h-16 bg-red-500 bottom-1/2 left-1/2 origin-bottom rounded-full" :style="{ transform: `translateX(-50%) rotate(${secDeg}deg)` }"></div>
          <div class="absolute top-1/2 left-1/2 w-3 h-3 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 shadow-md"></div>
        </div>

        <div
          class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
          :class="hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
          style="transition: all 0.55s cubic-bezier(0.34, 1.56, 0.64, 1);"
        >
          <span class="text-lg text-white/90 font-bold tracking-wide mb-1">今天是个好日子</span>
          <span class="text-xs text-white/60 tracking-widest">心想的事儿都能成</span>
        </div>
      </div>

      <!-- ======== 底栏 ======== -->
      <div class="mt-6 flex justify-between items-end relative z-10">
        <div>
          <h3 class="text-2xl font-bold text-white tracking-widest drop-shadow-md">莉妮娅</h3>
          <p class="text-xs text-white/80 mt-1">分享技术与科技生活</p>
        </div>
      </div>
    </div>
  </div>
</template>
