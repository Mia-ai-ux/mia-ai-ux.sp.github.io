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
            <div class="tooltip-wrap">
              <img :src="iconHelpCircle" alt="" width="16" height="16" class="help-icon-trigger" />
              <div class="tooltip-bubble">
                The "clicked or added brand's product to cart" audience includes people who have
                clicked or added to cart within the last 3 months, but haven't purchased.
              </div>
            </div>
          </div>

          <!-- Three radio options -->
          <div class="audience-options">
            <label class="radio-line" @click="form.audienceMode = 'increase_amazon_built'">
              <span class="radio-dot" :class="{ checked: form.audienceMode === 'increase_amazon_built' }">
                <span v-if="form.audienceMode === 'increase_amazon_built'" class="radio-dot-inner" />
              </span>
              <span>Increase bids for audiences built by Amazon</span>
            </label>

            <label class="radio-line" @click="form.audienceMode = 'increase_amc_custom'">
              <span class="radio-dot" :class="{ checked: form.audienceMode === 'increase_amc_custom' }">
                <span v-if="form.audienceMode === 'increase_amc_custom'" class="radio-dot-inner" />
              </span>
              <span>Increase bids on a custom audience created in Amazon Marketing Cloud (AMC)</span>
            </label>

            <label class="radio-line" @click="form.audienceMode = 'don_t_increase'">
              <span class="radio-dot" :class="{ checked: form.audienceMode === 'don_t_increase' }">
                <span v-if="form.audienceMode === 'don_t_increase'" class="radio-dot-inner" />
              </span>
              <span>Don't increase bids for an audience</span>
            </label>
          </div>

          <!-- Audience config — only when an increase mode is selected -->
          <Transition name="slide">
            <div v-if="form.audienceMode !== 'don_t_increase'" class="audience-config">
              <p class="audience-config-label">Audience</p>
              <div class="placement-input-row">
                <div class="placement-input-wrap">
                  <UiSelect
                    v-model="form.audienceId"
                    size="lg"
                    placeholder="Choose an audience"
                    :options="currentAudienceOptions"
                  />
                </div>
                <div class="audience-pct-wrap">
                  <InlineNumberInput v-model="form.audiencePct" suffix="%" size="lg" />
                </div>
              </div>
              <p v-if="audienceBidHint" class="audience-hint">{{ audienceBidHint }}</p>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </section>
</template>

<script setup>
import { computed, ref, watch, nextTick } from 'vue'
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
  if (mode === 'down_only') {
    // bid can only go lower — the calculated value is the ceiling
    return `≤ ${start}`
  }
  return `≈ ${start}`
}

const placements = [
  { key: 'bidTop',     label: 'Top of search (first page)' },
  { key: 'bidRest',    label: 'Rest of search' },
  { key: 'bidProduct', label: 'Product pages' }
]

// Clear selected audience when switching mode
watch(() => form.value.audienceMode, () => {
  form.value.audienceId  = ''
  form.value.audiencePct = 0
})

const amazonAudienceOptions = [
  { value: 'amazon_interest',    label: 'Amazon Interest Audiences' },
  { value: 'amazon_lifestyle',   label: 'Amazon Lifestyle Segments' },
  { value: 'amazon_inmarket',    label: 'In-Market Audiences' },
  { value: 'amazon_remarketing', label: 'Remarketing Audiences' },
]

const amcAudienceOptions = [
  { value: 'amc_1',  label: 'AMC AMC Test_Audience_Cart_Abandon_20251222_6 - 403316359709171985' },
  { value: 'amc_2',  label: 'AMC DREO-DSP 1 DPV/Exclude Purchase-DSP-L14D-Rule based - 376373797466773890' },
  { value: 'amc_3',  label: 'AMC DREO-High Value Audiences/Top30%-NA&AD-L30D - BalancedLookalike - 404953712003503637' },
  { value: 'amc_4',  label: 'AMC Household Fan-DSP 1~3 DPV/Exclude Purchase or SA clicks-DSP-L14D-Rule based - 393375133049604205' },
  { value: 'amc_5',  label: 'AMC AMC Test_Audience_Cart_Abandon_20251222_4 - 395120201479263450' },
  { value: 'amc_6',  label: 'AMC Tower Fan_DSP Campaign Impression_Min3_DSP_L30D_Rule based - 386547894924918884' },
  { value: 'amc_7',  label: 'AMC Tower Fan_KW Search_SA_L30D_Rule based - 413307513012821463' },
  { value: 'amc_8',  label: 'AMC AMC Test_Audience_Cart_Abandon_20251222_7 - 375875559998058170' },
  { value: 'amc_9',  label: 'AMC AMC Water Filter-Search Not Purchase-L30D-Rule based-ST&ASIN - 400225369521613229' },
  { value: 'amc_10', label: 'AMC Space Heater SA brand keywords & no purchase L7D Rule based - 382177465223739296' },
]

const currentAudienceOptions = computed(() =>
  form.value.audienceMode === 'increase_amazon_built'
    ? amazonAudienceOptions
    : amcAudienceOptions
)

/** "With dynamic bids - up and down, a $X bid can be up to $Y for this audience." */
const audienceBidHint = computed(() => {
  const base = baseBidAmount.value
  if (!base || form.value.audienceMode === 'don_t_increase') return ''
  if (form.value.bidMode !== 'up_down') return ''
  const pct    = Number(form.value.audiencePct) || 0
  const upTo   = base * (1 + pct / 100) * 2
  return `With dynamic bids - up and down, a ${formatUsd(base)} bid can be up to ${formatUsd(upTo)} for this audience.`
})
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

/* Audience radio options */
.audience-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.radio-line {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  cursor: pointer;
  font-size: var(--text-base, 14px);
  color: var(--text-main);
  line-height: 1.5;
  user-select: none;
}

.radio-dot {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  margin-top: 2px;
  border-radius: 50%;
  border: 2px solid var(--border-strong, #b0b8c8);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.15s;
}

.radio-dot.checked {
  border-color: var(--primary);
}

.radio-dot-inner {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--primary);
}

/* Audience config panel */
.audience-config {
  margin-top: 4px;
  padding: 16px;
  border-radius: var(--radius-md, 8px);
  background: var(--gray-50, #f8fafc);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.audience-config-label {
  margin: 0;
  font-size: var(--text-base, 14px);
  font-weight: 500;
  color: var(--text-main);
}

.audience-pct-wrap {
  width: 110px;
  flex-shrink: 0;
}

.audience-hint {
  margin: 2px 0 0;
  font-size: var(--text-sm, 13px);
  color: var(--text-hint);
  line-height: 1.5;
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

/* Audiences help tooltip */
.tooltip-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.help-icon-trigger {
  display: block;
  cursor: default;
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
  width: 300px;
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
  border: 5px solid transparent;
  border-right-color: #1c1f23;
  border-left: none;
}

.tooltip-wrap:hover .tooltip-bubble {
  display: block;
}
</style>
