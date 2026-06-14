import { ref } from 'vue'

const active = ref(false)
const pageReady = ref(false)

const MIN_MASK_DURATION = 600
let maskStartedAt = 0

export function usePageTransition() {
  function start() {
    maskStartedAt = performance.now()
    active.value = true          // → 蒙版瞬间黑屏
    pageReady.value = false      // → 冻结新页面动画
  }

  function end() {
    const elapsed = performance.now() - maskStartedAt
    const remaining = Math.max(0, MIN_MASK_DURATION - elapsed)

    setTimeout(() => {
      // 解冻动画 + 同步开始蒙版淡出
      // 蒙版 fade 0.5s，fadeInUp 是 0.6s — 动画全程透过渐隐的蒙版可见
      pageReady.value = true
      active.value = false
    }, remaining)
  }

  return { active, pageReady, start, end }
}
