<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: String, // 'YYYY-MM-DD'
  placeholder: { type: String, default: 'Select date' },
  disabled: Boolean,
  min: String,
  max: String,
  size: { type: String, default: 'default' }, // 'sm' | 'default' | 'lg'
})

const emit = defineEmits(['update:modelValue'])

const open = ref(false)
function togglePanel() { if (!props.disabled) open.value = !open.value }
function close() { open.value = false }

const today = new Date()
const viewYear = ref(today.getFullYear())
const viewMonth = ref(today.getMonth())

const MONTH_NAMES = ['January','February','March','April','May','June',
  'July','August','September','October','November','December']
const WEEK_NAMES  = ['Su','Mo','Tu','We','Th','Fr','Sa']

const panelTitle = computed(() => `${MONTH_NAMES[viewMonth.value]} ${viewYear.value}`)

function prevMonth() {
  if (viewMonth.value === 0) { viewMonth.value = 11; viewYear.value-- }
  else viewMonth.value--
}
function nextMonth() {
  if (viewMonth.value === 11) { viewMonth.value = 0; viewYear.value++ }
  else viewMonth.value++
}

const calendarDays = computed(() => {
  const firstDay = new Date(viewYear.value, viewMonth.value, 1).getDay()
  const daysInMonth = new Date(viewYear.value, viewMonth.value + 1, 0).getDate()
  const daysInPrev  = new Date(viewYear.value, viewMonth.value, 0).getDate()
  const cells = []
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ day: daysInPrev - i, currentMonth: false, dateStr: offsetDateStr(-1, daysInPrev - i) })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, currentMonth: true, dateStr: toDateStr(viewYear.value, viewMonth.value, d) })
  }
  const rest = 42 - cells.length
  for (let d = 1; d <= rest; d++) {
    cells.push({ day: d, currentMonth: false, dateStr: offsetDateStr(1, d) })
  }
  return cells
})

