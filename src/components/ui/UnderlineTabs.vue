<script setup>
/**
 * 下划线 + 主色指示条 Tab 条。
 * size: sm 紧凑 | md 默认 | lg 加大
 */
defineProps({
  modelValue: { type: String, required: true },
  items: {
    type: Array,
    required: true,
    // { id: string, label: string }[]
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v),
  },
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <div class="underline-tabs" :class="`underline-tabs--${size}`">
    <div class="underline-tabs__list" role="tablist">
      <button
        v-for="item in items"
        :key="item.id"
        type="button"
        role="tab"
        class="underline-tabs__trigger"
        :class="{ 'underline-tabs__trigger--active': modelValue === item.id }"
        :aria-selected="modelValue === item.id"
        @click="emit('update:modelValue', item.id)"
      >
        {{ item.label }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.underline-tabs__list {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  min-width: 0;
}

.underline-tabs__trigger {
  position: relative;
  margin: 0;
  background: none;
  border: none;
  font-family: inherit;
  font-weight: 500;
  color: var(--text-sub);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  transition: color 0.15s ease, border-color 0.15s ease, border-width 0.15s ease;
}

.underline-tabs__trigger:hover {
  color: var(--text-main);
}

.underline-tabs__trigger--active {
  color: var(--primary);
  font-weight: 600;
  border-bottom-color: var(--primary);
}

.underline-tabs__trigger:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
  border-radius: 2px;
}

/* ── sm ── */
.underline-tabs--sm .underline-tabs__list {
  gap: 4px 16px;
}

.underline-tabs--sm .underline-tabs__trigger {
  padding: 8px 2px 8px;
  font-size: var(--text-xs, 12px);
}

/* ── md（默认视觉，与原 Keyword 页一致）── */
.underline-tabs--md .underline-tabs__list {
  gap: 4px 28px;
}

.underline-tabs--md .underline-tabs__trigger {
  padding: 14px 2px 12px;
  font-size: var(--text-base, 14px);
}

/* ── lg ── */
.underline-tabs--lg .underline-tabs__list {
  gap: 4px 36px;
}

.underline-tabs--lg .underline-tabs__trigger {
  padding: 18px 4px 14px;
  font-size: var(--text-lg, 16px);
  border-bottom-width: 3px;
  margin-bottom: -2px;
}
</style>
