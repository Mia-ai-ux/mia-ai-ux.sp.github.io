<script setup>
import { inject, computed } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps({
  value: [String, Number],
  id: String,
  class: String,
})

const group = inject('radioGroup', null)

const isChecked = computed(() => group?.modelValue.value === props.value)
const isDisabled = computed(() => group?.disabled.value)

function handleChange() {
  if (!isDisabled.value) {
    group?.onChange(props.value)
  }
}

const classes = computed(() =>
  cn(
    'aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow',
    'focus:outline-none focus-visible:ring-1 focus-visible:ring-ring',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'cursor-pointer accent-primary',
    props.class,
  )
)
</script>

<template>
  <input
    type="radio"
    :id="id"
    :class="classes"
    :checked="isChecked"
    :disabled="isDisabled"
    :value="value"
    @change="handleChange"
  />
</template>
