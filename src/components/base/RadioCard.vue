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
  transform: translateY(0);
  transition:
    border-color 0.22s cubic-bezier(0.4, 0, 0.2, 1),
    background 0.22s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.32s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.32s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
}

.radio-card:hover:not(.selected) {
  border-color: transparent;
  box-shadow: var(--shadow-card-hover);
  transform: translateY(-2px);
}

/* 选中：蓝色边框 + 更浅的蓝底（低饱和、高明度） */
.radio-card.selected {
  background: hsl(217 58% 97.8%);
  border-color: var(--primary);
  box-shadow: none;
}

.radio-card :deep(.option-title) {
  transition: color 0.2s ease;
}

.radio-card.selected :deep(.option-title) {
  color: var(--primary);
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