function toDateStr(y, m, d) {
  return `${y}-${String(m + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
}
function offsetDateStr(monthOffset, day) {
  const m = viewMonth.value + monthOffset
  const y = viewYear.value + Math.floor(m / 12)
  const realM = ((m % 12) + 12) % 12
  return toDateStr(y, realM, day)
}

const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate())

function isSelected(dateStr) { return dateStr === props.modelValue }
function isToday(dateStr)    { return dateStr === todayStr }
function isDisabled(dateStr) {
  if (props.min && dateStr < props.min) return true
  if (props.max && dateStr > props.max) return true
  return false
}

function selectDate(cell) {
  if (isDisabled(cell.dateStr)) return
  emit('update:modelValue', cell.dateStr)
  close()
}

// Display: "Apr 8, 2026"
const displayValue = computed(() => {
  const v = props.modelValue
  if (!v) return ''
  const datePart = v.includes('T') ? v.split('T')[0] : v
  const [y, m, d] = datePart.split('-')
  if (!y || !m || !d) return v
  return `${MONTH_NAMES[Number(m) - 1]} ${Number(d)}, ${y}`
})

function clear(e) {
  e.stopPropagation()
  emit('update:modelValue', '')
}
function goToday() {
  selectDate({ dateStr: todayStr, currentMonth: true, day: today.getDate() })
}
</script>

<template>
  <div class="dp-wrap">
    <!-- Trigger -->
    <button
      type="button"
      class="dp-trigger"
      :class="[
        `dp-size-${size}`,
        { 'dp-placeholder': !modelValue, 'dp-disabled': disabled }
      ]"
      :disabled="disabled"
      @click="togglePanel"
    >
      <span class="dp-trigger-left">
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="dp-cal-icon">
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
          <line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/>
          <line x1="3" x2="21" y1="10" y2="10"/>
        </svg>
        <span>{{ displayValue || placeholder }}</span>
      </span>
      <button
        v-if="modelValue"
        type="button"
        class="dp-clear"
        @click="clear"
        aria-label="Clear"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </button>
    </button>

    <!-- Backdrop -->
    <div v-if="open" class="dp-backdrop" @click="close" />

    <!-- Panel -->
    <Transition name="dp-fade">
      <div v-if="open" class="dp-panel">
        <!-- Header -->
        <div class="dp-header">
          <button type="button" class="dp-nav-btn" @click="prevMonth">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <span class="dp-month-label">{{ panelTitle }}</span>
          <button type="button" class="dp-nav-btn" @click="nextMonth">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>

        <!-- Week names -->
        <div class="dp-grid dp-weeknames">
          <div v-for="w in WEEK_NAMES" :key="w" class="dp-cell dp-weekname">{{ w }}</div>
        </div>

        <!-- Day grid -->
        <div class="dp-grid dp-days">
          <button
            v-for="cell in calendarDays"
            :key="cell.dateStr"
            type="button"
            class="dp-cell dp-day"
            :class="{
              'dp-other-month': !cell.currentMonth,
              'dp-selected': isSelected(cell.dateStr),
              'dp-today': isToday(cell.dateStr) && !isSelected(cell.dateStr),
              'dp-day-disabled': isDisabled(cell.dateStr),
            }"
            :disabled="isDisabled(cell.dateStr)"
            @click="selectDate(cell)"
          >
            {{ cell.day }}
          </button>
        </div>

        <!-- Footer -->
        <div class="dp-footer">
          <button type="button" class="dp-footer-btn" @click="emit('update:modelValue', ''); close()">Clear</button>
          <button type="button" class="dp-footer-btn dp-today-btn" @click="goToday">Today</button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.dp-wrap {
  position: relative;
  display: inline-block;
  width: 100%;
}

/* ── Trigger button ── */
.dp-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #fff;
  color: #111;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s;
  box-sizing: border-box;
}

/* ── Size variants ── */
.dp-size-sm   { height: 28px; font-size: 12px; padding: 0 8px; border-radius: 4px; }
.dp-size-default { height: 36px; font-size: 14px; }
.dp-size-lg   { height: 44px; font-size: 16px; padding: 0 14px; border-radius: 3px; }
.dp-trigger:hover {
  border-color: #9ca3af;
}
.dp-trigger:focus-visible {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59,130,246,.18);
}
.dp-trigger.dp-placeholder {
  color: #9ca3af;
}
.dp-trigger.dp-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.dp-trigger-left {
  display: flex;
  align-items: center;
  gap: 7px;
}
.dp-cal-icon {
  color: #6b7280;
  flex-shrink: 0;
}

.dp-clear {
  display: flex;
  align-items: center;
  padding: 2px;
  border: none;
  background: none;
  color: #9ca3af;
  cursor: pointer;
  border-radius: 4px;
}
.dp-clear:hover { color: #374151; }

/* ── Backdrop ── */
.dp-backdrop {
  position: fixed;
  inset: 0;
  z-index: 40;
}

/* ── Panel ── */
.dp-panel {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  z-index: 50;
  width: 280px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,.12);
  padding: 12px;
  box-sizing: border-box;
}

/* ── Header ── */
.dp-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
.dp-nav-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  background: none;
  border-radius: 5px;
  cursor: pointer;
  color: #374151;
}
.dp-nav-btn:hover { background: #f3f4f6; }
.dp-month-label {
  font-size: 14px;
  font-weight: 600;
  color: #111;
}

/* ── Grid ── */
.dp-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}
.dp-weeknames {
  margin-bottom: 2px;
}
.dp-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
}
.dp-weekname {
  font-size: 12px;
  color: #9ca3af;
  font-weight: 500;
}
.dp-day {
  font-size: 13px;
  color: #111;
  border: none;
  background: none;
  border-radius: 5px;
  cursor: pointer;
  width: 32px;
  margin: 0 auto;
  transition: background 0.1s, color 0.1s;
}
.dp-day:hover:not(.dp-selected):not(.dp-day-disabled) {
  background: #f3f4f6;
}
.dp-other-month {
  color: #d1d5db;
}
.dp-selected {
  background: #1d4ed8 !important;
  color: #fff !important;
  font-weight: 600;
}
.dp-today {
  border: 1.5px solid #1d4ed8;
  color: #1d4ed8;
  font-weight: 600;
}
.dp-day-disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* ── Footer ── */
.dp-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px solid #f3f4f6;
}
.dp-footer-btn {
  font-size: 13px;
  color: #6b7280;
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 4px;
}
.dp-footer-btn:hover { color: #111; background: #f3f4f6; }
.dp-today-btn { color: #1d4ed8; }
.dp-today-btn:hover { color: #1d4ed8; background: #eff6ff; }

/* ── Transition ── */
.dp-fade-enter-active { transition: opacity 0.12s ease, transform 0.12s ease; }
.dp-fade-leave-active { transition: opacity 0.08s ease, transform 0.08s ease; }
.dp-fade-enter-from  { opacity: 0; transform: translateY(-4px) scale(0.97); }
.dp-fade-leave-to    { opacity: 0; transform: translateY(-4px) scale(0.97); }
</style>
