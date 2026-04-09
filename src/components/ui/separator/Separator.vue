<script setup>
import { computed } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps({
  class: String,
  orientation: { type: String, default: 'horizontal' },
  decorative: { type: Boolean, default: true },
})

const classes = computed(() =>
  cn(
    'shrink-0 bg-border',
    props.orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
    props.class,
  )
)
</script>

<template>
  <div
    :class="classes"
    :role="decorative ? 'none' : 'separator'"
    :aria-orientation="decorative ? undefined : orientation"
    v-bind="$attrs"
  />
</template>
