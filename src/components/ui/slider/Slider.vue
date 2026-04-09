<script setup>
import { computed } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps({
  modelValue: { type: Number, default: 0 },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  step: { type: Number, default: 1 },
  disabled: Boolean,
  class: String,
})

const emit = defineEmits(['update:modelValue'])

const percentage = computed(() =>
  ((props.modelValue - props.min) / (props.max - props.min)) * 100
)
</script>

<template>
  <div :class="cn('relative flex w-full touch-none select-none items-center', props.class)">
    <div class="relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20">
      <div
        class="absolute h-full bg-primary"
        :style="{ width: `${percentage}%` }"
      />
    </div>
    <input
      type="range"
      :min="min"
      :max="max"
      :step="step"
      :value="modelValue"
      :disabled="disabled"
      class="absolute inset-0 w-full opacity-0 cursor-pointer disabled:cursor-not-allowed h-full"
      @input="emit('update:modelValue', Number($event.target.value))"
    />
    <div
      class="absolute block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
      :style="{ left: `calc(${percentage}% - 8px)` }"
    />
  </div>
</template>
