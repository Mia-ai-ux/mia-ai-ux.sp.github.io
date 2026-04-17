<template>
  <footer class="bottom-bar">
    <div class="bar-inner">
      <!-- Left: Exit (confirm dialog) -->
      <div class="left-group">
        <UiButton variant="outline" @click="showConfirm = true">Exit</UiButton>
      </div>

      <!-- Right: Back + Next -->
      <div class="right-group">
        <UiButton v-if="showBack" variant="outline" @click="emit('back')">
          {{ backLabel }}
        </UiButton>
        <UiButton variant="default" :disabled="loading" @click="emit('next')">
          <span v-if="loading" class="spinner" />
          {{ nextLabel }}
        </UiButton>
      </div>
    </div>

    <!-- Exit confirmation dialog -->
    <Teleport to="body">
      <div v-if="showConfirm" class="dialog-mask" @click.self="showConfirm = false">
        <div class="dialog-box" role="dialog" aria-modal="true">
          <h3 class="dialog-title">Exit setup?</h3>
          <p class="dialog-body">If you leave now, your campaign draft will be discarded and cannot be recovered.</p>
          <div class="dialog-actions">
            <UiButton variant="outline" @click="showConfirm = false">Continue editing</UiButton>
            <UiButton variant="destructive" @click="onConfirmCancel">Exit</UiButton>
          </div>
        </div>
      </div>
    </Teleport>
  </footer>
</template>

<script setup>
import { ref } from 'vue'
import UiButton from '@/components/ui/button/Button.vue'

defineProps({
  nextLabel: { type: String, default: 'Next' },
  backLabel: { type: String, default: 'Prev' },
  showBack:  { type: Boolean, default: false },
  loading:   { type: Boolean, default: false }
})

const emit = defineEmits(['cancel', 'back', 'next'])

const showConfirm = ref(false)

function onConfirmCancel() {
  showConfirm.value = false
  emit('cancel')
}
</script>

<style scoped>
.bottom-bar {
  position: fixed;
  bottom: 0;
  /* 用 CSS 变量替代硬编码 calc，与布局保持同步 */
  left: calc((100vw - var(--content-width, 80vw)) / 2 + var(--sidebar-width, 220px) + var(--sidebar-gap, 40px));
  right: calc((100vw - var(--content-width, 80vw)) / 2);
  z-index: 50;
  background: var(--bg-card);
  border-top: 1px solid var(--border);
  /* 上方投影提升层次感 */
  box-shadow: var(--shadow-up);
  height: 56px;
}

.bar-inner {
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
}

.left-group,
.right-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.spinner {
  display: inline-block;
  width: 12px;
  height: 12px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  margin-right: 6px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* At ≤1279px the sidebar collapses; go full-width */
@media (max-width: 1279px) {
  .bottom-bar { left: 0; right: 0; }
}

/* Mobile: full width, reduce padding */
@media (max-width: 767px) {
  .bottom-bar { left: 0; right: 0; }
  .bar-inner { padding: 0 16px; }
}

/* Exit confirmation dialog */
.dialog-mask {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: hsl(0 0% 0% / 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog-box {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: 28px 32px;
  width: 400px;
  max-width: 90vw;
}

.dialog-title {
  margin: 0 0 10px;
  font-size: var(--text-xl, 18px);
  font-weight: 600;
  color: var(--text-main);
}

.dialog-body {
  margin: 0 0 24px;
  font-size: var(--text-base, 14px);
  color: var(--text-sub);
  line-height: 1.6;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
