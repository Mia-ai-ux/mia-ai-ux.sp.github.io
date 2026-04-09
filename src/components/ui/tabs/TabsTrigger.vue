<script setup>
import { inject, computed } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps({
  value: String,
  disabled: Boolean,
  class: String,
})

const tabs = inject('tabs')
const isActive = computed(() => tabs?.activeTab.value === props.value)
</script>

<template>
  <button
    role="tab"
    :aria-selected="isActive"
    :disabled="disabled"
    :class="cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      isActive
        ? 'bg-background text-foreground shadow'
        : 'hover:bg-background/50 hover:text-foreground',
      props.class
    )"
    @click="tabs?.setTab(value)"
  >
    <slot />
  </button>
</template>
