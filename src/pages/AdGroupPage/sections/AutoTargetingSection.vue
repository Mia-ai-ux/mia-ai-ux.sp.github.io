<template>
  <section id="section-auto-targeting" class="card">
    <div class="card-header">
      <div class="title-group">
        <h2>Set bid pricing</h2>
        <p>Automatic targeting</p>
      </div>
    </div>

    <hr />

    <div class="blocks">
      <!-- 1. Targeting groups -->
      <div class="bid-block" :class="{ 'bid-block--inactive': form.autoBidMode !== 'targeting_group' }">
        <div class="label-row">
          <span
            class="radio-dot"
            :class="{ checked: form.autoBidMode === 'targeting_group' }"
            @click="form.autoBidMode = 'targeting_group'"
          >
            <span v-if="form.autoBidMode === 'targeting_group'" class="radio-dot-inner" />
          </span>
          <label @click="form.autoBidMode = 'targeting_group'">Set bids by targeting group</label>
          <div class="tooltip-wrap">
            <img :src="iconHelpCircle" alt="" width="16" height="16" class="help-icon-trigger" />
            <div class="tooltip-bubble">
              Targeting groups use multiple strategies to match your ads to shoppers looking for your products.
            </div>
          </div>
        </div>
        <div v-if="form.autoBidMode === 'targeting_group'" class="at-table">
          <!-- Header row -->
          <div class="at-table-head">
            <div class="at-head-cell at-head-cell--name">
              <span class="at-head-label">Targeting groups</span>

              <div class="tooltip-wrap">
                <img :src="iconHelpCircle" alt="" width="14" height="14" class="help-icon-trigger" />
                <div class="tooltip-bubble">
                  Targeting groups use multiple strategies to match your ads to shoppers looking for your products.
                </div>
              </div>
            </div>
            <div class="at-head-cell at-head-cell--suggest">
              <div class="at-suggest-select-wrap tooltip-wrap suggest-disabled-wrap">
                <select v-model="suggestPeriod" class="at-suggest-select" disabled>
                  <option v-for="o in suggestPeriodOptions" :key="o.value" :value="o.value">{{ o.label }}</option>
                </select>
                <svg class="at-select-chevron" width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <div class="tooltip-bubble suggest-disabled-tooltip">
                  No upcoming special events. Bids for special events will be available 45 days before the event.
                </div>
              </div>
            </div>
            <div class="at-head-cell at-head-cell--bid">
              <span class="at-head-label">Bid</span>

              <div class="tooltip-wrap">
                <img :src="iconHelpCircle" alt="" width="14" height="14" class="help-icon-trigger" />
                <div class="tooltip-bubble at-bid-tooltip">
                  Enter the maximum amount you're willing to pay for a click.
                </div>
              </div>
            </div>
          </div>

          <!-- Data rows -->
          <div class="at-table-body">
            <div v-for="g in groups" :key="g.key" class="at-row">
              <!-- Toggle -->
              <button
                class="toggle"
                :class="{ on: form.autoGroups[g.key].enabled }"
                type="button"
                @click="form.autoGroups[g.key].enabled = !form.autoGroups[g.key].enabled"
              >
                <span class="knob"></span>
              </button>

              <!-- Name + tooltip -->
              <div class="group-name-row">
                <p class="group-name">{{ g.label }}</p>
                <div class="tooltip-wrap group-tooltip-wrap">
                  <img :src="iconHelpCircle" alt="" width="14" height="14" class="help-icon-trigger" />
                  <div class="tooltip-bubble group-tooltip-bubble">{{ g.desc }}</div>
                </div>
              </div>

              <!-- Suggested bid -->
              <div class="at-suggest-cell">
                <p class="at-suggest-price">{{ formatUsd(g.suggest[suggestPeriod].price) }}</p>
                <p class="at-suggest-range">({{ formatUsd(g.suggest[suggestPeriod].low) }}–{{ formatUsd(g.suggest[suggestPeriod].high) }})</p>
              </div>

              <!-- Bid input -->
              <div class="at-bid-cell">
                <InlineNumberInput
                  suffix="USD"
                  :model-value="form.autoGroups[g.key].bid"
                  @update:model-value="onBidInput(g.key, $event)"
                  :step="0.01"
                  size="lg"
                  class="bid-input"
                  :disabled="!form.autoGroups[g.key].enabled"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Default bid -->
      <div class="bid-block" :class="{ 'bid-block--inactive': form.autoBidMode !== 'default_bid' }">
        <div class="label-row">
          <span
            class="radio-dot"
            :class="{ checked: form.autoBidMode === 'default_bid' }"
            @click="form.autoBidMode = 'default_bid'"
          >
            <span v-if="form.autoBidMode === 'default_bid'" class="radio-dot-inner" />
          </span>
          <label @click="form.autoBidMode = 'default_bid'">Set default bid</label>
          <div class="tooltip-wrap">
            <img :src="iconHelpCircle" alt="" width="16" height="16" class="help-icon-trigger" />
            <div class="tooltip-bubble">
              Default bid applies to all clicks unless you set a different bid for a keyword.
            </div>
          </div>
        </div>
        <div v-if="form.autoBidMode === 'default_bid'" class="default-bid-wrap">
          <InlineNumberInput
            v-model="form.adGroupBid"
            :step="0.01"
            suffix="USD"
            size="lg"
            class="bid-input"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useCampaignStore } from '@/stores/campaign'
