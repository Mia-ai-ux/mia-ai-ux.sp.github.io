<template>
  <section id="section-sb-settings" class="card">
    <h2>Settings</h2>

    <!-- Campaign Name -->
    <div id="field-campaign-name" class="field" :class="{ 'has-error': errors.campaignName }">
      <label for="campaignName">
        Campaign Name <span class="required">*</span>
      </label>
      <div class="input-wrap">
        <UiCombobox
          id="campaignName"
          v-model="form.campaignName"
          size="lg"
          placeholder="Enter campaign name"
          :options="campaignNamePresets"
          @update:model-value="errors.campaignName = ''"
        />
      </div>
      <p v-if="errors.campaignName" class="error-msg">{{ errors.campaignName }}</p>
    </div>

    <!-- Schedule -->
    <div id="field-schedule" class="field" :class="{ 'has-error': errors.dateRange }">
      <label>Schedule</label>

      <label class="radio-line" @click="form.scheduleType = 'continuous'">
        <span class="radio-dot" :class="{ checked: form.scheduleType === 'continuous' }">
          <span v-if="form.scheduleType === 'continuous'" class="radio-dot-inner"></span>
        </span>
        <span>Set start time and run ad group continuously</span>
      </label>

      <div v-if="form.scheduleType === 'continuous'" class="date-row">
        <DatePicker v-model="form.startTime" :min="todayStr" placeholder="Select start date" size="lg" class="date-picker-field" />
      </div>

      <label class="radio-line schedule-gap" @click="form.scheduleType = 'range'">
        <span class="radio-dot" :class="{ checked: form.scheduleType === 'range' }">
          <span v-if="form.scheduleType === 'range'" class="radio-dot-inner"></span>
        </span>
        <span>Set start and end time</span>
      </label>

      <div v-if="form.scheduleType === 'range'" class="range-inputs">
        <DatePicker
          v-model="form.startTime"
          :min="todayStr"
          placeholder="Select start date"
          size="lg"
          class="date-picker-field"
        />
        <span class="range-sep">→</span>
        <DatePicker
          v-model="form.endTime"
          :min="form.startTime || todayStr"
          placeholder="Select end date"
          size="lg"
          class="date-picker-field"
        />
      </div>
      <p v-if="errors.dateRange" class="error-msg">{{ errors.dateRange }}</p>
    </div>

    <!-- Budget -->
    <div id="field-budget" class="field" :class="{ 'has-error': errors.budget }">
      <label>Budget</label>

      <!-- Daily budget radio -->
      <label class="radio-line" @click="onBudgetTypeChange('daily')">
        <span class="radio-dot" :class="{ checked: form.budgetType === 'daily' }">
          <span v-if="form.budgetType === 'daily'" class="radio-dot-inner"></span>
        </span>
        <span class="budget-label">
          Daily budget
          <div class="tooltip-wrap">
            <img :src="iconHelpCircle" alt="" width="14" height="14" class="help-icon-trigger" />
            <div class="tooltip-bubble">
              The amount you're willing to spend on this campaign each day. Unspent amounts can carry
              over to other days in the same calendar month.
            </div>
          </div>
        </span>
      </label>
      <div v-if="form.budgetType === 'daily'" class="budget-input-indent">
        <InlineNumberInput
          v-model="form.dailyBudget"
          :step="0.01"
          suffix="USD"
          size="lg"
          @change="errors.budget = ''"
          @update:modelValue="errors.budget = ''"
        />
      </div>

      <!-- Lifetime budget radio — only visible when schedule has an end date -->
      <template v-if="form.scheduleType === 'range'">
        <label class="radio-line budget-gap" @click="onBudgetTypeChange('lifetime')">
          <span class="radio-dot" :class="{ checked: form.budgetType === 'lifetime' }">
            <span v-if="form.budgetType === 'lifetime'" class="radio-dot-inner"></span>
          </span>
          <span class="budget-label">
            Lifetime budget
            <div class="tooltip-wrap">
              <img :src="iconHelpCircle" alt="" width="14" height="14" class="help-icon-trigger" />
              <div class="tooltip-bubble">
                The total amount you're willing to spend for the entire duration of this campaign.
                Amazon will evenly distribute spending across your campaign dates.
              </div>
            </div>
          </span>
        </label>
        <div v-if="form.budgetType === 'lifetime'" class="budget-input-indent">
          <InlineNumberInput
            v-model="form.lifetimeBudget"
            :step="0.01"
            suffix="USD"
            size="lg"
            @change="errors.budget = ''"
            @update:modelValue="errors.budget = ''"
          />
        </div>
      </template>

      <p v-if="errors.budget" class="error-msg">{{ errors.budget }}</p>
    </div>

    <!-- Advanced Settings -->
    <UiButton variant="ghost" size="sm" type="button" @click="advancedOpen = !advancedOpen">
      Advanced settings
      <svg
        width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
        :style="{ transform: advancedOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </UiButton>

    <Transition name="slide">
      <div v-if="advancedOpen" class="advanced">
        <div class="field">
          <div class="label-row">
            <label for="portfolio">Portfolio</label>
            <div class="tooltip-wrap">
              <img :src="iconHelpCircle" alt="" width="16" height="16" class="help-icon-trigger" />
              <div class="tooltip-bubble">
                Portfolios are a group of campaigns that you can organize to meet your advertising needs.
              </div>
            </div>
          </div>
          <div class="input-wrap">
            <UiSelect
              id="portfolio"
              v-model="form.portfolio"
              size="lg"
              placeholder="Choose a portfolio"
              searchable
              search-placeholder="Search portfolios"
              :options="portfolioOptions"
            />
          </div>
        </div>
      </div>
    </Transition>
  </section>
