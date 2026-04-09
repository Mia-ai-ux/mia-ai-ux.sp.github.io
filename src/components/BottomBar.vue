<template>
  <footer class="bottom-bar">
    <div class="bar-inner">
      <!-- 左：退出（点击弹二次确认） -->
      <div class="left-group">
        <UiButton variant="outline" @click="showConfirm = true">退出</UiButton>
      </div>

      <!-- 右：上一步 + 下一步 -->
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

    <!-- 退出二次确认 Dialog -->
    <Teleport to="body">
      <div v-if="showConfirm" class="dialog-mask" @click.self="showConfirm = false">
        <div class="dialog-box" role="dialog" aria-modal="true">
          <h3 class="dialog-title">确认退出？</h3>
          <p class="dialog-body">退出后当前广告活动的所有配置将会丢失，无法恢复。</p>
          <div class="dialog-actions">
            <UiButton variant="outline" @click="showConfirm = false">继续编辑</UiButton>
            <UiButton variant="destructive" @click="onConfirmCancel">确认退出</UiButton>
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
  nextLabel: { type: String, default: '下一步' },
  backLabel: { type: String, default: '上一步' },
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
  left: calc((100vw - var(--content-width, 70vw)) / 2 + var(--sidebar-width, 220px) + var(--sidebar-gap, 40px));
  right: calc((100vw - var(--content-width, 70vw)) / 2);
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

@media (max-width: 1100px) {
  .bottom-bar { left: 0; right: 0; }
}

/* ── 退出确认弹窗 ── */
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
