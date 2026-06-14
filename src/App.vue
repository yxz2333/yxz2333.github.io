<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DefaultLayout from './layouts/DefaultLayout.vue'
import PageTransition from './components/PageTransition.vue'
import { usePageTransition } from './composables/usePageTransition'

const router = useRouter()
const { active, pageReady, start, end } = usePageTransition()

onMounted(() => {
  start()
  setTimeout(() => end(), 800)
})

router.beforeEach((to, from) => {
  if (!from.name) return
  start()
})

router.afterEach(() => {
  end()
})
</script>

<template>
  <!-- anim-paused: 蒙版未离开时冻结页面入场动画 -->
  <div :class="{ 'anim-paused': !pageReady }">
    <DefaultLayout>
      <router-view />
    </DefaultLayout>
  </div>
  <PageTransition :active="active" />
</template>
