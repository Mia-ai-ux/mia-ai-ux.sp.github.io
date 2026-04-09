<script setup>
import { computed } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps({
  modelValue: String,
  placeholder: String,
  disabled: Boolean,
  rows: { type: Number, default: 3 },
  class: String,
})

const emit = defineEmits(['update:modelValue'])

const classes = computed(() =>
  cn(
    'flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm',
    'placeholder:text-muted-foreground',
    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'resize-y',
    props.class,
  )
)
</script>

<template>
  <textarea
    :class="classes"
    :rows="rows"
    :placeholder="placeholder"
    :disabled="disabled"
    :value="modelValue"
    @input="emit('update:modelValue', $event.target.value)"
    v-bind="$attrs"
  />
</template>
