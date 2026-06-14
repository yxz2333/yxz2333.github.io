<script setup>
import { ref, onMounted } from 'vue'
import { useTiltCard } from '../composables/useTiltCard'
import { friends } from '../data/site.js'

const { tilt, reset } = useTiltCard()

// ============ 随机访问 ============
function randomVisit() {
  const cards = document.querySelectorAll('.friend-card')
  if (!cards.length) return

  cards.forEach(c => {
    c.style.boxShadow = ''
    c.style.transform = ''
    c.style.borderColor = ''
    c.classList.remove('z-50')
  })

  const target = cards[Math.floor(Math.random() * cards.length)]
  target.scrollIntoView({ behavior: 'smooth', block: 'center' })

  setTimeout(() => {
    target.classList.add('z-50')
    target.style.transform = 'scale3d(1.1, 1.1, 1.1)'
    target.style.boxShadow = '0 0 50px rgba(179,139,54,0.8), 0 0 100px rgba(179,139,54,0.4)'
    target.style.borderColor = '#b38b36'

    setTimeout(() => {
      target.style.transform = ''
      target.style.boxShadow = ''
      target.style.borderColor = ''
      target.classList.remove('z-50')
    }, 2000)
  }, 500)
}

// ============ 背景星光 Canvas ============
const bgCanvas = ref(null)
let animFrame

onMounted(() => {
  const canvas = bgCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  const stars = Array.from({ length: 150 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.5,
    alpha: Math.random(),
    dAlpha: (Math.random() - 0.5) * 0.02,
  }))

  function draw() {
    if (!canvas) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    stars.forEach(s => {
      s.alpha += s.dAlpha
      if (s.alpha <= 0 || s.alpha >= 1) s.dAlpha *= -1
      ctx.beginPath()
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`
      ctx.fill()
    })
    animFrame = requestAnimationFrame(draw)
  }
  draw()
})
</script>

<template>
  <div class="min-h-screen text-gray-300 font-sans relative selection:bg-accent/30 selection:text-accent">
    <canvas ref="bgCanvas" class="fixed inset-0 z-[-8] pointer-events-none opacity-30"></canvas>

    <!-- ======== 页面头部 ======== -->
    <div class="pt-32 pb-10 border-b border-white/5 relative z-10 animate-fade-in-up">
      <div class="max-w-[1400px] mx-auto px-4 lg:px-6 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
        <div>
          <div class="text-xs text-gray-500 mb-3 tracking-widest">友情链接</div>
          <h1 class="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 tracking-wider drop-shadow-md">
            与各位博主无限进步
          </h1>
        </div>
        <div class="flex items-center gap-4">
          <button
            @click="randomVisit"
            class="group flex items-center gap-2 px-5 py-2.5 rounded-full border border-accent/50 text-accent hover:border-accent hover:bg-accent/10 transition-all duration-300 text-sm font-medium shadow-lg shadow-accent/5"
          >
            <svg class="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
            随机访问
          </button>
          <button class="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 text-gray-200 hover:bg-white/10 hover:text-white transition-all duration-300 text-sm font-medium shadow-lg">
            申请友链
          </button>
        </div>
      </div>
    </div>

    <!-- ======== 友链内容 ======== -->
    <main class="max-w-[1400px] mx-auto px-4 lg:px-6 pt-12 pb-24 relative z-10 space-y-16">
      <!-- 推荐 -->
      <section class="animate-fade-in-up" style="animation-delay: 0.1s">
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-gray-200 flex items-baseline gap-3">
            推荐
            <span class="text-lg text-gray-500 font-normal tracking-wide">
              ({{ friends.filter(f => f.group === 'recommended').length }})
            </span>
          </h2>
          <p class="text-xs text-gray-500 mt-2 tracking-widest">都是大佬，推荐关注</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <a
            v-for="friend in friends.filter(f => f.group === 'recommended')"
            :key="friend.name"
            :href="friend.url"
            target="_blank"
            class="friend-card tilt-card group flex items-center gap-4 p-4 rounded-2xl glass-card hover:border-accent/80 hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/5 transition-all duration-300"
            @mousemove="tilt"
            @mouseleave="reset"
          >
            <div class="w-12 h-12 rounded-full bg-[#151517] shrink-0 border border-white/5 flex items-center justify-center overflow-hidden">
              <span v-if="!friend.avatar" class="text-white font-bold text-lg">{{ friend.name[0] }}</span>
              <img v-else :src="friend.avatar" :alt="friend.name" class="w-full h-full object-cover" />
            </div>
            <div class="flex flex-col flex-1 min-w-0">
              <div class="text-sm font-bold text-gray-200 truncate group-hover:text-accent transition-colors">{{ friend.name }}</div>
              <div class="text-[11px] text-gray-500 mt-1 line-clamp-2 leading-relaxed">{{ friend.desc }}</div>
            </div>
          </a>
        </div>
      </section>

      <!-- 小伙伴们 -->
      <section class="animate-fade-in-up" style="animation-delay: 0.2s">
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-gray-200 flex items-baseline gap-3">
            小伙伴们
            <span class="text-lg text-gray-500 font-normal tracking-wide">
              ({{ friends.filter(f => f.group === 'friends').length }})
            </span>
          </h2>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <a
            v-for="friend in friends.filter(f => f.group === 'friends')"
            :key="friend.name"
            :href="friend.url"
            target="_blank"
            class="friend-card tilt-card group flex items-center gap-4 p-4 rounded-2xl glass-card hover:border-accent/80 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
            @mousemove="tilt"
            @mouseleave="reset"
          >
            <div class="w-12 h-12 rounded-full bg-[#151517] shrink-0 border border-white/5 flex items-center justify-center overflow-hidden">
              <span v-if="!friend.avatar" class="text-white font-bold text-lg">{{ friend.name[0] }}</span>
              <img v-else :src="friend.avatar" :alt="friend.name" class="w-full h-full object-cover" />
            </div>
            <div class="flex flex-col flex-1 min-w-0">
              <div class="text-sm font-bold text-gray-200 truncate group-hover:text-accent transition-colors">{{ friend.name }}</div>
              <div class="text-[11px] text-gray-500 mt-1 line-clamp-2 leading-relaxed">{{ friend.desc }}</div>
            </div>
          </a>
        </div>
      </section>
    </main>
  </div>
</template>
