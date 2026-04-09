<script setup>
import { provide, computed } from 'vue'

const props = defineProps({
  open: Boolean,
})

const emit = defineEmits(['update:open'])

provide('dialog', {
  open: computed(() => props.open),
  close: () => emit('update:open', false),
})
</script>

<template>
  <slot />
</template>
