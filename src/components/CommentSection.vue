<script setup>
// This component will eventually integrate Utterances.
// For now it shows a placeholder with sample comments.
const sampleComments = [
  {
    id: 1,
    author: '梦泽',
    avatar: '梦',
    date: '2024-03-20',
    content: '提醒一下 就是VitePress不是SSR，需要分辨一下 VitePress是SSG 静态站点生成',
    location: '湖南',
    device: '🤖 Android',
    browser: '🌐 Chrome',
  },
]
</script>

<template>
  <div class="mt-16 pt-8 border-t border-white/5">
    <h3 class="text-xl font-bold text-gray-200 mb-8 flex items-center gap-2">
      <span class="text-accent">💬</span> 评论区
    </h3>

    <!-- Sample comments -->
    <div class="space-y-6 mb-8">
      <div v-for="comment in sampleComments" :key="comment.id" class="flex gap-4">
        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shrink-0 flex items-center justify-center text-white font-bold shadow-md">
          {{ comment.avatar }}
        </div>
        <div class="flex-grow glass-card rounded-2xl rounded-tl-none p-4">
          <div class="flex justify-between items-start mb-2">
            <div class="flex items-center gap-2">
              <span class="font-bold text-gray-200 text-sm">{{ comment.author }}</span>
              <span class="text-xs text-gray-500 font-mono">{{ comment.date }}</span>
            </div>
          </div>
          <p class="text-gray-300 text-sm leading-relaxed mb-3">{{ comment.content }}</p>
          <div class="flex flex-wrap gap-3 text-[10px] text-gray-500 bg-black/20 rounded py-1 px-2 w-max">
            <span>{{ comment.location }}</span>
            <span>{{ comment.device }}</span>
            <span>{{ comment.browser }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Utterances will be injected here -->
    <div class="glass-card rounded-2xl p-6 text-center text-gray-500 text-sm">
      <p>💡 评论功能将使用 <a href="https://utteranc.es" target="_blank" class="text-accent hover:underline">Utterances</a> 接入，基于 GitHub Issues。</p>
      <p class="text-xs mt-1">部署后自动启用。</p>
    </div>
  </div>
</template>