import InlineNumberInput from '@/components/base/InlineNumberInput.vue'
import iconHelpCircle from '@/assets/icon-help-circle.svg'

const { form } = storeToRefs(useCampaignStore())

const suggestPeriod = ref('regular')
const suggestPeriodOptions = [
  { value: 'regular', label: 'Suggested bid for regular days' },
  { value: 'peak',    label: 'Suggested bid for peak days' },
]

function formatUsd(v) {
  if (v == null) return ''
  return `$${Number(v).toFixed(2)}`
}

const groups = [
  {
    key: 'closeMatch',
    label: 'Close match',
    desc: 'Shows ads to shoppers using search terms closely related to your products. Example: "running shoes" might match "athletic shoes".',
    suggest: {
      regular: { price: 0.65, low: 0.44, high: 0.82 },
      peak:    { price: 0.85, low: 0.60, high: 1.05 },
    },
  },
  {
    key: 'looseMatch',
    label: 'Loose match',
    desc: 'Shows ads to shoppers using search terms loosely related to your products. Example: "running shoes" might match "sports equipment".',
    suggest: {
      regular: { price: 0.54, low: 0.35, high: 0.63 },
      peak:    { price: 0.72, low: 0.48, high: 0.85 },
    },
  },
  {
    key: 'substitutes',
    label: 'Substitutes',
    desc: 'Shows ads to shoppers viewing similar products to yours. Example: Showing Nike running shoes to someone viewing Adidas running shoes.',
    suggest: {
      regular: { price: 0.47, low: 0.25, high: 0.63 },
      peak:    { price: 0.63, low: 0.35, high: 0.82 },
    },
  },
  {
    key: 'complements',
    label: 'Complements',
    desc: 'Shows ads to shoppers viewing products that pair well with yours. Example: Showing shoe insoles to someone viewing running shoes.',
    suggest: {
      regular: { price: 0.41, low: 0.25, high: 0.51 },
      peak:    { price: 0.56, low: 0.33, high: 0.68 },
    },
  },
]

watch(
  () => form.value.adGroupBid,
  (newBid) => {
    const touched = form.value.autoGroupBidTouched
    for (const g of groups) {
      if (!touched[g.key]) {
        form.value.autoGroups[g.key].bid = newBid
      }
    }
  },
  { immediate: true }
)

function onBidInput(key, val) {
  form.value.autoGroupBidTouched[key] = true
  form.value.autoGroups[key].bid = val
}
</script>

<style scoped>
.card {
  background: var(--bg-card);
  border-radius: var(--radius-card);
  padding: 28px 32px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  padding-bottom: 8px;
}

.title-group h2 {
  margin: 0;
  font-size: var(--text-2xl, 22px);
  font-weight: 600;
  color: var(--text-main);
}

.title-group p {
  margin: 4px 0 0;
  font-size: var(--text-base, 14px);
  color: var(--text-sub);
}

hr {
  border: 0;
  border-top: 1px solid var(--border);
  margin: 0 0 20px;
}

