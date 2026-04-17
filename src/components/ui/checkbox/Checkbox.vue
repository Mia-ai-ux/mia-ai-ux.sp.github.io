<script setup>
import { computed, useId } from 'vue'
import { cn } from '@/lib/utils'
import CheckboxIndicator from './CheckboxIndicator.vue'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  modelValue: Boolean,
  disabled: Boolean,
  class: String,
  id: String,
})

const emit = defineEmits(['update:modelValue'])

const autoId = useId()
const inputId = computed(() => props.id || `ui-checkbox-${autoId}`)
</script>

<template>
  <span
    :class="cn('ui-checkbox-root', props.class)"
    :data-disabled="disabled ? '' : undefined"
  >
    <input
      :id="inputId"
      type="checkbox"
      class="ui-checkbox-input"
      :checked="modelValue"
      :disabled="disabled"
      v-bind="$attrs"
      @change="emit('update:modelValue', $event.target.checked)"
    />
    <span class="ui-checkbox-face" aria-hidden="true">
      <CheckboxIndicator :checked="!!modelValue" :disabled="!!disabled" />
    </span>
  </span>
</template>

<style scoped>
.ui-checkbox-root {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  vertical-align: middle;
}

.ui-checkbox-input {
  position: absolute;
  inset: 0;
  width: 16px;
  height: 16px;
  margin: 0;
  opacity: 0;
  cursor: pointer;
  z-index: 1;
  font-size: inherit;
}

.ui-checkbox-root[data-disabled] .ui-checkbox-input {
  cursor: not-allowed;
}

.ui-checkbox-face {
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ui-checkbox-root:has(.ui-checkbox-input:focus-visible) .ui-checkbox-face {
  outline: 2px solid #1876ff;
  outline-offset: 2px;
  border-radius: 4px;
}
</style>
