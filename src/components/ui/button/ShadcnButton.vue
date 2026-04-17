<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: { type: String, default: 'default' },
  size:    { type: String, default: 'default' },
  disabled: Boolean,
})

const variantMap = {
  default:     'bg-blue-700 text-white hover:bg-blue-800',
  outline:     'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-100',
  ghost:       'bg-transparent text-gray-700 hover:bg-gray-100',
  link:        'bg-transparent text-blue-700 underline-offset-4 hover:underline px-0',
  destructive: 'bg-red-600 text-white hover:bg-red-700',
}
const sizeMap = {
  sm:      'h-8 px-3 text-xs',
  default: 'h-9 px-4 text-sm',
  lg:      'h-11 px-6 text-base',
}

const cls = computed(() => [
  'inline-flex items-center justify-center gap-1.5',
  'whitespace-nowrap font-medium rounded-md transition-colors',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500',
  'disabled:pointer-events-none disabled:opacity-50',
  variantMap[props.variant] ?? variantMap.default,
  sizeMap[props.size] ?? sizeMap.default,
].join(' '))
</script>

<template>
  <button :class="cls" :disabled="disabled" v-bind="$attrs">
    <slot />
  </button>
</template>
