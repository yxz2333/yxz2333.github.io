import { ref, onMounted, onUnmounted } from 'vue'

export function useMouseSpotlight() {
  const mouseX = ref(-1000)
  const mouseY = ref(-1000)
  const isActive = ref(false)

  function handleMouseMove(e) {
    mouseX.value = e.clientX
    mouseY.value = e.clientY
    isActive.value = true
  }

  function handleMouseLeave() {
    isActive.value = false
  }

  onMounted(() => {
    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)
  })

  onUnmounted(() => {
    window.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseleave', handleMouseLeave)
  })

  return { mouseX, mouseY, isActive }
}
