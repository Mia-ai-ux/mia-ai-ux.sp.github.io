<template>
  <label
    class="radio-card"
    :class="{ selected, flat: variant === 'flat' }"
    @click="emit('update:modelValue', value)"
  >
    <span class="radio-dot" :class="{ checked: selected }">
      <span v-if="selected" class="radio-dot-inner"></span>
    </span>
    <div class="radio-body">
      <slot />
    </div>
  </label>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  value: { type: String, required: true },
  variant: { type: String, default: 'default' }
})

const emit = defineEmits(['update:modelValue'])

const selected = computed(() => props.modelValue === props.value)
</script>

<style scoped>
.radio-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  /* 未选中用白底 + 灰色边框，与页面背景形成明显区分 */
  background: var(--bg-card);
  border-radius: var(--radius-md, 6px);
  padding: 16px;
  border: 1.5px solid var(--border);
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;
  width: 100%;
}

.radio-card:hover:not(.selected) {
  border-color: var(--border-strong);
  box-shadow: var(--shadow-sm);
}

/* 选中：蓝色边框 + 极淡蓝色背景，区分度明显 */
.radio-card.selected {
  background: var(--primary-light, hsl(217, 100%, 97%));
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-border, hsl(217, 100%, 85%)) / 0.3;
}

.radio-dot {
  margin-top: 2px;
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1.5px solid var(--border-strong);
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.15s, background 0.15s;
}

.radio-dot.checked {
  background: var(--primary);
  border-color: var(--primary);
}

.radio-dot-inner {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #fff;
}

.radio-body {
  flex: 1;
  min-width: 0;
}
</style>
