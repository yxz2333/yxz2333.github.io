<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'

const props = defineProps({
  items: { type: Array, default: () => [] },
})

const activeId = ref('')

const activeIdx = computed(() => {
  return props.items.findIndex((t) => t.id === activeId.value)
})

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
    <h3 class="text-sm font-bold text-gray-300 mb-5 flex items-center gap-2 shrink-0">
      <svg class="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path></svg>
      目录
    </h3>

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
