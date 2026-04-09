<script setup>
import { inject, computed } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps({
  value: String,
  class: String,
})

const tabs = inject('tabs')
const isActive = computed(() => tabs?.activeTab.value === props.value)
</script>

<template>
  <div
    v-show="isActive"
    role="tabpanel"
    :class="cn('mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2', props.class)"
  >
    <slot />
  </div>
</template>
