<script setup>
import { provide, computed } from 'vue'

const props = defineProps({
  modelValue: String,
  class: String,
})

const emit = defineEmits(['update:modelValue'])

provide('tabs', {
  activeTab: computed(() => props.modelValue),
  setTab: (val) => emit('update:modelValue', val),
})
</script>

<template>
  <div :class="props.class">
    <slot />
  </div>
</template>
