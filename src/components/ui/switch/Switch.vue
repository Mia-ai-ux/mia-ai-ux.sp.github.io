<script setup>
defineProps({
  modelValue: Boolean,
  disabled: Boolean,
  id: String,
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <button
    type="button"
    role="switch"
    :id="id"
    class="ui-switch"
    :class="{ 'ui-switch--on': modelValue, 'ui-switch--disabled': disabled }"
    :aria-checked="modelValue"
    :disabled="disabled"
    @click="!disabled && emit('update:modelValue', !modelValue)"
    v-bind="$attrs"
  >
    <span class="ui-switch__knob" />
  </button>
</template>

<style scoped>
.ui-switch {
  flex-shrink: 0;
  width: 26px;
  height: 16px;
  border-radius: 8px;
  background: var(--border-strong, #9ca3af);
  border: none;
  position: relative;
  cursor: pointer;
  transition: background 0.2s;
  padding: 0;
  outline: none;
}

.ui-switch:focus-visible {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}

.ui-switch--on {
  background: var(--primary);
}

.ui-switch--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ui-switch__knob {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.15);
  transition: left 0.2s;
}

.ui-switch--on .ui-switch__knob {
  left: 12px;
}
</style>
