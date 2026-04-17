<template>
  <div class="page-layout">
    <div class="page-center">
      <Stepper :steps="steps" :current-step="launched ? maxStep + 1 : getStepNumber('/ad')" />

      <div class="content-wrapper">
        <h2 class="page-title">Launch campaign</h2>

        <main class="main-content">

          <!-- ══ Success overlay after launch ══ -->
          <Transition name="fade">
            <div v-if="launched" class="success-banner">
              <div class="success-icon">
                <span class="spark spark--tl">✦</span>
                <span class="spark spark--tr">✦</span>
                <span class="spark spark--bl">＋</span>
                <span class="spark spark--br">✦</span>
                <div class="check-circle">
                  <svg width="40" height="40" viewBox="0 0 44 44" fill="none">
                    <polyline points="10,23 18,32 34,14" stroke="#fff" stroke-width="3.5"
                      stroke-linecap="round" stroke-linejoin="round" class="check-path" />
                  </svg>
                </div>
              </div>
              <div class="success-text">
                <p class="success-title">发布成功！</p>
                <p class="success-sub">Your campaign has been submitted successfully.</p>
              </div>
            </div>
          </Transition>

          <!-- ══ Step cards ══ -->

          <!-- Card 1: Campaign Plan -->
          <div class="review-card">
            <div class="review-card__head">
              <span class="review-card__step">{{ stepLabel(1) }}</span>
              <button v-if="!launched" class="review-card__edit" @click="router.push('/campaign')">Edit</button>
            </div>
            <div class="review-card__body">
              <dl class="kv-grid">
                <div class="kv-item">
                  <dt>Campaign name</dt>
                  <dd>{{ form.campaignName }}</dd>
                </div>
                <div class="kv-item">
                  <dt>Sites</dt>
                  <dd>{{ siteTypeLabel }}</dd>
                </div>
                <div class="kv-item">
                  <dt>Daily budget</dt>
                  <dd>${{ Number(form.dailyBudget).toFixed(2) }}</dd>
                </div>
                <div v-if="hasScheduleSummary" class="kv-item">
                  <dt>Schedule</dt>
                  <dd>{{ form.startTime || '—' }} ~ {{ form.endTime || 'No end date' }}</dd>
                </div>
                <div v-if="hasPortfolio" class="kv-item">
                  <dt>Portfolio</dt>
                  <dd>{{ portfolioLabel }}</dd>
                </div>
                <div class="kv-item">
                  <dt>Bidding strategy</dt>
                  <dd>{{ bidModeLabel }}</dd>
                </div>
                <div v-if="hasPlacementBidAdj" class="kv-item">
                  <dt>Placement bid adjustments</dt>
                  <dd>{{ placementsSummary }}</dd>
                </div>
                <div class="kv-item">
                  <dt>Audience mode</dt>
                  <dd>{{ audienceModeLabel }}</dd>
                </div>
                <div v-if="showAudienceTargetRow" class="kv-item">
                  <dt>Audience</dt>
                  <dd>{{ audienceTargetLine }}</dd>
                </div>
                <div class="kv-item">
                  <dt>Targeting type</dt>
                  <dd>{{ targetingTypeLabel }}</dd>
                </div>
              </dl>
            </div>
          </div>

          <!-- Card 2: Ad Group -->
          <div class="review-card">
            <div class="review-card__head">
              <span class="review-card__step">{{ stepLabel(2) }}</span>
              <button v-if="!launched" class="review-card__edit"
                @click="router.push(form.targeting === 'auto' ? '/ad-group/auto' : '/ad-group/manual')">Edit</button>
            </div>
            <div class="review-card__body">
              <dl class="kv-grid">
                <div class="kv-item">
                  <dt>Ad group name</dt>
                  <dd>{{ form.adGroupName }}</dd>
                </div>
                <div v-if="form.targeting !== 'auto'" class="kv-item">
                  <dt>Default bid</dt>
                  <dd>${{ Number(form.adGroupBid).toFixed(2) }}</dd>
                </div>
                <template v-else-if="form.autoBidMode === 'default_bid'">
                  <div class="kv-item">
                    <dt>Bid pricing</dt>
                    <dd>Set default bid — ${{ Number(form.adGroupBid).toFixed(2) }}</dd>
                  </div>
                </template>
                <template v-else>
                  <div class="kv-item">
                    <dt>Bid pricing</dt>
                    <dd>Set bids by targeting group</dd>
                  </div>
                  <div class="kv-item">
                    <dt>Group bids</dt>
                    <dd>{{ autoGroupBidsSummary }}</dd>
                  </div>
                </template>
                <div class="kv-item">
                  <dt>Products</dt>
                  <dd>{{ form.products.length }} selected</dd>
                </div>
                <template v-if="form.targeting === 'auto' && form.autoBidMode === 'default_bid'">
                  <div class="kv-item">
                    <dt>Auto targeting groups</dt>
                    <dd>{{ enabledAutoGroups }}</dd>
                  </div>
                </template>
                <template v-else>
                  <div class="kv-item">
                    <dt>Targeting type</dt>
                    <dd>{{ form.manualTargetType === 'keyword' ? 'Keyword targeting' : 'Product targeting' }}</dd>
                  </div>
                </template>
              </dl>
            </div>
          </div>

          <!-- Bid ceiling preview (placement × strategy × audience; auto vs manual base) -->
          <div class="review-card review-card--bid-ceiling">
            <div class="review-card__head">
              <div class="review-card__title-with-tooltip">
                <span class="review-card__step">Bid ceiling preview</span>
                <div class="tooltip-wrap bid-ceiling-title-tooltip">
                  <img
                    :src="iconHelpCircle"
                    width="14"
                    height="14"
                    alt=""
                    class="help-icon-trigger help-icon-trigger--sm"
                  />
                  <div class="tooltip-bubble bid-ceiling-title-tooltip__bubble">
                    {{ bidCeilingTitleTooltip }}
                  </div>
                </div>
              </div>
            </div>
            <div class="review-card__body review-card__body--flush">
              <template v-if="form.targeting === 'auto'">
                <p v-if="form.autoBidMode === 'default_bid'" class="bid-ceiling-base">
                  Placement base (ad group default bid, all groups):
                  <strong>${{ bidCeilingDefaultBidDisplay }}</strong>
                </p>
                <div class="bid-cap-scroll">
                  <table class="bid-cap-table">
                    <thead>
                      <tr>
                        <th>Targeting group</th>
                        <th>Top of search</th>
                        <th>Rest of search</th>
                        <th>Product pages</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="row in autoBidCapRows"
                        :key="row.key"
                        :class="{ 'is-off': !row.enabled }"
                      >
                        <td>{{ row.label }}<span v-if="!row.enabled" class="muted"> (off)</span></td>
                        <td>{{ formatCapCell(row.caps, 'bidTop') }}</td>
                        <td>{{ formatCapCell(row.caps, 'bidRest') }}</td>
                        <td>{{ formatCapCell(row.caps, 'bidProduct') }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </template>
              <template v-else-if="form.targeting === 'manual' && form.manualTargetType === 'keyword'">
                <template v-if="manualKeywordCeiling">
                  <p class="bid-ceiling-base">
                    Highest bid keyword:
                    <strong>{{ manualKeywordCeiling.label }}</strong>
                    · bid <strong>${{ manualKeywordCeiling.bid.toFixed(2) }}</strong>
                  </p>
                  <div class="bid-cap-scroll">
                    <table class="bid-cap-table bid-cap-table--single">
                      <thead>
                        <tr>
                          <th>Top of search</th>
                          <th>Rest of search</th>
                          <th>Product pages</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{{ formatCapCell(manualKeywordCeiling.caps, 'bidTop') }}</td>
                          <td>{{ formatCapCell(manualKeywordCeiling.caps, 'bidRest') }}</td>
                          <td>{{ formatCapCell(manualKeywordCeiling.caps, 'bidProduct') }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </template>
                <p v-else class="bid-ceiling-empty">Add at least one keyword to see bid ceilings.</p>
              </template>
              <template v-else-if="form.targeting === 'manual' && form.manualTargetType === 'product'">
                <template v-if="manualProductCeiling">
                  <p class="bid-ceiling-base">
                    Highest bid target:
                    <strong>{{ manualProductCeiling.label }}</strong>
                    · bid <strong>${{ manualProductCeiling.bid.toFixed(2) }}</strong>
                  </p>
                  <div class="bid-cap-scroll">
                    <table class="bid-cap-table bid-cap-table--single">
                      <thead>
                        <tr>
                          <th>Top of search</th>
                          <th>Rest of search</th>
                          <th>Product pages</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{{ formatCapCell(manualProductCeiling.caps, 'bidTop') }}</td>
                          <td>{{ formatCapCell(manualProductCeiling.caps, 'bidRest') }}</td>
                          <td>{{ formatCapCell(manualProductCeiling.caps, 'bidProduct') }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </template>
                <p v-else class="bid-ceiling-empty">Add at least one category or product target to see bid ceilings.</p>
              </template>
            </div>
          </div>

          <!-- Card 3: Keyword Targeting (manual + keyword only) -->
          <div v-if="form.targeting === 'manual' && form.manualTargetType === 'keyword'" class="review-card">
            <div class="review-card__head">
              <span class="review-card__step">{{ stepLabel(3) }}</span>
              <button v-if="!launched" class="review-card__edit" @click="router.push('/keyword-targeting')">Edit</button>
            </div>
            <div class="review-card__body">
              <dl class="kv-grid">
                <div class="kv-item">
                  <dt>Keywords added</dt>
                  <dd>{{ form.keywords.length }}</dd>
                </div>
                <div class="kv-item">
                  <dt>Match types</dt>
                  <dd>{{ keywordReviewMatchTypes }}</dd>
                </div>
              </dl>
            </div>
          </div>

          <!-- Card 3: Product Targeting (manual + product only) -->
          <div v-if="form.targeting === 'manual' && form.manualTargetType === 'product'" class="review-card">
            <div class="review-card__head">
              <span class="review-card__step">{{ stepLabel(3) }}</span>
              <button v-if="!launched" class="review-card__edit" @click="router.push('/product-targeting')">Edit</button>
            </div>
            <div class="review-card__body">
              <dl class="kv-grid">
                <div class="kv-item">
                  <dt>Categories added</dt>
                  <dd>{{ categoryTargetCount }}</dd>
                </div>
                <div class="kv-item">
                  <dt>Products added</dt>
                  <dd>{{ productTargetCount }}</dd>
                </div>
                <div class="kv-item">
                  <dt>Default bid</dt>
                  <dd>${{ Number(form.productTargetingDefaultBid).toFixed(2) }}</dd>
                </div>
              </dl>
            </div>
          </div>

          <!-- Card N: Negative Targeting -->
          <div class="review-card">
            <div class="review-card__head">
              <span class="review-card__step">{{ negativeStepLabel }}</span>
              <button v-if="!launched" class="review-card__edit" @click="router.push('/negative-targeting')">Edit</button>
            </div>
            <div class="review-card__body">
              <dl class="kv-grid">
                <div class="kv-item">
                  <dt>Negative keywords</dt>
                  <dd>{{ form.negativeKeywords.length }}</dd>
                </div>
                <div class="kv-item">
                  <dt>Excluded products</dt>
                  <dd>{{ form.excludedProducts.length }}</dd>
                </div>
                <div class="kv-item">
                  <dt>Excluded brands</dt>
                  <dd>{{ form.excludedBrands.length }}</dd>
                </div>
              </dl>
            </div>
          </div>

          <!-- ══ Back to list (post-launch) ══ -->
          <div v-if="launched" class="back-to-list">
            <button class="back-to-list__btn" @click="router.push('/')">
              ← 返回广告活动列表
            </button>
          </div>

        </main>
      </div>
    </div>
  </div>

  <BottomBar
    v-if="!launched"
    next-label="Launch campaign"
    show-back
    :loading="submitting"
    @cancel="router.push('/')"
    @back="router.push(getBackPath('/ad'))"
    @next="onSubmit"
  />
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import Stepper from '@/components/Stepper.vue'
import BottomBar from '@/components/BottomBar.vue'
import { useFlowSteps } from '@/composables/useFlowSteps'
import { useCampaignStore } from '@/stores/campaign'
import iconHelpCircle from '@/assets/icon-help-circle.svg'

/** Hover 说明：与正文 intro 含义一致（中文） */
const bidCeilingTitleTooltip =
  '下面显示的是：在考虑广告位百分比、你选的竞价策略，以及（若开启）人群加价之后，单次出价大概最高能到多少美元——属于预览估算。'

const router   = useRouter()
const { steps, getStepNumber, getBackPath } = useFlowSteps()
const store    = useCampaignStore()
const { form } = storeToRefs(store)

const submitting = ref(false)
const launched   = ref(false)

const maxStep = computed(() => Math.max(...steps.value.map(s => s.step)))

// ── Campaign plan lookups (mirror CampaignSettings / BiddingStrategy) ──

const PORTFOLIO_OPTIONS = [
  { value: 'none', label: 'No Portfolio' },
  { value: 'hhm004s-black-2000', label: 'HHM004S Balck-2000' },
  { value: 'dr-htf005-2000', label: 'DR-HTF005-2000' },
  { value: 'dr-hac001-2000', label: 'DR-HAC001-2000' },
  { value: 'dr-hap002-1500', label: 'DR-HAP002-1500' },
  { value: 'dr-hec001-hec002s-300', label: 'DR-HEC001/DR-HEC002S-300' },
]

const AMAZON_AUDIENCE_OPTIONS = [
  { value: 'amazon_interest', label: 'Amazon Interest Audiences' },
  { value: 'amazon_lifestyle', label: 'Amazon Lifestyle Segments' },
  { value: 'amazon_inmarket', label: 'In-Market Audiences' },
  { value: 'amazon_remarketing', label: 'Remarketing Audiences' },
]

const AMC_AUDIENCE_OPTIONS = [
  { value: 'amc_1', label: 'AMC AMC Test_Audience_Cart_Abandon_20251222_6 - 403316359709171985' },
  { value: 'amc_2', label: 'AMC DREO-DSP 1 DPV/Exclude Purchase-DSP-L14D-Rule based - 376373797466773890' },
  { value: 'amc_3', label: 'AMC DREO-High Value Audiences/Top30%-NA&AD-L30D - BalancedLookalike - 404953712003503637' },
  { value: 'amc_4', label: 'AMC Household Fan-DSP 1~3 DPV/Exclude Purchase or SA clicks-DSP-L14D-Rule based - 393375133049604205' },
  { value: 'amc_5', label: 'AMC AMC Test_Audience_Cart_Abandon_20251222_4 - 395120201479263450' },
  { value: 'amc_6', label: 'AMC Tower Fan_DSP Campaign Impression_Min3_DSP_L30D_Rule based - 386547894924918884' },
  { value: 'amc_7', label: 'AMC Tower Fan_KW Search_SA_L30D_Rule based - 413307513012821463' },
  { value: 'amc_8', label: 'AMC AMC Test_Audience_Cart_Abandon_20251222_7 - 375875559998058170' },
  { value: 'amc_9', label: 'AMC AMC Water Filter-Search Not Purchase-L30D-Rule based-ST&ASIN - 400225369521613229' },
  { value: 'amc_10', label: 'AMC Space Heater SA brand keywords & no purchase L7D Rule based - 382177465223739296' },
]

// ── Derived labels ─────────────────────────────────────────────

const bidModeLabel = computed(() => {
  const map = {
    up_down: 'Dynamic bids - up and down',
    down_only: 'Dynamic bids - down only',
    fixed: 'Fixed bids',
  }
  return map[form.value.bidMode] ?? form.value.bidMode
})

const siteTypeLabel = computed(() =>
  form.value.siteType === 'amazon_business' ? 'Amazon Business' : 'Amazon and beyond'
)

const hasPortfolio = computed(() => {
  const v = form.value.portfolio
  return v !== '' && v != null
})

const portfolioLabel = computed(() => {
  const v = form.value.portfolio
  return PORTFOLIO_OPTIONS.find(o => o.value === v)?.label ?? String(v)
})

const hasScheduleSummary = computed(
  () => Boolean(form.value.startTime) || Boolean(form.value.endTime)
)

const hasPlacementBidAdj = computed(() => {
  const t = Number(form.value.bidTop) || 0
  const r = Number(form.value.bidRest) || 0
  const p = Number(form.value.bidProduct) || 0
  return t !== 0 || r !== 0 || p !== 0
})

const showAudienceTargetRow = computed(
  () =>
    form.value.audienceMode !== 'don_t_increase' &&
    (Boolean(form.value.audienceId) || Number(form.value.audiencePct) > 0)
)

const placementsSummary = computed(() => {
  const t = Number(form.value.bidTop) || 0
  const r = Number(form.value.bidRest) || 0
  const p = Number(form.value.bidProduct) || 0
  return `Top of search (first page): ${t}%, Rest of search: ${r}%, Product pages: ${p}%`
})

const audienceModeLabel = computed(() => {
  const m = form.value.audienceMode
  if (m === 'increase_amazon_built') return 'Increase bids for audiences built by Amazon'
  if (m === 'increase_amc_custom') {
    return 'Increase bids on a custom audience created in Amazon Marketing Cloud (AMC)'
  }
  return "Don't increase bids for an audience"
})

const audienceIdLabel = computed(() => {
  const id = form.value.audienceId
  if (!id) return ''
  const all = [...AMAZON_AUDIENCE_OPTIONS, ...AMC_AUDIENCE_OPTIONS]
  return all.find(o => o.value === id)?.label ?? id
})

const audienceTargetLine = computed(() => {
  const name = audienceIdLabel.value || 'Not selected'
  const pct = Number(form.value.audiencePct) || 0
  return `${name} · ${pct}%`
})

const targetingTypeLabel = computed(() =>
  form.value.targeting === 'auto' ? 'Automatic targeting' : 'Manual targeting'
)

const enabledAutoGroups = computed(() => {
  const g = form.value.autoGroups
  const names = []
  if (g.closeMatch?.enabled)  names.push('Close match')
  if (g.looseMatch?.enabled)  names.push('Loose match')
  if (g.substitutes?.enabled) names.push('Substitutes')
  if (g.complements?.enabled) names.push('Complements')
  return names.length ? names.join(', ') : 'None'
})

/** Launch review: per-group bid amounts when autoBidMode is targeting_group */
const autoGroupBidsSummary = computed(() => {
  const defs = [
    { key: 'closeMatch', label: 'Close match' },
    { key: 'looseMatch', label: 'Loose match' },
    { key: 'substitutes', label: 'Substitutes' },
    { key: 'complements', label: 'Complements' },
  ]
  const g = form.value.autoGroups
  const parts = []
  for (const { key, label } of defs) {
    const row = g[key]
    if (!row?.enabled) continue
    parts.push(`${label}: $${Number(row.bid).toFixed(2)}`)
  }
  return parts.length ? parts.join(' · ') : '—'
})

// ── Bid ceiling preview (placement × strategy × audience) ─────

const AUTO_GROUP_ROW_DEFS = [
  { key: 'closeMatch', label: 'Close match' },
  { key: 'looseMatch', label: 'Loose match' },
  { key: 'substitutes', label: 'Substitutes' },
  { key: 'complements', label: 'Complements' },
]

function safeNum(v) {
  const n = Number(v)
  return Number.isFinite(n) && n >= 0 ? n : 0
}

/** Per-placement caps for a single placement base (USD). */
function computeCapsForBase(base, f) {
  const b = safeNum(base)
  if (b <= 0) return null
  const audMult =
    f.audienceMode !== 'don_t_increase'
      ? 1 + safeNum(f.audiencePct) / 100
      : 1
  const dynFactor = f.bidMode === 'up_down' ? 2 : 1
  const keys = ['bidTop', 'bidRest', 'bidProduct']
  const caps = {}
  for (const key of keys) {
    const afterPlacement = b * (1 + safeNum(f[key]) / 100)
    const afterDynamic = afterPlacement * dynFactor
    caps[key] = Math.round(afterDynamic * audMult * 100) / 100
  }
  return caps
}

function formatCapCell(caps, key) {
  if (!caps || caps[key] == null || !Number.isFinite(caps[key])) return '—'
  return `$${Number(caps[key]).toFixed(2)}`
}

function productTargetLabel(t) {
  if (!t) return 'Target'
  if (t.title) return String(t.title)
  if (t.asin) return String(t.asin)
  if (t.path) return String(t.path)
  return 'Target'
}

const bidCeilingDefaultBidDisplay = computed(() => safeNum(form.value.adGroupBid).toFixed(2))

const autoBidCapRows = computed(() => {
  const f = form.value
  const useDefault = f.autoBidMode === 'default_bid'
  const defaultBase = safeNum(f.adGroupBid)
  return AUTO_GROUP_ROW_DEFS.map(({ key, label }) => {
    const row = f.autoGroups[key]
    const enabled = Boolean(row?.enabled)
    const baseBid = useDefault ? defaultBase : safeNum(row?.bid)
    const caps = computeCapsForBase(baseBid, f)
    return { key, label, enabled, caps }
  })
})

const manualKeywordCeiling = computed(() => {
  const f = form.value
  const kws = f.keywords ?? []
  if (!kws.length) return null
  let best = null
  let maxBid = -1
  for (const k of kws) {
    const b = safeNum(k.bid)
    if (b > maxBid) {
      maxBid = b
      best = k
    }
  }
  if (!best) return null
  const bid = safeNum(best.bid)
  const caps = computeCapsForBase(bid, f)
  const label = best.text ? String(best.text) : 'Keyword'
  return { label, bid, caps }
})

const manualProductCeiling = computed(() => {
  const f = form.value
  const targets = f.productTargets ?? []
  if (!targets.length) return null
  let best = null
  let maxBid = -1
  for (const t of targets) {
    const b = safeNum(t.bid)
    if (b > maxBid) {
      maxBid = b
      best = t
    }
  }
  if (!best) return null
  const bid = safeNum(best.bid)
  const caps = computeCapsForBase(bid, f)
  return { label: productTargetLabel(best), bid, caps }
})

/** 与右侧已添加列表一致：按 keywords[].matchType 汇总，而非左侧勾选状态 */
const keywordReviewMatchTypes = computed(() => {
  const kws = form.value.keywords ?? []
  if (!kws.length) return '—'
  const priority = ['Exact', 'Phrase', 'Broad']
  const canon = (s) => {
    const t = String(s ?? '').trim().toLowerCase()
    if (t === 'exact') return 'Exact'
    if (t === 'phrase') return 'Phrase'
    if (t === 'broad') return 'Broad'
    return String(s ?? '').trim() || null
  }
  const seen = new Set()
  for (const k of kws) {
    const label = canon(k.matchType)
    if (label) seen.add(label)
  }
  const ordered = priority.filter((x) => seen.has(x))
  const rest = [...seen].filter((x) => !priority.includes(x))
  const all = [...ordered, ...rest]
  return all.length ? all.join(', ') : '—'
})

const categoryTargetCount = computed(() =>
  (form.value.productTargets ?? []).filter(t => t.kind === 'category').length
)
const productTargetCount = computed(() =>
  (form.value.productTargets ?? []).filter(t => t.kind === 'product').length
)

// ── Step label helpers ─────────────────────────────────────────

function stepLabel(n) {
  const s = steps.value.find(x => x.step === n)
  return s ? `${s.step}  ${s.label}` : `Step ${n}`
}

const negativeStepLabel = computed(() => {
  const s = steps.value.find(x => x.path === '/negative-targeting')
  return s ? `${s.step}  ${s.label}` : 'Negative targeting'
})

// ── Submit ─────────────────────────────────────────────────────

function onSubmit() {
  if (launched.value) {
    router.push('/campaign')
    return
  }
  submitting.value = true
  setTimeout(() => {
    submitting.value = false
    launched.value   = true
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, 900)
}
</script>

<style scoped>
/* ── page shell ─────────────────────────────── */
.page-layout {
  display: flex;
  justify-content: center;
  min-height: calc(100vh - var(--nav-height, 60px));
  width: 100%;
}

.page-center {
  display: flex;
  align-items: flex-start;
  gap: var(--sidebar-gap, 40px);
  width: var(--content-width, 80vw);
  max-width: 100%;
  box-sizing: border-box;
  padding: 40px 0 0;
}

.content-wrapper {
  flex: 1;
  min-width: 0;
}

.page-title {
  font-size: var(--text-3xl, 28px);
  font-weight: 700;
  color: var(--text-main);
  margin: 0 0 20px;
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 80px;
}

/* ── success banner ─────────────────────────── */
.success-banner {
  display: flex;
  align-items: center;
  gap: 20px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: var(--radius-card);
  padding: 20px 24px;
}

.success-icon {
  position: relative;
  width: 72px;
  height: 72px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.check-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #34c759;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(52, 199, 89, 0.3);
  animation: pop-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@keyframes pop-in {
  from { transform: scale(0.2); opacity: 0; }
  to   { transform: scale(1);   opacity: 1; }
}

.check-path {
  stroke-dasharray: 50;
  stroke-dashoffset: 50;
  animation: draw-check 0.3s ease 0.38s forwards;
}

@keyframes draw-check {
  to { stroke-dashoffset: 0; }
}

.spark {
  position: absolute;
  font-size: 14px;
  color: #34c759;
  animation: spark-pop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
.spark--tl { top: 0;    left: 2px;  animation-delay: 0.5s; }
.spark--tr { top: 0;    right: 0;   animation-delay: 0.6s; color: #f4b400; }
.spark--bl { bottom: 2px; left: 6px; animation-delay: 0.65s; color: #f4b400; font-size: 16px; }
.spark--br { bottom: 0;  right: 2px; animation-delay: 0.55s; }

@keyframes spark-pop {
  from { transform: scale(0) rotate(-20deg); opacity: 0; }
  to   { transform: scale(1) rotate(0deg);   opacity: 1; }
}

.success-text { flex: 1; }

.success-title {
  margin: 0 0 4px;
  font-size: 20px;
  font-weight: 700;
  color: #15803d;
}

.success-sub {
  margin: 0;
  font-size: 14px;
  color: #166534;
}

/* ── review card ────────────────────────────── */
.review-card {
  background: var(--bg-card);
  border-radius: var(--radius-card);
  overflow: hidden;
}

.review-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 24px;
  border-bottom: 1px solid var(--border);
  background: #fafbfc;
}

.review-card__step {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-main);
  letter-spacing: 0.01em;
}

.review-card__title-with-tooltip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.bid-ceiling-title-tooltip {
  position: relative;
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
}

.bid-ceiling-title-tooltip__bubble {
  display: none;
  position: absolute;
  left: 50%;
  top: calc(100% + 8px);
  transform: translateX(-50%);
  background: #1c1f23;
  color: #fff;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.55;
  padding: 10px 14px;
  border-radius: 6px;
  width: min(320px, calc(100vw - 48px));
  max-width: 90vw;
  z-index: 30;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.18);
  pointer-events: none;
}

.bid-ceiling-title-tooltip__bubble::before {
  content: '';
  position: absolute;
  left: 50%;
  top: -6px;
  transform: translateX(-50%);
  border-width: 0 6px 6px 6px;
  border-style: solid;
  border-color: transparent transparent #1c1f23 transparent;
}

.bid-ceiling-title-tooltip:hover .bid-ceiling-title-tooltip__bubble {
  display: block;
}

.help-icon-trigger--sm {
  display: block;
  opacity: 0.55;
  cursor: help;
  vertical-align: middle;
}

.bid-ceiling-title-tooltip:hover .help-icon-trigger--sm {
  opacity: 0.9;
}

.review-card__edit {
  background: none;
  border: none;
  color: #1876ff;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  font-family: inherit;
}
.review-card__edit:hover { opacity: 0.75; }

.review-card__body {
  padding: 20px 24px;
}

.review-card__body--flush {
  padding-top: 16px;
}

.bid-ceiling-base {
  margin: 0 0 12px;
  font-size: 14px;
  color: var(--text-main);
}

.bid-ceiling-base strong {
  font-weight: 600;
}

.bid-ceiling-empty {
  margin: 0;
  font-size: 14px;
  color: var(--text-sub);
}

.bid-cap-scroll {
  overflow-x: auto;
  margin: 0 -4px;
  padding: 0 4px;
}

.bid-cap-table {
  width: 100%;
  min-width: 480px;
  border-collapse: collapse;
  font-size: 13px;
}

.bid-cap-table th,
.bid-cap-table td {
  text-align: left;
  padding: 10px 12px;
  border-bottom: 1px solid var(--border);
  vertical-align: middle;
}

.bid-cap-table th {
  font-weight: 600;
  color: var(--text-sub);
  font-size: 12px;
  background: #fafbfc;
}

.bid-cap-table tbody tr:last-child td {
  border-bottom: none;
}

.bid-cap-table tbody tr.is-off td {
  color: var(--text-sub);
}

.bid-cap-table .muted {
  font-weight: 400;
  color: var(--text-sub);
}

.bid-cap-table--single {
  min-width: 320px;
}

/* ── key-value grid ─────────────────────────── */
.kv-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px 24px;
  margin: 0;
}

.kv-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.kv-item dt {
  font-size: 12px;
  color: var(--text-sub);
  font-weight: 500;
  letter-spacing: 0.01em;
}

.kv-item dd {
  margin: 0;
  font-size: 14px;
  color: var(--text-main);
  font-weight: 500;
  word-break: break-word;
}

/* ── back to list ───────────────────────────── */
.back-to-list {
  display: flex;
  justify-content: flex-end;
  padding: 8px 0 16px;
}

.back-to-list__btn {
  background: none;
  border: none;
  color: #1876ff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  padding: 6px 12px;
  font-family: inherit;
  border-radius: var(--radius-sm);
  transition: opacity 0.15s;
}

.back-to-list__btn:hover {
  opacity: 0.75;
}

/* ── transition ─────────────────────────────── */
.fade-enter-active { transition: opacity 0.4s, transform 0.4s; }
.fade-enter-from   { opacity: 0; transform: translateY(-8px); }
</style>
