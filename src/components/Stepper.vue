<template>
  <aside class="stepper">
    <div
      v-for="(step, si) in steps"
      :key="si"
      class="stepper-item"
    >
      <div class="stepper-row">
        <!-- 左侧轨道：圆点 + 贯通竖线 -->
        <div class="stepper-track">
          <div class="stepper-indicator" :data-state="stepState(step.step)">
            <svg
              v-if="step.step < currentStep"
              class="stepper-check"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2.5 7l3 3 6-6"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span v-else class="stepper-num">{{ step.step }}</span>
          </div>
          <!-- 竖线贯穿到下一个步骤 -->
          <div
            v-if="si < steps.length - 1"
            class="stepper-separator"
            :data-state="stepState(step.step)"
          />
        </div>

        <!-- 右侧内容：标题 + 子项 -->
        <div class="stepper-body">
          <!-- 已完成步骤：可点击跳转 -->
          <button
            v-if="step.step < currentStep"
            class="stepper-title stepper-title--clickable"
            :data-state="stepState(step.step)"
            @click="goToStep(step.path)"
          >
            {{ step.label }}
          </button>
          <div
            v-else
            class="stepper-title"
            :data-state="stepState(step.step)"
          >
            {{ step.label }}
          </div>

          <div
            v-if="step.subItems && (step.step === currentStep || step.step < currentStep)"
            class="stepper-subitems"
          >
            <button
              v-for="(sub, idx) in step.subItems"
              :key="idx"
              class="stepper-sub"
              :class="{ active: sub.label === activeSubItem }"
              @click="scrollTo(sub.anchorId)"
            >
              {{ sub.label }}
            </button>
          </div>

          <div v-if="si < steps.length - 1" class="stepper-gap" />
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  steps: { type: Array, required: true },
  currentStep: { type: Number, default: 1 },
  activeSubItem: { type: String, default: '' }
})

const router = useRouter()

function stepState(s) {
  if (s < props.currentStep) return 'completed'
  if (s === props.currentStep) return 'active'
  return 'inactive'
}

function scrollTo(anchorId) {
  const el = document.getElementById(anchorId)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function goToStep(path) {
  if (path) router.push(path)
}
</script>

<style scoped>
.stepper {
  position: sticky;
  top: var(--nav-height, 60px);
  width: var(--sidebar-width, 220px);
  flex-shrink: 0;
  background: transparent;
  padding: 24px 8px 24px 4px;
  height: calc(100vh - var(--nav-height, 60px));
  overflow-y: auto;
  align-self: flex-start;
  display: flex;
  flex-direction: column;
}

.stepper-item {
  display: flex;
}

.stepper-row {
  display: flex;
  align-items: flex-start;
  width: 100%;
  gap: 10px;
}

/* ── 左侧轨道 ── */
.stepper-track {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  width: 28px;
  align-self: stretch;
}

/* ── 圆点（28px，比原先 32px 稍小） ── */
.stepper-indicator {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gray-200, #e5e7eb);
  color: var(--text-main, #111827);
  transition: background 0.2s, color 0.2s;
}

.stepper-num {
  font-size: var(--text-sm, 13px);
  font-weight: 600;
  line-height: 1;
}

/* 未完成：灰底 + 深色数字 */
.stepper-indicator[data-state='inactive'] {
  background: var(--gray-200, #e5e7eb);
  color: var(--text-main, #111827);
}

/* 当前：蓝底 + 白字 */
.stepper-indicator[data-state='active'] {
  background: var(--primary);
  color: #fff;
}

/* 已完成：灰底 + 深色对勾 */
.stepper-indicator[data-state='completed'] {
  background: var(--gray-200, #e5e7eb);
  color: var(--gray-700, #374151);
}

.stepper-check {
  display: block;
  flex-shrink: 0;
}

/* ── 竖线 ── */
.stepper-separator {
  flex: 1;
  width: 2px;
  background: var(--border, #e5e7eb);
  border-radius: 1px;
  margin: 5px 0 0;
  min-height: 12px;
  transition: background 0.3s;
}

/* ── 右侧内容 ── */
.stepper-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

/* 字号从 20px 下调至 14px，在 220px 侧边栏中更克制 */
.stepper-title {
  font-size: var(--text-base, 14px);
  font-weight: 500;
  color: var(--gray-400, #94a3b8);
  display: block;
  height: 28px;
  line-height: 28px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.2s, font-weight 0.2s;
  background: none;
  border: none;
  padding: 0;
  text-align: left;
  width: 100%;
  max-width: 100%;
}

.stepper-title--clickable {
  cursor: pointer;
  border-radius: var(--radius-sm, 4px);
}

.stepper-title--clickable:hover {
  color: var(--primary, #1876ff);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.stepper-title[data-state='active'] {
  color: #0f172a;
  font-weight: 600;
}

.stepper-title[data-state='completed'] {
  color: var(--gray-600, #334155);
  font-weight: 500;
}

/* ── 子项：字号从 16px 下调至 13px ── */
.stepper-subitems {
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding-bottom: 4px;
}

.stepper-sub {
  display: block;
  width: 100%;
  text-align: left;
  padding: 5px 8px;
  border-radius: var(--radius-sm, 4px);
  font-size: var(--text-sm, 13px);
  font-weight: 400;
  color: var(--gray-500, #64748b);
  background: none;
  border: none;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.stepper-sub:hover {
  background: var(--gray-100, #f1f5f9);
  color: #0f172a;
}

.stepper-sub.active {
  color: var(--primary, #1876ff);
  font-weight: 600;
  background: none;
}

.stepper-gap {
  min-height: 16px;
  flex: 1;
}
</style>
