<script setup>
import { cn } from '@/lib/utils'
const props = defineProps({ class: String })
</script>
<template>
  <div
    :class="cn(
      'inline-flex h-9 items-center justify-center rounded-lg border border-border bg-muted p-1 text-muted-foreground shadow-sm',
      props.class
    )"
    role="tablist"
  >
    <slot />
  </div>
</template>
