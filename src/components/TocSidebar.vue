<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'

const props = defineProps({
  items: { type: Array, default: () => [] },
})

const activeId = ref('')

const activeIdx = computed(() => {
  return props.items.findIndex((t) => t.id === activeId.value)
})

function scrollUp() {
  const top = document.documentElement.scrollTop || document.body.scrollTop
  if (top === 0) return
  const duration = 300
  const start = performance.now()
  function step(now) {
    const elapsed = now - start
    const progress = Math.min(elapsed / duration, 1)
    const ease = 1 - Math.pow(1 - progress, 3)  // ease-out
    document.documentElement.scrollTop = top * (1 - ease)
    document.body.scrollTop = top * (1 - ease)
    if (progress < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

function scrollDown() {
  const el = document.getElementById('recommendations-section') || document.getElementById('giscus-container')
  if (!el) return
  const target = el.getBoundingClientRect().top + window.scrollY - 80  // 留 80px 顶部空间
  const start = document.documentElement.scrollTop || document.body.scrollTop
  const distance = target - start
  if (Math.abs(distance) < 2) return
  const duration = 400
  const t0 = performance.now()
  function step(now) {
    const progress = Math.min((now - t0) / duration, 1)
    const ease = 1 - Math.pow(1 - progress, 3)
    const pos = start + distance * ease
    document.documentElement.scrollTop = pos
    document.body.scrollTop = pos
    if (progress < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

function scrollTo(id) {
  const el = document.getElementById(id)
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - 100
    window.scrollTo({ top, behavior: 'smooth' })
  }
}

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) activeId.value = entry.target.id
    })
  }, { rootMargin: '-10% 0px -70% 0px' })

  nextTick(() => {
    document.querySelectorAll('.toc-target').forEach((el) => observer.observe(el))
  })
})
</script>

<template>
  <div class="glass-card rounded-3xl p-6 shadow-xl max-h-[70vh] flex flex-col">
    <div class="flex items-center justify-between mb-5 shrink-0">
      <h3 class="text-sm font-bold text-gray-300 flex items-center gap-2">
        <svg class="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path></svg>
        目录
      </h3>
      <div class="flex items-center gap-1">
        <button
          @click="scrollUp()"
          title="回到顶部"
          class="w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
        </button>
        <button
          @click="scrollDown()"
          title="跳到推荐/评论区"
          class="w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
        </button>
      </div>
    </div>

    <nav class="overflow-y-auto flex-1 -mr-3 pr-3 toc-scroll">
      <div class="relative">
        <!-- 轨道线 -->
        <div class="absolute left-0 top-0 bottom-0 w-px bg-white/10"></div>
        <!-- 活跃指示器 -->
        <div
          v-if="activeIdx >= 0"
          class="absolute left-0 w-0.5 bg-accent rounded-full transition-all duration-300 ease-out"
          :style="{ top: activeIdx * 32 + 'px' }"
          style="height: 20px"
        ></div>

        <ul class="text-sm space-y-0">
          <li v-for="item in items" :key="item.id">
            <a
              :href="'#' + item.id"
              class="block py-1.5 transition-colors duration-200 truncate"
              :class="[
                activeId === item.id ? 'text-accent font-semibold' : 'text-gray-500 hover:text-gray-300',
                item.level === 3 ? 'pl-8' : item.level === 2 ? 'pl-5' : 'pl-3',
              ]"
              @click.prevent="scrollTo(item.id)"
            >
              <span v-html="item.title"></span>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<style scoped>
.toc-scroll::-webkit-scrollbar { width: 4px; }
.toc-scroll::-webkit-scrollbar-track { background: transparent; }
.toc-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }
.toc-scroll::-webkit-scrollbar-thumb:hover { background: rgba(179,139,54,0.3); }
</style>
