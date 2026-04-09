<template>
  <div class="inline-input" :class="`inline-input--${size}`">
    <span v-if="prefix" class="affix prefix">{{ prefix }}</span>
    <input
      type="number"
      :value="modelValue"
      :step="step"
      :min="min"
      @input="emit('update:modelValue', +$event.target.value)"
    />
    <span v-if="suffix" class="affix suffix">{{ suffix }}</span>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: Number, default: 0 },
  prefix:     { type: String, default: '' },
  suffix:     { type: String, default: '' },
  step:       { type: Number, default: 1 },
  min:        { type: Number, default: 0 },
  size:       { type: String, default: 'default' }, // 'sm' | 'default' | 'lg'
})

const emit = defineEmits(['update:modelValue'])
</script>

<style scoped>
.inline-input {
  display: flex;
  align-items: center;
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 3px;
  background: #fff;
  overflow: hidden;
  box-sizing: border-box;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.inline-input:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59,130,246,.15);
}

/* ── Sizes ── */
.inline-input--sm      { height: 28px; }
.inline-input--default { height: 36px; }
.inline-input--lg      { height: 44px; }

.inline-input input {
  flex: 1;
  min-width: 0;
  height: 100%;
  border: none;
  background: transparent;
  outline: none;
  font-family: inherit;
  color: #111;
}
.inline-input--sm      input { padding: 0 8px;  font-size: 12px; }
.inline-input--default input { padding: 0 10px; font-size: 14px; }
.inline-input--lg      input { padding: 0 14px; font-size: 16px; }

/* Hide number spinners */
.inline-input input::-webkit-outer-spin-button,
.inline-input input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
.inline-input input[type=number] { -moz-appearance: textfield; }

.affix {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  color: #6b7280;
  background: #f9fafb;
  border-left: 1px solid #d1d5db;
  white-space: nowrap;
}
.prefix {
  border-left: none;
  border-right: 1px solid #d1d5db;
}
.inline-input--sm      .affix { padding: 0 8px;  font-size: 12px; }
.inline-input--default .affix { padding: 0 10px; font-size: 14px; }
.inline-input--lg      .affix { padding: 0 14px; font-size: 16px; font-weight: 500; }
</style>
