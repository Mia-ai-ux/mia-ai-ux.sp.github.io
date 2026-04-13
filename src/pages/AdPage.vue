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
                  <dt>Ad type</dt>
                  <dd>SP {{ form.targeting === 'auto' ? 'Auto' : 'Manual' }}</dd>
                </div>
                <div class="kv-item">
                  <dt>Daily budget</dt>
                  <dd>${{ Number(form.dailyBudget).toFixed(2) }}</dd>
                </div>
                <div class="kv-item">
                  <dt>Schedule</dt>
                  <dd>{{ form.startTime || '—' }} ~ {{ form.endTime || 'No end date' }}</dd>
                </div>
                <div class="kv-item">
                  <dt>Bidding strategy</dt>
                  <dd>{{ bidModeLabel }}</dd>
                </div>
                <div class="kv-item">
                  <dt>Targeting type</dt>
                  <dd>{{ form.targeting === 'auto' ? 'Automatic' : 'Manual' }}</dd>
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
                <div class="kv-item">
                  <dt>Default bid</dt>
                  <dd>${{ Number(form.adGroupBid).toFixed(2) }}</dd>
                </div>
                <div class="kv-item">
                  <dt>Products</dt>
                  <dd>{{ form.products.length }} selected</dd>
                </div>
                <template v-if="form.targeting === 'auto'">
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
                  <dt>Default bid</dt>
                  <dd>${{ Number(form.keywordTargetingDefaultBid).toFixed(2) }}</dd>
                </div>
                <div class="kv-item">
                  <dt>Match types</dt>
                  <dd>{{ activeMatchTypes }}</dd>
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

const router   = useRouter()
const { steps, getStepNumber, getBackPath } = useFlowSteps()
const store    = useCampaignStore()
const { form } = storeToRefs(store)

const submitting = ref(false)
const launched   = ref(false)

const maxStep = computed(() => Math.max(...steps.value.map(s => s.step)))

// ── Derived labels ─────────────────────────────────────────────

const bidModeLabel = computed(() => {
  const map = { fixed: 'Fixed bids', dynamic_up: 'Dynamic bids – up and down', dynamic_down: 'Dynamic bids – down only' }
  return map[form.value.bidMode] ?? form.value.bidMode
})

const enabledAutoGroups = computed(() => {
  const g = form.value.autoGroups
  const names = []
  if (g.closeMatch?.enabled)  names.push('Close match')
  if (g.looseMatch?.enabled)  names.push('Loose match')
  if (g.substitutes?.enabled) names.push('Substitutes')
  if (g.complements?.enabled) names.push('Complements')
  return names.length ? names.join(', ') : 'None'
})

const activeMatchTypes = computed(() => {
  const m = form.value.keywordTargetingMatchTypes
  const names = []
  if (m?.exact)  names.push('Exact')
  if (m?.broad)  names.push('Broad')
  if (m?.phrase) names.push('Phrase')
  return names.length ? names.join(', ') : '—'
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
  width: var(--content-width, 70vw);
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
  text-transform: uppercase;
  letter-spacing: 0.04em;
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
