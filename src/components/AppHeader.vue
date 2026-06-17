<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import SearchModal from './SearchModal.vue'

const route = useRoute()
const isMobileMenuOpen = ref(false)
const isScrolled = ref(false)
const showSearch = ref(false)

// 移动端菜单打开时，点击外部关闭
function onBodyClick(e) {
  if (!e.target.closest('header')) {
    isMobileMenuOpen.value = false
  }
}
watch(isMobileMenuOpen, (val) => {
  if (val) {
    document.addEventListener('click', onBodyClick)
  } else {
    document.removeEventListener('click', onBodyClick)
  }
})
onUnmounted(() => document.removeEventListener('click', onBodyClick))

function isActive(paths) {
  return paths.some(p => route.path === p || route.path.startsWith(p + '/'))
}

function handleScroll() {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50 transition-all duration-500" :class="isScrolled
    ? 'h-14 backdrop-blur-xl bg-bg-dark/95 shadow-lg shadow-black/40 border-b border-white/10'
    : 'h-16 backdrop-blur-lg bg-bg-dark/70 border-b border-white/5'">
    <div class="max-w-[88rem] mx-auto px-6 h-full flex items-center justify-between relative">
      <!-- Logo -->
      <RouterLink to="/" class="group shrink-0 cursor-pointer">
        <span class="inline-block text-white font-extrabold tracking-widest text-lg
          group-hover:text-accent group-hover:scale-110
          group-hover:[text-shadow:0_0_5px_rgba(179,139,54,0.35)]
          transition-all duration-300 ease-out">
          Lynia's Blog
        </span>
      </RouterLink>

      <!-- ==================== Desktop Nav ==================== -->
      <nav class="hidden lg:flex items-center gap-2 text-sm font-bold absolute left-1/2 -translate-x-1/2 z-50">

        <!-- 1. 文库 (含下拉悬浮胶囊) -->
        <div class="relative group">
          <span
            class="px-5 py-2.5 rounded-full transition-all duration-300 cursor-pointer outline-none block select-none"
            :class="isActive(['/posts', '/p', '/k', '/c', '/other', '/notes', '/categories', '/type', '/tags', '/tag'])
              ? 'text-white bg-accent shadow-[0_0_15px_rgba(179,139,54,0.3)]'
              : 'text-gray-300 group-hover:text-white group-hover:bg-accent group-hover:shadow-[0_0_15px_rgba(179,139,54,0.3)]'">
            文库
          </span>

          <!-- 下拉悬浮胶囊面板 -->
          <div
            class="absolute left-1/2 -translate-x-1/2 top-full mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
            <div class="absolute -top-4 left-0 w-full h-6"></div>
            <div
              class="bg-[#1f1f22] border border-accent/80 rounded-full shadow-[0_8px_30px_rgba(179,139,54,0.15)] px-6 py-3.5 flex items-center gap-7 whitespace-nowrap">

              <RouterLink to="/posts"
                class="flex items-center gap-2.5 text-gray-300 hover:text-white transition-colors group/item">
                <svg class="w-4 h-4 text-gray-400 group-hover/item:text-white transition-colors" fill="currentColor"
                  viewBox="0 0 20 20">
                  <path fill-rule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                    clip-rule="evenodd" />
                </svg>
                文章列表
              </RouterLink>

              <RouterLink to="/categories"
                class="flex items-center gap-2.5 text-gray-300 hover:text-white transition-colors group/item">
                <svg class="w-4 h-4 text-gray-400 group-hover/item:text-white transition-colors" fill="currentColor"
                  viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                </svg>
                全部分类
              </RouterLink>

              <RouterLink to="/tags"
                class="flex items-center gap-2.5 text-gray-300 hover:text-white transition-colors group/item">
                <svg class="w-4 h-4 text-gray-400 group-hover/item:text-white transition-colors" fill="currentColor"
                  viewBox="0 0 20 20">
                  <path fill-rule="evenodd"
                    d="M9.243 3.03a1 1 0 01.727 1.213L9.53 6h2.94l.56-2.243a1 1 0 111.94.486L14.53 6H17a1 1 0 110 2h-2.97l-1 4H15a1 1 0 110 2h-2.47l-.56 2.242a1 1 0 11-1.94-.485L10.47 14H7.53l-.56 2.242a1 1 0 11-1.94-.485L5.47 14H3a1 1 0 110-2h2.97l1-4H5a1 1 0 110-2h2.47l.56-2.243a1 1 0 011.213-.727zM9.03 8l-1 4h2.938l1-4H9.031z"
                    clip-rule="evenodd" />
                </svg>
                全部标签
              </RouterLink>

            </div>
          </div>
        </div>

        <!-- 2. 项目 -->
        <span
          class="px-5 py-2.5 rounded-full text-gray-300 hover:text-white hover:bg-accent hover:shadow-[0_0_15px_rgba(179,139,54,0.3)] transition-all duration-300 cursor-pointer outline-none select-none">
          项目
        </span>

        <!-- 3. 友链 -->
        <RouterLink to="/friends" class="px-5 py-2.5 rounded-full transition-all duration-300"
          :class="isActive(['/friends']) ? 'text-white bg-accent shadow-[0_0_15px_rgba(179,139,54,0.3)]' : 'text-gray-300 hover:text-white hover:bg-white/10'">
          友链
        </RouterLink>

        <!-- 4. 关于 -->
        <RouterLink to="/about" class="px-5 py-2.5 rounded-full transition-all duration-300"
          :class="isActive(['/about']) ? 'text-white bg-accent shadow-[0_0_15px_rgba(179,139,54,0.3)]' : 'text-gray-300 hover:text-white hover:bg-white/10'">
          关于
        </RouterLink>
      </nav>

      <!-- Search + Mobile toggle -->
      <div class="flex items-center gap-1">
        <button @click="showSearch = true"
          class="w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          title="搜索">
          <svg class="w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </button>
        <button @click="isMobileMenuOpen = !isMobileMenuOpen"
          class="lg:hidden w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
          <svg v-if="!isMobileMenuOpen" class="w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
          <svg v-else class="w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile menu -->
    <Transition name="slide-down">
      <div v-if="isMobileMenuOpen" class="lg:hidden bg-bg-dark/98 backdrop-blur-xl border-b border-white/10 shadow-2xl">
        <div class="px-6 py-4 flex flex-col gap-1">
          <RouterLink to="/" @click="isMobileMenuOpen = false"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-300 hover:text-white hover:bg-white/5 transition-all">
            🏠 首页</RouterLink>
          <RouterLink to="/posts" @click="isMobileMenuOpen = false"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-300 hover:text-white hover:bg-white/5 transition-all">
            📄 文章列表</RouterLink>
          <RouterLink to="/categories" @click="isMobileMenuOpen = false"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-300 hover:text-white hover:bg-white/5 transition-all">
            📁 全部分类</RouterLink>
          <RouterLink to="/tags" @click="isMobileMenuOpen = false"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-300 hover:text-white hover:bg-white/5 transition-all">
            🏷️ 全部标签</RouterLink>
          <RouterLink to="/friends" @click="isMobileMenuOpen = false"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-300 hover:text-white hover:bg-white/5 transition-all">
            🔗 友链</RouterLink>
          <RouterLink to="/about" @click="isMobileMenuOpen = false"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-300 hover:text-white hover:bg-white/5 transition-all">
            👤 关于</RouterLink>
        </div>
      </div>
    </Transition>

    <SearchModal v-if="showSearch" @close="showSearch = false" />
  </header>
</template>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
