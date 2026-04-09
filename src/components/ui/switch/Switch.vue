<script setup>
import { computed } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps({
  modelValue: Boolean,
  disabled: Boolean,
  class: String,
  id: String,
})

const emit = defineEmits(['update:modelValue'])

const trackClasses = computed(() =>
  cn(
    'peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm',
    'transition-colors duration-200 ease-in-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    'disabled:cursor-not-allowed disabled:opacity-50',
    props.modelValue ? 'bg-primary' : 'bg-input',
    props.class,
  )
)
</script>

<template>
  <button
    type="button"
    role="switch"
    :id="id"
    :class="trackClasses"
    :aria-checked="modelValue"
    :disabled="disabled"
    @click="!disabled && emit('update:modelValue', !modelValue)"
    v-bind="$attrs"
  >
    <span
      :class="cn(
        'pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform duration-200',
        modelValue ? 'translate-x-4' : 'translate-x-0'
      )"
    />
  </button>
</template>
