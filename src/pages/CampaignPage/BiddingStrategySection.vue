<template>
  <section id="section-bidding-strategy" class="card">
    <div class="card-header">
      <h2>Bidding strategy</h2>
    </div>

    <div class="options">
      <RadioCard v-model="form.bidMode" value="up_down">
        <p class="option-title">Dynamic bids - up and down</p>
        <p class="option-desc">
          We'll raise your bids (by a maximum of 100% on all placements) in real time when your ad
          may be more likely to convert to a sale, and lower your bids when less likely to convert
          to a sale.
        </p>
      </RadioCard>

      <RadioCard v-model="form.bidMode" value="down_only">
        <p class="option-title">Dynamic bids - down only</p>
        <p class="option-desc">
          We'll lower your bids in real time when your ad may be less likely to convert to a sale.
        </p>
      </RadioCard>

      <RadioCard v-model="form.bidMode" value="fixed">
        <p class="option-title">Fixed bids</p>
        <p class="option-desc">
          We'll use your exact bid and any manual adjustments you set without making dynamic changes.
        </p>
      </RadioCard>
    </div>

    <!-- 共用详情面板：三种策略共享，避免重复渲染 -->
    <Transition name="slide">
      <div v-if="form.bidMode" class="detail-panel">
        <div class="bid-adjustment-header-row">
          <h2>Bid adjustment</h2>
          <div class="placement-assumption-row placement-assumption-under-title">
          <template v-if="!editingBaseBid">
            <span class="placement-assumption-muted">Assuming a base bid of </span>
            <span class="placement-assumption-amount">{{ formatUsd(displayBaseBid) }}</span>
            <button
              type="button"
              class="placement-edit-bid"
              aria-label="Edit base bid"
              @click="startEditBaseBid"
            >
              <svg
                class="placement-pencil-icon"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                <path d="m15 5 4 4" />
              </svg>
            </button>
          </template>
          <template v-else>
            <span class="placement-assumption-muted">Assuming a base bid of </span>
            <input
              ref="baseBidInputRef"
              v-model.number="baseBidDraft"
              class="placement-base-bid-input"
              type="number"
              step="0.01"
              min="0.01"
              @blur="commitBaseBid"
              @keydown.enter.prevent="commitBaseBid"
              @keydown.escape.prevent="cancelEditBaseBid"
            />
          </template>
          </div>
        </div>
        <!-- Placements（始终展开） -->
        <div class="sub-section">
          <div class="sub-label-row">
            <span class="sub-label">Placements</span>
          </div>
          <div class="placements-list">
            <div class="placement-field" v-for="p in placements" :key="p.key">
              <label>{{ p.label }}</label>
              <div class="placement-input-row">
                <div class="placement-input-wrap">
                  <InlineNumberInput v-model="form[p.key]" suffix="%" size="lg" />
                </div>
                <span v-if="placementBidHint(p.key)" class="placement-effective">
                  {{ placementBidHint(p.key) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Audiences（始终展开） -->
        <div class="sub-section">
          <div class="sub-label-row">
            <span class="sub-label">Audiences</span>
            <img :src="iconHelpCircle" alt="" width="16" height="16" />
          </div>
          <div class="audiences-body">
            <UiSelect
              v-model="form.audienceMode"
              size="lg"
              :options="audienceOptions"
            />
          </div>
        </div>
      </div>
    </Transition>
  </section>
</template>

<script setup>
import { computed, ref, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useCampaignStore } from '@/stores/campaign'
import RadioCard from '@/components/base/RadioCard.vue'
import InlineNumberInput from '@/components/base/InlineNumberInput.vue'
import UiSelect from '@/components/ui/select/Select.vue'
import iconHelpCircle from '@/assets/icon-help-circle.svg'

const { form } = storeToRefs(useCampaignStore())

const editingBaseBid = ref(false)
const baseBidDraft = ref(0)
const baseBidInputRef = ref(null)

/** 用于计算：广告组默认出价（store，可被本页铅笔编辑） */
const baseBidAmount = computed(() => {
  const n = Number(form.value.adGroupBid)
  return Number.isFinite(n) && n > 0 ? n : 0
})

/** 展示用（含 0，便于未设置时仍显示文案） */
const displayBaseBid = computed(() => {
  const n = Number(form.value.adGroupBid)
  if (!Number.isFinite(n) || n < 0) return 0
  return n
})

function startEditBaseBid() {
  const n = Number(form.value.adGroupBid)
  baseBidDraft.value = Number.isFinite(n) && n > 0 ? n : 0.7
  editingBaseBid.value = true
  nextTick(() => {
    baseBidInputRef.value?.focus?.()
    baseBidInputRef.value?.select?.()
  })
}

function commitBaseBid() {
  const v = Number(baseBidDraft.value)
  if (Number.isFinite(v) && v > 0) {
    form.value.adGroupBid = Math.round(v * 10000) / 10000
  }
  editingBaseBid.value = false
}

function cancelEditBaseBid() {
  editingBaseBid.value = false
}

function formatUsd(value) {
  if (value == null || !Number.isFinite(value)) return ''
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

/** 某位置在仅考虑「位置调价 %」后的起始竞价；up_down 时另含动态竞价最高可再 +100% 的上限 */
function placementEffectiveAmount(percentKey) {
  const base = baseBidAmount.value
  if (base <= 0) return null
  const pct = Number(form.value[percentKey])
  const p = Number.isFinite(pct) ? pct : 0
  return base * (1 + p / 100)
}

function placementBidHint(percentKey) {
  const eff = placementEffectiveAmount(percentKey)
  if (eff == null) return ''
  const start = formatUsd(eff)
  const mode = form.value.bidMode
  if (mode === 'up_down') {
    const maxUp = eff * 2
    return `≈ ${start} · max ${formatUsd(maxUp)}`
  }
  return `≈ ${start}`
}

const placements = [
  { key: 'bidTop',     label: 'Top of search (first page)' },
  { key: 'bidRest',    label: 'Rest of search' },
  { key: 'bidProduct', label: 'Product pages' }
]

const audienceOptions = [
  { value: 'increase_amazon_built', label: 'Increase bids for audiences built by Amazon' },
  {
    value: 'increase_amc_custom',
    label: 'Increase bids on a custom audience created in Amazon Marketing Cloud (AMC)',
  },
  { value: 'don_t_increase', label: "Don't increase bids for an audience" },
]
</script>

<style scoped>
.card {
  background: var(--bg-card);
  border-radius: var(--radius-card);
  padding: 28px 32px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

h2 {
  margin: 0;
  font-size: var(--text-2xl, 22px);
  font-weight: 600;
  color: var(--text-main);
}

.options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.option-title {
  margin: 0;
  font-size: var(--text-md, 15px);
  font-weight: 600;
  color: var(--text-main);
}

.option-desc {
  margin: 4px 0 0;
  font-size: var(--text-base, 14px);
  color: var(--text-sub);
  line-height: 1.55;
}

/* 共用详情面板，切换策略时不重建 DOM */
.detail-panel {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.bid-adjustment-header-row {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: flex-start;
  column-gap: 10px;
  row-gap: 6px;
  width: 100%;
}

.bid-adjustment-header-row > h2 {
  margin: 0;
  flex-shrink: 0;
}

.sub-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sub-label-row {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 6px;
  padding: 0;
  width: 100%;
}

.sub-label {
  font-size: var(--text-base, 14px);
  font-weight: 600;
  color: var(--text-main);
}

.placements-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.placement-field {
  width: 100%;
  max-width: 480px;
}

.placement-input-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px 12px;
}

.placement-input-wrap {
  flex: 1;
  min-width: 140px;
  max-width: 400px;
}

.placement-effective {
  font-size: var(--text-base, 14px);
  font-weight: 500;
  color: var(--text-sub);
  white-space: nowrap;
}

.placement-assumption-row {
  margin: 0;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 2px 4px;
  font-size: var(--text-sm, 13px);
  font-weight: 400;
  line-height: 1.5;
}

.placement-assumption-under-title {
  font-size: var(--text-md, 15px);
  line-height: 1.45;
}

.placement-assumption-muted {
  color: var(--text-hint);
}

.placement-assumption-amount {
  font-weight: 500;
  color: var(--primary);
}

.placement-edit-bid {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 2px;
  border: none;
  border-radius: var(--radius-sm, 4px);
  background: transparent;
  color: var(--primary);
  cursor: pointer;
  vertical-align: middle;
  transition: background 0.15s;
}

.placement-edit-bid:hover {
  background: var(--primary-light);
}

.placement-pencil-icon {
  display: block;
  flex-shrink: 0;
}

.placement-base-bid-input {
  width: 5.5rem;
  box-sizing: border-box;
  margin: 0 2px;
  padding: 2px 6px;
  font: inherit;
  font-weight: 500;
  color: var(--primary);
  border: 1px solid var(--primary-border);
  border-radius: var(--radius-sm, 4px);
  background: var(--bg-card);
}

.placement-base-bid-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 2px hsl(217 100% 54% / 0.2);
}

.placement-field label {
  display: block;
  font-size: var(--text-base, 14px);
  font-weight: 500;
  margin-bottom: 6px;
  color: var(--text-main);
  white-space: nowrap;
}

.audiences-body {
  width: 100%;
  max-width: 400px;
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