</template>

<script setup>
import { ref, reactive, computed, watch, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useSbStore } from '@/stores/sb'
import InlineNumberInput from '@/components/base/InlineNumberInput.vue'
import UiSelect from '@/components/ui/select/Select.vue'
import UiCombobox from '@/components/ui/combobox/Combobox.vue'
import UiButton from '@/components/ui/button/Button.vue'
import iconHelpCircle from '@/assets/icon-help-circle.svg'
import DatePicker from '@/components/ui/date-picker/DatePicker.vue'

const store = useSbStore()
const { form } = storeToRefs(store)
const advancedOpen = ref(false)

const campaignNamePresets = [
  'DREO+Tower Fan+SB+KT+Main Keywords+Exact',
  'DREO+Space Heater+SB+KT+Brand Defense+Phrase',
  'DREO+Air Purifier+SB+PT+Competitor ASIN',
]

const _today = new Date()
const todayStr = `${_today.getFullYear()}-${String(_today.getMonth() + 1).padStart(2, '0')}-${String(_today.getDate()).padStart(2, '0')}`

const portfolioOptions = [
  { value: 'none', label: 'No Portfolio' },
  { value: 'hhm004s-black-2000', label: 'HHM004S Balck-2000' },
  { value: 'dr-htf005-2000', label: 'DR-HTF005-2000' },
  { value: 'dr-hac001-2000', label: 'DR-HAC001-2000' },
  { value: 'dr-hap002-1500', label: 'DR-HAP002-1500' },
  { value: 'dr-hec001-hec002s-300', label: 'DR-HEC001/DR-HEC002S-300' },
]

const errors = reactive({
  campaignName: '',
  budget: '',
  dateRange: ''
})

watch(
  () => [form.value.startTime, form.value.endTime, form.value.scheduleType],
  ([start, end, type]) => {
    if (!errors.dateRange) return
    if (!start) return
    if (type === 'range' && !end) return
    if (type === 'range' && new Date(end) <= new Date(start)) return
    errors.dateRange = ''
  }
)

// When switching back to continuous, reset budgetType to daily
watch(
  () => form.value.scheduleType,
  (type) => {
    if (type === 'continuous') {
      form.value.budgetType = 'daily'
    }
  }
)

function onBudgetTypeChange(type) {
  form.value.budgetType = type
  errors.budget = ''
}

