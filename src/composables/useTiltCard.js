export function useTiltCard() {
  function tilt(e) {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const rotateY = ((x / rect.width) - 0.5) * 15
    const rotateX = (0.5 - (y / rect.height)) * 15
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale3d(1.02, 1.02, 1.02)`
    card.style.boxShadow = `${-rotateY}px ${rotateX}px 20px rgba(179,139,54,0.1)`
    card.style.borderColor = 'rgba(179,139,54,0.3)'
  }

  function reset(e) {
    const card = e.currentTarget
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale3d(1, 1, 1)'
    card.style.boxShadow = ''
    card.style.borderColor = ''
  }

  return { tilt, reset }
}
