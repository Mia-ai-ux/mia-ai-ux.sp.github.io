<script setup>
import { cn } from '@/lib/utils'

const props = defineProps({
  src: String,
  alt: String,
  fallback: String,
  size: { type: String, default: 'md' }, // sm | md | lg
  class: String,
})

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-base',
}
</script>

<template>
  <span
    :class="cn(
      'relative flex shrink-0 overflow-hidden rounded-full',
      sizeClasses[size] ?? sizeClasses.md,
      props.class
    )"
  >
    <img
      v-if="src"
      :src="src"
      :alt="alt"
      class="aspect-square h-full w-full object-cover"
      @error="$event.target.style.display='none'"
    />
    <span
      v-if="!src || fallback"
      class="flex h-full w-full items-center justify-center rounded-full bg-muted font-medium uppercase"
    >
      {{ fallback ?? (alt ? alt[0] : '?') }}
    </span>
  </span>
</template>
