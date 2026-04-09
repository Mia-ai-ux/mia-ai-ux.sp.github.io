<script setup>
import { cn } from '@/lib/utils'

const props = defineProps({
  class: String,
  maxHeight: { type: String, default: '300px' },
})
</script>

<template>
  <div
    :class="cn('relative overflow-hidden', props.class)"
    :style="{ maxHeight }"
  >
    <div class="h-full w-full overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border hover:scrollbar-thumb-muted-foreground/30">
      <slot />
    </div>
  </div>
</template>
