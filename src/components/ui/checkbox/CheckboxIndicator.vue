<script setup>
/**
 * 纯展示：与 ProductPickerSheet · picker-checkbox 一致的方框与勾选。
 * 若父级为 <button> 等不可嵌套 input 的场景，仅用本组件 + 父级处理交互。
 */
defineProps({
  checked: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
})
</script>

<template>
  <span
    class="ui-checkbox-indicator"
    :class="{
      'ui-checkbox-indicator--checked': checked,
      'ui-checkbox-indicator--disabled': disabled,
    }"
    aria-hidden="true"
  >
    <svg
      v-if="checked"
      class="ui-checkbox-indicator__mark"
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
    >
      <path
        d="M1.5 5l2.5 2.5 4.5-5"
        stroke="#fff"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </span>
</template>

<style scoped>
.ui-checkbox-indicator {
  width: 16px;
  height: 16px;
  border-radius: 3px;
  border: 1px solid #dcdcdc;
  background: rgba(255, 255, 255, 0.9);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, border-color 0.15s, opacity 0.15s;
  box-sizing: border-box;
}

.ui-checkbox-indicator--checked {
  background: #1876ff;
  border-color: #1876ff;
}

.ui-checkbox-indicator--disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
</style>
