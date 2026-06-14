<script setup>
defineProps({
  active: Boolean,
})
</script>

<template>
  <!-- 进入瞬间完成(无过渡) → 点击立即黑屏。离开 0.3s 渐隐。 -->
  <Transition name="pt-mask">
    <div
      v-if="active"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-bg-dark"
    >
      <img
        src="/avatar.png"
        alt="avatar"
        class="w-28 h-28 rounded-full object-cover animate-avatar-pulse"
      />
    </div>
  </Transition>
</template>

<style scoped>
/* ======== 蒙版：只淡出，进入瞬间完成 ======== */
.pt-mask-leave-active { transition: opacity 0.5s ease; }
.pt-mask-leave-to      { opacity: 0; }

/* ======== 头像呼吸 + 荧光 ======== */
.animate-avatar-pulse {
  animation: avatarPulse 1.2s ease-in-out infinite;
  box-shadow: 0 0 40px rgba(179, 139, 54, 0.3), 0 0 80px rgba(179, 139, 54, 0.12);
}

@keyframes avatarPulse {
  0%, 100% { transform: scale(1);   opacity: 1; }
  50%      { transform: scale(1.06); opacity: 0.85; }
}
</style>
