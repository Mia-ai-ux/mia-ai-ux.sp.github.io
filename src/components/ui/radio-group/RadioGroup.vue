<script setup>
import { provide, computed } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps({
  modelValue: [String, Number],
  disabled: Boolean,
  class: String,
  orientation: { type: String, default: 'vertical' }, // vertical | horizontal
})

const emit = defineEmits(['update:modelValue'])

provide('radioGroup', {
  modelValue: computed(() => props.modelValue),
  disabled: computed(() => props.disabled),
  onChange: (val) => emit('update:modelValue', val),
})

const classes = computed(() =>
  cn(
    'grid gap-2',
    props.orientation === 'horizontal' && 'grid-flow-col auto-cols-max',
    props.class,
  )
)
</script>

<template>
  <div :class="classes" role="radiogroup">
    <slot />
  </div>
</template>
