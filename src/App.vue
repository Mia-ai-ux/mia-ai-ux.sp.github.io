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

const pageTitle = computed(() =>
  route.path.startsWith('/sb') ? 'New SB Campaign' : 'New SP Campaign'
)
</script>
