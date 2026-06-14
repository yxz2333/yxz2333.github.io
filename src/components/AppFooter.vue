<script setup>
import { siteConfig } from '../data/site.js'

// 社交图标配置 — key 对应 siteConfig.social 的字段名
const socialDefs = {
  github: {
    label: 'GitHub',
    svg: '<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>',
    viewBox: '0 0 24 24',
  },
  bilibili: {
    label: 'Bilibili',
    text: 'B站',
  },
  email: {
    label: 'Email',
    svg: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>',
    viewBox: '0 0 24 24',
    stroke: true,  // email 图标用 stroke，其他用 fill
  },
  x: {
    label: 'X',
    svg: '<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>',
    viewBox: '0 0 24 24',
  },
  steam: {
    label: 'Steam',
    svg: '<path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm-2.05 3.67c-2.676.099-4.95 1.955-5.843 4.686.374.165.778.26 1.208.26 1.434 0 2.675-.91 3.155-2.235.182.055.374.09.573.09 1.105 0 2-.896 2-2s-.895-2-2-2c-.532 0-1.014.208-1.373.546.611-.95 1.613-1.66 2.822-1.86l-.54 2.295 1.168.262.418-1.774c.527.131 1.007.38 1.417.712-.786 1.23-2.148 2.044-3.71 2.044-1.03 0-1.978-.323-2.758-.871l-.309.61c.209.445.328.93.328 1.441 0 1.555-1.022 2.874-2.432 3.332a6.006 6.006 0 003.56 1.119c3.314 0 6-2.686 6-6s-2.686-6-6-6a5.97 5.97 0 00-3.123.916zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>',
    viewBox: '0 0 24 24',
  },
  codeforces: {
    label: 'Codeforces',
    text: 'CF',
  },
  atcoder: {
    label: 'AtCoder',
    text: 'AC',
  },
  qq: {
    label: 'QQ',
    text: 'QQ',
  },
}

// 按顺序排列
const socialLinks = Object.entries(siteConfig.social)
  .filter(([key]) => socialDefs[key])
  .map(([key, url]) => ({ key, url, ...socialDefs[key] }))
</script>

<template>
  <footer class="border-t border-white/5 relative z-10 bg-bg-dark/50 backdrop-blur-md">
    <!-- Social icons -->
    <div class="flex justify-center -mt-6 mb-8 gap-4">
      <a v-for="s in socialLinks" :key="s.key" :href="s.url" target="_blank" :title="s.label"
        class="w-12 h-12 rounded-full bg-[#1a1a1c] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-accent hover:shadow-[0_0_15px_rgba(179,139,54,0.5)] transition-all transform hover:-translate-y-1">
        <!-- SVG icon -->
        <svg v-if="s.svg" class="w-5 h-5" :viewBox="s.viewBox" :fill="s.stroke ? 'none' : 'currentColor'"
          :stroke="s.stroke ? 'currentColor' : 'none'" v-html="s.svg"></svg>
        <!-- Text fallback -->
        <span v-else class="text-xs font-bold">{{ s.text }}</span>
      </a>
    </div>

    <!-- Bottom bar -->
    <div class="border-t border-white/5 bg-[#141415] py-4">
      <div
        class="max-w-[88rem] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
        <div class="flex items-center gap-4 flex-wrap justify-center">
          <span>© 2019 - 2026 By <strong class="text-gray-300">{{ siteConfig.author }}</strong></span>
          <a href="#" class="hover:text-white flex items-center gap-1">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd"
                d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-1.998A11.954 11.954 0 0110 1.944zM10 14a4 4 0 100-8 4 4 0 000 8zm0-2a2 2 0 100-4 2 2 0 000 4z"
                clip-rule="evenodd"></path>
            </svg>
            {{ siteConfig.icp }}
          </a>
        </div>
        <div class="flex items-center gap-4 flex-wrap justify-center">
          <span>Powered by <strong class="text-gray-300">Vue</strong></span>
          <span class="flex items-center gap-1">
            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm-1 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1h-2z" />
            </svg>
            66CCFF
          </span>
        </div>
      </div>
    </div>
  </footer>
</template>
