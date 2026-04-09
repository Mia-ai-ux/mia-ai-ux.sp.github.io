<script setup>
import { computed } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps({
  value: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  class: String,
})

const percentage = computed(() =>
  Math.min(100, Math.max(0, (props.value / props.max) * 100))
)
</script>

<template>
  <div
    :class="cn('relative h-2 w-full overflow-hidden rounded-full bg-primary/20', props.class)"
    role="progressbar"
    :aria-valuenow="value"
    :aria-valuemax="max"
    aria-valuemin="0"
  >
    <div
      class="h-full w-full flex-1 bg-primary transition-all duration-300 ease-in-out"
      :style="{ transform: `translateX(-${100 - percentage}%)` }"
    />
  </div>
</template>
