<script setup>
import { computed } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps({
  class: String,
  for: String,
})

const classes = computed(() =>
  cn(
    'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
    props.class,
  )
)
</script>

<template>
  <label :class="classes" :for="props.for" v-bind="$attrs">
    <slot />
  </label>
</template>