function validate() {
  const errorItems = []

  if (!form.value.campaignName?.trim()) {
    errors.campaignName = 'Campaign name is required.'
    errorItems.push({ subItem: 'Settings', label: 'Campaign Name', anchorId: 'field-campaign-name' })
  } else {
    errors.campaignName = ''
  }

  const budgetVal = form.value.budgetType === 'lifetime'
    ? form.value.lifetimeBudget
    : form.value.dailyBudget
  if (!budgetVal || Number(budgetVal) <= 0) {
    errors.budget = `Please enter a ${form.value.budgetType === 'lifetime' ? 'lifetime' : 'daily'} budget greater than 0.`
    errorItems.push({ subItem: 'Settings', label: 'Budget', anchorId: 'field-budget' })
  } else {
    errors.budget = ''
  }

  if (!form.value.startTime) {
    errors.dateRange = 'Please select a start date.'
    errorItems.push({ subItem: 'Settings', label: 'Schedule', anchorId: 'field-schedule' })
  } else if (form.value.scheduleType === 'range') {
    if (!form.value.endTime) {
      errors.dateRange = 'Please select an end date.'
      errorItems.push({ subItem: 'Settings', label: 'Schedule', anchorId: 'field-schedule' })
    } else if (new Date(form.value.endTime) <= new Date(form.value.startTime)) {
      errors.dateRange = 'End date must be after start date.'
      errorItems.push({ subItem: 'Settings', label: 'Schedule', anchorId: 'field-schedule' })
    } else {
      errors.dateRange = ''
    }
  } else {
    errors.dateRange = ''
  }

  const ok = errorItems.length === 0

  if (!ok) {
    nextTick(() => {
      const el = document.getElementById(errorItems[0].anchorId)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
  }

  return { ok, errorItems }
}

defineExpose({ validate })
</script>

<style scoped>
.card {
  background: var(--bg-card);
  border-radius: var(--radius-card);
  padding: 28px 32px;
}

h2 {
  margin: 0 0 24px;
  font-size: var(--text-2xl, 22px);
  font-weight: 600;
  color: var(--text-main);
}

.required {
  color: var(--color-danger);
  font-size: var(--text-sm, 13px);
}

.field {
  margin-bottom: 24px;
}

.field > label:not(.radio-line) {
  display: block;
  font-size: var(--text-base, 14px);
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text-main);
}

.label-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
  font-size: var(--text-base, 14px);
  font-weight: 600;
  color: var(--text-main);
}

.input-wrap,
.budget-input-wrap {
  max-width: 400px;
  width: 100%;
}

#field-campaign-name .input-wrap {
  max-width: none;
}

.has-error :deep(.ui-combobox__input),
.has-error :deep(.inline-number-input) {
  border-color: var(--color-danger) !important;
}

.error-msg {
  margin: 6px 0 0;
  font-size: var(--text-sm, 13px);
  color: var(--color-danger);
  line-height: 1.4;
}

.help-icon-trigger {
  cursor: pointer;
  flex-shrink: 0;
}

.tooltip-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.tooltip-bubble {
  display: none;
  position: absolute;
  left: 24px;
  top: 50%;
  transform: translateY(-50%);
  background: #1c1f23;
  color: #fff;
  font-size: var(--text-sm, 13px);
  font-weight: 400;
  line-height: 1.6;
  padding: 10px 14px;
  border-radius: var(--radius-md, 6px);
  width: 280px;
  z-index: 999;
  box-shadow: var(--shadow-md);
  pointer-events: none;
}

.tooltip-bubble::before {
  content: '';
  position: absolute;
  left: -6px;
  top: 50%;
  transform: translateY(-50%);
  border-width: 6px 6px 6px 0;
  border-style: solid;
  border-color: transparent #1c1f23 transparent transparent;
}

.tooltip-wrap:hover .tooltip-bubble {
  display: block;
}

.radio-line {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  font-size: var(--text-base, 14px);
  font-weight: 500;
  cursor: pointer;
  color: var(--text-main);
}

.radio-dot {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1.5px solid var(--border-strong);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, border-color 0.15s;
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

.schedule-gap {
  margin-top: 10px;
}

.budget-gap {
  margin-top: 10px;
}

.budget-label {
  display: flex;
  align-items: center;
  gap: 5px;
}

.budget-input-indent {
  margin-left: 24px;
  margin-bottom: 4px;
  max-width: 400px;
}

.date-row {
  margin-left: 24px;
  margin-bottom: 4px;
  max-width: 400px;
}

.range-inputs {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: 24px;
  margin-top: 8px;
}

.date-picker-field {
  flex: 1;
  max-width: 400px;
}

.range-sep {
  font-size: var(--text-base, 14px);
  color: var(--text-hint);
  flex-shrink: 0;
}

.advanced {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px dashed var(--border);
}

.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
