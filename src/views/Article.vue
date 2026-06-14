<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import TocSidebar from '../components/TocSidebar.vue'
import CommentSection from '../components/CommentSection.vue'

const route = useRoute()

// ============ 阅读进度条 ============
const scrollProgress = ref(0)
function handleScroll() {
  const top = document.body.scrollTop || document.documentElement.scrollTop
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight
  scrollProgress.value = height ? (top / height) * 100 : 0
}

onMounted(() => window.addEventListener('scroll', handleScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))

// ============ TOC 数据 ============
const tocItems = [
  { id: 'section-design', title: '设计理念', level: 1 },
  { id: 'section-why', title: '为什么是 VitePress', level: 2 },
  { id: 'section-tech', title: '主题技术栈', level: 1 },
  { id: 'section-code', title: '代码实现', level: 1 },
  { id: 'section-future', title: '未来展望', level: 1 },
]

// ============ 文章年龄 ============
const publishDate = new Date('2024-01-30')
const daysSincePublished = Math.ceil(Math.abs(new Date() - publishDate) / (1000 * 60 * 60 * 24))
</script>

<template>
  <div class="min-h-screen text-gray-300 font-sans relative selection:bg-accent/30 selection:text-accent">
    <!-- ======== 阅读进度条 ======== -->
    <div class="fixed top-0 left-0 h-1 bg-accent z-[60] transition-all duration-150 ease-out" :style="{ width: scrollProgress + '%' }"></div>

    <!-- ======== 文章头部 ======== -->
    <section class="pt-28 pb-10 max-w-[88rem] mx-auto px-4 lg:px-6 relative z-10 animate-fade-in-up">
      <div class="flex flex-wrap items-center gap-3 mb-6 text-xs text-gray-400">
        <span class="flex items-center gap-1 hover:text-white cursor-pointer transition-colors">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
          日常随笔
        </span>
        <span class="hover:text-white cursor-pointer transition-colors"># VitePress</span>
        <span class="hover:text-white cursor-pointer transition-colors"># Vue</span>
        <span class="hover:text-white cursor-pointer transition-colors"># 主题</span>
      </div>
      <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight tracking-wide drop-shadow-md">
        新年新气象！基于 VitePress 开发一个新主题
      </h1>
      <div class="flex flex-wrap items-center gap-6 text-xs text-gray-500">
        <span class="flex items-center gap-1.5">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          2024/1/30
        </span>
        <span>字数 3,200</span>
        <span>阅读约 8 分钟</span>
      </div>
    </section>

    <!-- ======== 主内容网格 ======== -->
    <main class="max-w-[88rem] mx-auto px-4 lg:px-6 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
      <!-- 左侧：文章正文 -->
      <div class="lg:col-span-9 space-y-6">
        <!-- 过期提醒 -->
        <div class="flex items-center gap-3 bg-yellow-600/10 border-l-4 border-accent p-4 rounded-r-lg mb-8 animate-fade-in-up">
          <svg class="w-5 h-5 text-accent shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
          <p class="text-sm text-yellow-500/90 tracking-wide">本文发表于 <strong class="text-accent font-bold">{{ daysSincePublished }}</strong> 天前，其中的信息可能已经事过境迁</p>
        </div>

        <!-- 文章正文 -->
        <article class="glass-panel p-6 lg:p-10 animate-fade-in-up" style="animation-delay: 0.2s">
          <!-- AI 摘要 -->
          <div class="bg-[#1e1e20] border border-white/5 rounded-xl overflow-hidden shadow-inner mb-8">
            <div class="flex justify-between items-center bg-white/5 px-4 py-2.5 border-b border-white/5">
              <div class="flex items-center gap-2">
                <span class="text-lg">🤖</span>
                <span class="text-sm font-bold text-accent">文章摘要 ></span>
              </div>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-accent/20 text-accent border border-accent/30">AI</span>
            </div>
            <div class="p-5">
              <p class="text-sm text-gray-300 leading-relaxed">
                这篇文章介绍了作者基于 VitePress 从零开发博客主题的经历，比较了 Hexo、Halo、Typecho 等方案后选择 VitePress 的理由，并展示了主题的技术栈和功能特性。
              </p>
            </div>
          </div>
          <div class="prose max-w-none">
            <h2 id="section-design" class="toc-target">缘由</h2>
            <p>曾经数次更换主题与搭建程序，<code>Hexo</code>、<code>Halo</code>、<code>Typecho</code> 甚至 <code>WordPress</code>，但一直感觉使用其他人的主题不是太自由，并且在更新时十分麻烦。经过了一段时间的学习后，最终还是感觉 <code>Vue</code> 写起来比较顺手，并且感觉洪哥的博客的样式十分舒服，于是，开始基于 <code>VitePress</code> 从零开发一个类似于 Heo 的博客主题。</p>

            <h3 id="section-why" class="toc-target">为什么是 VitePress</h3>
            <p>其实，在最初立项时，也考虑过使用 <code>Next.js</code> 亦或者 <code>Halo</code>，但是由于 <code>Halo</code> 需要使用服务器，不符合纯静态站点的需求，直接 pass。又因为 VitePress 基于 <code>Vite</code> 和 <code>Vue 3</code>，对 Vue 生态非常友好，最终选择了它。</p>

            <h2 id="section-tech" class="toc-target">主题技术栈</h2>
            <ul>
              <li><strong>VitePress:</strong> 基于 <code>Vite</code> 和 <code>Vue 3</code> 的静态站点生成器。</li>
              <li><strong>Vue3:</strong> 一个渐进式的 <code>JavaScript</code> 框架。</li>
              <li><strong>懒加载:</strong> 文章页内的图片与友链页的图片均采用懒加载。</li>
            </ul>
            <blockquote>主题部分样式参考自 HeoBlog，并在此基础上做出了一些小修改。</blockquote>

            <h2 id="section-code" class="toc-target">代码实现</h2>
            <p>以下代码展示了如何不依赖外部库，通过原生 API 和 Vue 事件绑定实现卡片的 3D 倾斜反馈：</p>

            <!-- Mac 风格代码块 -->
            <div class="my-6 rounded-xl overflow-hidden bg-[#121214] border border-white/10 shadow-2xl">
              <div class="code-block-header">
                <div class="flex gap-1.5">
                  <div class="code-dot red"></div>
                  <div class="code-dot yellow"></div>
                  <div class="code-dot green"></div>
                </div>
                <span class="text-xs text-gray-500 font-mono">TiltCard.vue</span>
              </div>
              <div class="p-4 overflow-x-auto text-sm font-mono leading-loose flex">
                <div class="line-numbers">
                  1<br>2<br>3<br>4<br>5
                </div>
                <div class="text-gray-300">
                  <span class="text-purple-400">const</span> <span class="text-blue-400">rotateX</span> = (<span class="text-orange-300">0.5</span> - (y / rect.<span class="text-teal-300">height</span>)) * <span class="text-orange-300">15</span>;<br>
                  <span class="text-purple-400">const</span> <span class="text-blue-400">rotateY</span> = ((x / rect.<span class="text-teal-300">width</span>) - <span class="text-orange-300">0.5</span>) * <span class="text-orange-300">15</span>;<br>
                  card.<span class="text-teal-300">style</span>.<span class="text-teal-300">transform</span> = <span class="text-green-300">`perspective(1000px) rotateX(</span><span class="text-blue-400">${rotateX}</span><span class="text-green-300">deg)`</span>;<br>
                </div>
              </div>
            </div>

            <h2 id="section-future" class="toc-target">未来展望</h2>
            <p>通过加入 IntersectionObserver，我们还能实现图片进入视口时的平滑放大、文本的逐行上浮等效果。后续计划加入更多的交互细节，让博客的浏览体验更上一层楼。</p>

            <!-- 撑开高度以测试滚动 -->
            <div class="h-[400px]"></div>
          </div>
        </article>

        <!-- 版权声明 -->
        <div class="relative overflow-hidden glass-card rounded-3xl p-6 mt-12 transition-all hover:border-white/10 group animate-fade-in-up">
          <div class="absolute -right-8 -bottom-12 text-[150px] font-bold text-white opacity-[0.03] select-none transition-transform duration-500 group-hover:scale-110">©</div>
          <h3 class="text-lg font-bold text-gray-200 mb-1 relative z-10">新年新气象！基于 VitePress 开发一个新主题</h3>
          <a href="#" class="text-xs text-accent hover:underline decoration-dashed underline-offset-4 relative z-10 break-all block mb-6">https://blog.imsyy.top/posts/2024/0130</a>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm relative z-10">
            <div><p class="text-gray-500 text-xs mb-1">作者</p><p class="text-gray-300 font-medium flex items-center gap-1.5"><span class="w-4 h-4 rounded-full bg-accent text-[8px] flex items-center justify-center text-white">栈</span>无名</p></div>
            <div><p class="text-gray-500 text-xs mb-1">发布于</p><p class="text-gray-300 font-mono">2024/1/30</p></div>
            <div><p class="text-gray-500 text-xs mb-1">更新于</p><p class="text-gray-300 font-mono">2024/1/17</p></div>
            <div><p class="text-gray-500 text-xs mb-1">许可协议</p><a href="#" class="text-gray-300 hover:text-accent transition-colors">CC BY-NC-SA 4.0</a></div>
          </div>
        </div>

        <!-- 评论区 -->
        <CommentSection />
      </div>

      <!-- 右侧：TOC 侧边栏 — animate 在外层, sticky 在内层 -->
      <aside class="hidden lg:block lg:col-span-3 animate-fade-in-up" style="animation-delay: 0.3s">
        <div class="sticky top-24">
          <TocSidebar :items="tocItems" />
        </div>
      </aside>
    </main>
  </div>
</template>
