<script setup>
defineProps({
  type:        { type: String, default: 'text' },
  placeholder: String,
  disabled:    Boolean,
  modelValue:  [String, Number],
  size:        { type: String, default: 'default' }, // 'sm' | 'default' | 'lg'
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <input
    class="ui-input"
    :class="`ui-input--${size}`"
    :type="type"
    :placeholder="placeholder"
    :disabled="disabled"
    :value="modelValue"
    @input="emit('update:modelValue', $event.target.value)"
    v-bind="$attrs"
  />
</template>

<style scoped>
.ui-input {
  display: flex;
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 3px;
  background: #fff;
  color: #111;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  box-sizing: border-box;
  font-family: inherit;
}
.ui-input::placeholder { color: #9ca3af; }
.ui-input:hover        { border-color: #9ca3af; }
.ui-input:focus        { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,.15); }
.ui-input:disabled     { opacity: 0.5; cursor: not-allowed; background: #f9fafb; }

/* ── Sizes ── */
.ui-input--sm      { height: 28px; padding: 0 8px;  font-size: 12px; }
.ui-input--default { height: 36px; padding: 0 10px; font-size: 14px; }
.ui-input--lg      { height: 44px; padding: 0 14px; font-size: 16px; }
</style>
