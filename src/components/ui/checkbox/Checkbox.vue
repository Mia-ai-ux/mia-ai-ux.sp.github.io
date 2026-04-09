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

const classes = computed(() =>
  cn(
    'peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow',
    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'accent-primary cursor-pointer',
    props.class,
  )
)
</script>

<template>
  <input
    type="checkbox"
    :id="id"
    :class="classes"
    :checked="modelValue"
    :disabled="disabled"
    @change="emit('update:modelValue', $event.target.checked)"
    v-bind="$attrs"
  />
</template>
