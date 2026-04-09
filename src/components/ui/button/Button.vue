<script setup>
defineProps({
  variant: {
    type: String,
    default: 'default',
    // 'default' | 'outline' | 'ghost' | 'link' | 'destructive'
  },
  size: {
    type: String,
    default: 'default',
    // 'sm' | 'default' | 'lg'
  },
  disabled: Boolean,
})
</script>

<template>
  <button
    class="ui-btn"
    :class="[`ui-btn--${variant}`, `ui-btn--size-${size}`]"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>

<style scoped>
/* ── Base ── */
.ui-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: 1px solid transparent;
  border-radius: 3px;
  font-family: inherit;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s, color 0.15s, border-color 0.15s, opacity 0.15s;
  outline: none;
}
.ui-btn:focus-visible {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, .25);
}
.ui-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

/* ── Sizes ── */
.ui-btn--size-sm      { height: 28px; padding: 0 10px; font-size: 13px; }
.ui-btn--size-default { height: 36px; padding: 0 16px; font-size: 14px; }
.ui-btn--size-lg      { height: 44px; padding: 0 22px; font-size: 16px; }

/* ── Variants ── */

/* default – filled primary */
.ui-btn--default {
  background: var(--primary, #1d4ed8);
  color: #fff;
  border-color: var(--primary, #1d4ed8);
}
.ui-btn--default:hover:not(:disabled) {
  background: var(--primary-hover, #1a44c1);
  border-color: var(--primary-hover, #1a44c1);
}

/* outline – border only */
.ui-btn--outline {
  background: transparent;
  color: #374151;
  border-color: #d1d5db;
}
.ui-btn--outline:hover:not(:disabled) {
  background: #f3f4f6;
  border-color: #9ca3af;
}

/* ghost – no border, no bg */
.ui-btn--ghost {
  background: transparent;
  color: #374151;
  border-color: transparent;
}
.ui-btn--ghost:hover:not(:disabled) {
  background: #f3f4f6;
}

/* link – text only with underline on hover */
.ui-btn--link {
  background: transparent;
  color: var(--primary, #1d4ed8);
  border-color: transparent;
  padding-left: 2px;
  padding-right: 2px;
}
.ui-btn--link:hover:not(:disabled) {
  text-decoration: underline;
}

/* destructive */
.ui-btn--destructive {
  background: #dc2626;
  color: #fff;
  border-color: #dc2626;
}
.ui-btn--destructive:hover:not(:disabled) {
  background: #b91c1c;
  border-color: #b91c1c;
}
</style>
