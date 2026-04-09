<script setup>
import { computed } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps({
  variant: { type: String, default: 'default' }, // default | destructive | success | warning
  class: String,
})

const variantClasses = {
  default: 'bg-background text-foreground',
  destructive: 'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
  success: 'border-green-500/50 text-green-700 [&>svg]:text-green-600',
  warning: 'border-yellow-500/50 text-yellow-700 [&>svg]:text-yellow-600',
}

const classes = computed(() =>
  cn(
    'relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg~*]:pl-7',
    variantClasses[props.variant] ?? variantClasses.default,
    props.class,
  )
)
</script>

<template>
  <div role="alert" :class="classes">
    <slot />
  </div>
</template>