.blocks {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.bid-block {
  padding: 0;
  border: none;
  background: transparent;
}

/* 与 Campaign Settings · Daily budget 一致：标题 + 问号 + 悬停说明 */
.radio-dot {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1.5px solid var(--border-strong);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
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

.bid-block--inactive .groups,
.bid-block--inactive .default-bid-wrap { opacity: 0.5; }
.bid-block--inactive .label-row { cursor: pointer; }

.label-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
  font-size: var(--text-base, 14px);
  font-weight: 600;
  color: var(--text-main);
}

.label-row label {
  margin: 0;
  cursor: pointer;
}

.help-icon-trigger {
  cursor: pointer;
  flex-shrink: 0;
  display: block;
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

.bid-input {
  max-width: 400px;
  width: 100%;
}

.default-bid-wrap {
  margin-top: 0;
}

/* ── Targeting groups table ── */
.at-table {
  margin-top: 12px;
  padding-left: 22px;
}

.at-table-head,
.at-row {
  display: grid;
  grid-template-columns: 26px 160px 32px 300px 160px;
  align-items: center;
  justify-items: start;
  column-gap: 4px;
}

.at-table-head {
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 4px;
}

.at-head-cell {
  display: flex;
  align-items: center;
  gap: 6px;
}

.at-head-cell--name {
  grid-column: 1 / 3;
  width: fit-content;
  justify-self: start;
}

.at-head-cell--suggest,
.at-suggest-cell {
  grid-column: 4;
}

.at-head-cell--bid,
.at-bid-cell {
  grid-column: 5;
}

.at-head-cell--bid {
  justify-content: flex-start;
}

.at-head-label {
  font-size: var(--text-md, 15px);
  font-weight: 600;
  color: var(--text-main);
}

.at-table-body {
  display: flex;
  flex-direction: column;
}

.at-row {
  padding: 14px 0;
  border-bottom: 1px solid var(--border);
}

.at-row:last-child {
  border-bottom: none;
}

.at-suggest-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.at-suggest-price {
  margin: 0;
  font-size: var(--text-base, 14px);
  font-weight: 500;
  color: var(--primary);
}

.at-suggest-range {
  margin: 0;
  font-size: var(--text-sm, 13px);
  color: var(--text-hint);
}

.at-bid-cell {
  width: 100%;
}

.at-bid-tooltip {
  left: 50%;
  right: auto;
  top: calc(100% + 10px);
  transform: translateX(-50%);
}
.at-bid-tooltip::before {
  left: 50%;
  top: -6px;
  transform: translateX(-50%);
  border-width: 0 6px 6px 6px;
  border-color: transparent transparent #1c1f23 transparent;
}

.at-suggest-select-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
}
.suggest-disabled-wrap {
  cursor: not-allowed;
}
.suggest-disabled-tooltip {
  left: 50%;
  top: calc(100% + 10px);
  transform: translateX(-50%);
  width: 260px;
  white-space: normal;
  line-height: 1.5;
}

.suggest-disabled-tooltip::before {
  left: 50%;
  top: -6px;
  transform: translateX(-50%);
  border-width: 0 6px 6px 6px;
  border-color: transparent transparent #1c1f23 transparent;
}

.at-suggest-select {
  appearance: none;
  height: 32px;
  border: none;
  padding: 0 20px 0 0;
  font-size: var(--text-md, 15px);
  font-weight: 600;
  font-family: inherit;
  color: var(--text-main);
  background: transparent;
  outline: none;
  cursor: pointer;
}
.at-suggest-select:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.at-select-chevron {
  position: absolute;
  right: 0;
  pointer-events: none;
  color: #94a3b8;
}

.toggle {
  flex-shrink: 0;
  width: 26px;
  height: 16px;
  border-radius: 8px;
  background: var(--border-strong);
  border: none;
  position: relative;
  cursor: pointer;
  transition: background 0.2s;
}

.toggle.on {
  background: var(--primary);
}

.knob {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.15);
  transition: left 0.2s;
}

.toggle.on .knob {
  left: 12px;
}

.group-name-row {
  display: flex;
  align-items: center;
  gap: 5px;
  width: fit-content;
}

.group-name {
  margin: 0;
  font-size: var(--text-md, 15px);
  font-weight: 600;
  color: var(--text-main);
}

/* Group-level tooltip: opens upward to avoid clipping at bottom */
.group-tooltip-bubble {
  left: 22px;
  top: auto;
  bottom: calc(100% + 8px);
  transform: none;
  width: 260px;
}

.group-tooltip-bubble::before {
  top: auto;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  border-width: 6px 6px 0 6px;
  border-color: #1c1f23 transparent transparent transparent;
}

</style>
