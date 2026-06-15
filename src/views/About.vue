<script setup>
import { ref, onUnmounted } from 'vue'
import { useTiltCard } from '../composables/useTiltCard'
import { profile } from '../data/profile.js'
import CommentSection from '../components/CommentSection.vue'

const { tilt, reset } = useTiltCard()

function medalClass(medal) {
  if (/金|国一/.test(medal)) return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
  if (/银|国二/.test(medal)) return 'bg-gray-300/10 text-gray-300 border-gray-400/30'
  if (/铜|国三/.test(medal)) return 'bg-orange-700/10 text-orange-400 border-orange-700/30'
  return 'bg-white/5 text-gray-400 border-white/10'
}

const tlineOpen = ref(false)

function openTimeline() {
  tlineOpen.value = true
  document.body.style.overflow = 'hidden'
}

function closeTimeline() {
  tlineOpen.value = false
  document.body.style.overflow = ''
}

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<template>
  <div class="min-h-screen text-gray-300 font-sans relative">
    <main class="relative z-10 max-w-[88rem] mx-auto px-4 lg:px-6 pt-32 pb-24">

      <!-- 页面标题 -->
      <div class="mb-12 animate-fade-in-up">
        <h1
          class="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500 tracking-tight mb-2">
          关于我
        </h1>
        <p class="text-gray-400">{{ profile.basic.bio }}</p>
      </div>

      <div class="space-y-6">

        <!-- ====== Row 1: 名片(3) + 教育(3) + 技术栈(6) ====== -->
        <div class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-12 gap-6">

          <!-- ① 个人名片 (3列) — 手机端隐藏 -->
          <div
            class="hidden sm:flex lg:col-span-3 glass-card rounded-[2rem] p-6 flex-col items-center justify-center text-center animate-fade-in-up"
            style="animation-delay: 0.1s">
            <div class="relative w-20 h-20 mb-4">
              <div class="absolute inset-0 bg-accent rounded-full blur-md opacity-30"></div>
              <img v-if="profile.basic.avatar" :src="profile.basic.avatar"
                class="relative w-full h-full rounded-full object-cover border-2 border-white/10" alt="avatar" />
              <span v-else
                class="relative w-full h-full rounded-full bg-[#1c1c1e] border-2 border-white/10 flex items-center justify-center text-2xl font-bold text-white">{{
                  profile.basic.name[0] }}</span>
              <div
                class="absolute -bottom-1.5 -right-1.5 bg-[#121214] border border-white/10 px-2 py-0.5 rounded-full text-[10px] font-mono text-accent shadow-lg">
                🎂 {{ profile.basic.birthday }}
              </div>
            </div>
            <h2 class="text-xl font-bold text-white">{{ profile.basic.name }}</h2>
            <p class="text-accent text-xs font-medium mt-1">{{ profile.basic.title }}</p>
          </div>

          <!-- ①+② 手机端融合卡片 -->
          <div
            class="sm:hidden glass-card rounded-[2rem] p-6 flex items-center gap-5 animate-fade-in-up"
            style="animation-delay: 0.1s">
            <div class="relative w-16 h-16 shrink-0">
              <div class="absolute inset-0 bg-accent rounded-full blur-md opacity-30"></div>
              <img v-if="profile.basic.avatar" :src="profile.basic.avatar"
                class="relative w-full h-full rounded-full object-cover border-2 border-white/10" alt="avatar" />
              <span v-else
                class="relative w-full h-full rounded-full bg-[#1c1c1e] border-2 border-white/10 flex items-center justify-center text-xl font-bold text-white">{{
                  profile.basic.name[0] }}</span>
            </div>
            <div class="min-w-0">
              <h2 class="text-lg font-bold text-white">{{ profile.basic.name }}</h2>
              <p class="text-accent text-xs font-medium">{{ profile.basic.title }}</p>
              <div class="flex items-center gap-1.5 mt-1.5 text-xs text-gray-400">
                <span class="text-accent text-sm">🎓</span>
                <span>{{ profile.education.school }} · {{ profile.education.degree }}</span>
              </div>
            </div>
          </div>

          <!-- ② 教育 (3列) — 手机端隐藏 -->
          <div
            class="hidden sm:flex lg:col-span-3 glass-card rounded-[2rem] p-6 flex-col items-center justify-center text-center animate-fade-in-up"
            style="animation-delay: 0.15s">
            <div
              class="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-3 text-lg">
              🎓
            </div>
            <h3 class="text-sm font-bold text-white mb-1">{{ profile.education.school }}</h3>
            <p class="text-xs text-gray-400 mb-1">{{ profile.education.degree }}</p>
            <p class="text-xs font-mono text-accent">{{ profile.education.period }}</p>
          </div>

          <!-- ③ 技术栈 (6列) — 手机端隐藏 -->
          <div class="hidden sm:flex lg:col-span-6 glass-card rounded-[2rem] p-6 flex-col justify-center animate-fade-in-up"
            style="animation-delay: 0.2s">
            <h3 class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Tech Stack</h3>
            <div class="flex flex-wrap gap-2">
              <span v-for="tech in profile.skills" :key="tech"
                class="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors cursor-default">{{
                  tech }}</span>
            </div>
          </div>
        </div>

        <!-- ====== Row 2: 自我介绍 (12列) ====== -->
        <div class="glass-card rounded-[2rem] p-8 animate-fade-in-up" style="animation-delay: 0.25s">
          <h3 class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Hello, World.</h3>
          <p class="text-sm md:text-base text-gray-300 leading-relaxed" v-html="profile.basic.introduction"></p>
        </div>

        <!-- ====== Row 3: 精选奖项 (12列) ====== -->
        <div class="glass-card rounded-[2rem] p-8 animate-fade-in-up" style="animation-delay: 0.3s">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xs font-bold text-gray-500 uppercase tracking-widest">Awards & Honors</h3>
            <button v-if="profile.allAwards && profile.allAwards.length" @click="openTimeline()"
              class="text-xs text-gray-400 hover:text-accent transition-colors tracking-wide font-bold">XCPC CAREER ({{
                profile.allAwards.length }})</button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
            <div v-for="award in profile.awards" :key="award.date + award.name"
              class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-3 min-w-0">
                <span class="text-xs font-mono text-gray-500 shrink-0">{{ award.date }}</span>
                <span class="text-sm text-gray-200 font-medium truncate">{{ award.name }}</span>
              </div>
              <span class="text-xs font-bold px-2 py-0.5 rounded border shrink-0" :class="medalClass(award.medal)">{{
                award.medal }}</span>
            </div>
          </div>
        </div>

        <!-- ====== Row 4: 个人项目 (12列) ====== -->
        <div class="glass-card rounded-[2rem] p-8 animate-fade-in-up" style="animation-delay: 0.4s">
          <h3 class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Featured Projects</h3>
          <div class="grid grid-cols-2 lg:grid-cols-3 gap-3">
            <a v-for="proj in profile.projects" :key="proj.name" :href="proj.link" target="_blank"
              class="tilt-card group relative block p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-accent/30 transition-all duration-300"
              @mousemove="tilt" @mouseleave="reset">
              <div class="flex justify-between items-start mb-3">
                <div
                  class="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center text-sm shadow-inner">
                  {{ proj.icon }}
                </div>
                <svg class="w-3.5 h-3.5 text-gray-600 group-hover:text-accent transition-colors shrink-0" fill="none"
                  stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
              </div>
              <h4 class="text-sm font-bold text-gray-200 mb-1.5 group-hover:text-accent transition-colors">{{ proj.name }}</h4>
              <p class="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">{{ proj.desc }}</p>
              <div class="flex flex-wrap gap-1.5">
                <span v-for="tag in proj.tags" :key="tag"
                  class="text-[9px] font-mono text-gray-500 bg-black/30 px-1.5 py-0.5 rounded border border-white/5">{{
                    tag }}</span>
              </div>
            </a>
          </div>
        </div>

        <!-- ====== Row 5: 留言板 ====== -->
        <div class="animate-fade-in-up" style="animation-delay: 0.5s">
          <div
            class="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-accent/5 via-transparent to-purple-500/5 border border-white/10 p-8">
            <!-- 装饰 -->
            <div
              class="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2">
            </div>
            <div
              class="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2">
            </div>

            <!-- 头部 -->
            <div class="relative z-10 mb-6">
              <h3 class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Guestbook</h3>
              <h2 class="text-2xl md:text-3xl font-extrabold text-white">
                ✍️ 打个招呼
              </h2>
              <p class="text-sm text-gray-500 mt-4 leading-relaxed">
                路过就留句话吧~ 留言了就是朋友 👋
              </p>
            </div>

            <!-- 评论 -->
            <div class="relative z-10">
              <CommentSection title="留言板" />
            </div>
          </div>
        </div>

      </div>
    </main>

    <!-- ====== 抽屉：ACM 生涯时间轴 ====== -->
    <Teleport to="body">
      <!-- 遮罩 -->
      <Transition name="dr-backdrop">
        <div v-if="tlineOpen" class="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm" @click="closeTimeline()"></div>
      </Transition>

      <!-- 面板 -->
      <Transition name="dr-panel">
        <div v-if="tlineOpen"
          class="fixed top-0 right-0 bottom-0 z-[201] w-[420px] max-w-[90vw] bg-[#121214]/90 backdrop-blur-2xl backdrop-saturate-150 border-l border-white/[0.08] shadow-[inset_1px_0_1px_rgba(255,255,255,0.06),_-16px_0_48px_rgba(0,0,0,0.6)] flex flex-col">
          <!-- 顶栏 -->
          <div class="flex items-center justify-between px-6 py-5 border-b border-white/5 shrink-0">
            <h2
              class="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-accent to-yellow-400 tracking-wide uppercase">
              XCPC Career</h2>
            <button @click="closeTimeline()"
              class="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-all">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <!-- 时间轴主体 -->
          <div class="flex-1 overflow-y-auto px-6 py-8">
            <div class="relative">
              <!-- 竖线 -->
              <div class="absolute left-[15px] top-0 bottom-0 w-px bg-white/10"></div>

              <div class="space-y-8">
                <div v-for="(award, i) in profile.allAwards" :key="i" class="flex gap-5 group animate-fade-in-up"
                  :style="{ animationDelay: `${i * 0.05}s` }">
                  <!-- 节点 -->
                  <div class="relative z-10 shrink-0 flex flex-col items-center">
                    <div class="w-[8px] h-[8px] rounded-full mt-1.5 ring-[3px] ring-[#121214]"
                      :class="medalClass(award.medal).split(' ')[1] || 'bg-gray-500'"></div>
                  </div>

                  <!-- 内容 -->
                  <div class="flex-1 pb-2">
                    <div class="flex items-center justify-between gap-3 mb-1">
                      <span class="text-xs font-mono text-gray-500">{{ award.date }}</span>
                      <span class="text-[10px] font-bold px-1.5 py-0.5 rounded border shrink-0"
                        :class="medalClass(award.medal)">{{ award.medal }}</span>
                    </div>
                    <p class="text-sm text-gray-300 font-medium leading-relaxed">{{ award.name }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
