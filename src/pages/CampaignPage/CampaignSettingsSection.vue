<template>
  <section id="section-campaign-settings" class="card">
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
          placeholder="ASIN+Model+Ucie+自定义"
          :options="campaignNamePresets"
          @update:model-value="errors.campaignName = ''"
        />
      </div>
      <p v-if="errors.campaignName" class="error-msg">{{ errors.campaignName }}</p>
    </div>

    <!-- Daily Budget -->
    <div id="field-daily-budget" class="field" :class="{ 'has-error': errors.dailyBudget }">
      <div class="label-row">
        <label>Daily budget <span class="required">*</span></label>
        <div class="tooltip-wrap">
          <img :src="iconHelpCircle" alt="" width="16" height="16" class="help-icon-trigger" />
          <div class="tooltip-bubble">
            The amount that you're willing to spend on this campaign each day. If the campaign spends
            less than your daily budget, the unspent amount can be used to increase your daily budget
            on the other days of the calendar month.
          </div>
        </div>
      </div>
      <div class="budget-input-wrap">
        <InlineNumberInput
          v-model="form.dailyBudget"
          :step="0.01"
          suffix="USD"
          size="lg"
          @change="errors.dailyBudget = ''"
          @update:modelValue="errors.dailyBudget = ''"
        />
      </div>
      <p v-if="errors.dailyBudget" class="error-msg">{{ errors.dailyBudget }}</p>
    </div>

    <!-- Schedule -->
    <div id="field-schedule" class="field" :class="{ 'has-error': errors.dateRange }">
      <label>Schedule <span class="required">*</span></label>

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
import { ref, reactive, watch, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useCampaignStore } from '@/stores/campaign'
import InlineNumberInput from '@/components/base/InlineNumberInput.vue'
import UiSelect from '@/components/ui/select/Select.vue'
import UiCombobox from '@/components/ui/combobox/Combobox.vue'
import UiButton from '@/components/ui/button/Button.vue'
import iconHelpCircle from '@/assets/icon-help-circle.svg'
import DatePicker from '@/components/ui/date-picker/DatePicker.vue'

const { form } = storeToRefs(useCampaignStore())
const advancedOpen = ref(false)

/** Campaign name 下拉：已有命名示例（后续可接 API 替换） */
const campaignNamePresets = [
  'B0BT7LPSBY+DR-HTF007 White+Ucie+SPM+KT+Phrase',
  'B09MKPDJRT+DR-HTF007+Ucie+SBV+KT+Main keywords+Phrase',
  'B0BT7LPSBY+DR-HTF007 White+Ucie+SPM+KT+fan/tower fan+exact',
  'B0FXGK76DF+DR-HHM006+Ucie+SPM+KT+Main Keywords+Exact',
  'B09MKPDJRT/B08PDDSDHY/B0BTY58CS4+DR-HTF007+Ucie+SB+KT+Main keywords+Exact+St',
  'B0BT7LPSBY+DR-HTF007 White+Ucie+SPM+KT+Main keywords',
  'B09MKPDJRT/B09M8PMW26/B08P5NNNL5+DR-HTF007+Ucie+SB+KT+Main keywords+Phrase+',
  'B0DZ6VRPT7+DR-HTF017 Black+Ucie+SPM+KT+MK+Phrase',
  'B0DZ6VRPT7+DR-HTF017 Black+Ucie+SPM+KT',
]

/** 今日字符串 'YYYY-MM-DD'，用作日期选择器的 min 值（禁止选过去日期） */
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
  dailyBudget:  '',
  dateRange:    ''
})

// Reactively clear schedule error as soon as values satisfy all rules
watch(
  () => [form.value.startTime, form.value.endTime, form.value.scheduleType],
  ([start, end, type]) => {
    if (!errors.dateRange) return
    if (!start) return                                                    // 开始日期仍为空
    if (type === 'range' && !end) return                                  // 结束日期仍为空
    if (type === 'range' && new Date(end) <= new Date(start)) return      // 结束日期不晚于开始日期
    errors.dateRange = ''
  }
)

/**
 * 外部调用：校验所有必填项
 * @returns {{ ok: boolean, errorItems: Array<{subItem:string, label:string, anchorId:string}> }}
 */
function validate() {
  const errorItems = []

  if (!form.value.campaignName?.trim()) {
    errors.campaignName = 'Campaign name is required.'
    errorItems.push({ subItem: 'Settings', label: 'Campaign Name', anchorId: 'field-campaign-name' })
  } else {
    errors.campaignName = ''
  }

  if (!form.value.dailyBudget || Number(form.value.dailyBudget) <= 0) {
    errors.dailyBudget = 'Please enter a daily budget greater than 0.'
    errorItems.push({ subItem: 'Settings', label: 'Daily budget', anchorId: 'field-daily-budget' })
  } else {
    errors.dailyBudget = ''
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
    // Scroll to the first unfilled field
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

/* Campaign name：与块级 label 同宽，便于长名称整行编辑 */
#field-campaign-name .input-wrap {
  max-width: none;
}

/* 错误状态下输入框红色边框（透过 :deep 兼容 UI 组件；排除 combobox 内搜索框） */
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
