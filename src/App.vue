<template>
  <TopNav :user-name="userName" :page-title="pageTitle" />
  <RouterView />
  <Toaster />
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import TopNav from '@/components/TopNav.vue'
import { Toaster } from '@/components/ui/toast'

const userName = 'Mia Hu'
const route = useRoute()

const pageTitle = computed(() => {
  if (route.path.startsWith('/sb')) return 'New SB Campaign'
  // Hash 路由在少数环境下 path 未就绪时，用 location 兜底
  if (typeof location !== 'undefined' && /#\/sb(\/|$)/.test(location.hash)) {
    return 'New SB Campaign'
  }
  return 'New SP Campaign'
})
</script>
