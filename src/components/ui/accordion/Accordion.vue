<script setup>
import { ref, provide } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps({
  type: { type: String, default: 'single' }, // single | multiple
  class: String,
})

const openItems = ref(new Set())

function toggle(value) {
  if (props.type === 'single') {
    openItems.value = openItems.value.has(value) ? new Set() : new Set([value])
  } else {
    const next = new Set(openItems.value)
    next.has(value) ? next.delete(value) : next.add(value)
    openItems.value = next
  }
}

function isOpen(value) {
  return openItems.value.has(value)
}

provide('accordion', { toggle, isOpen })
</script>

<template>
  <div :class="cn('w-full', props.class)">
    <slot />
  </div>
</template>
