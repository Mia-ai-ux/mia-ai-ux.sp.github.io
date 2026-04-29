<template>
  <div class="page-layout">
    <div class="page-center">
      <Stepper
        :steps="steps"
        :current-step="getStepNumber('/sb/negative')"
        :active-sub-item="activeSubItem"
      />

      <div class="content-wrapper">
        <h2 class="page-title">Negative（optional）</h2>
        <main class="main-content">

          <!-- Negative Keyword Section -->
          <section id="section-negative-keyword" class="card">
            <h3 class="section-title">
              Negative keyword
              <span class="help-wrap">
                <img :src="iconHelpCircle" alt="" width="16" height="16" class="help-icon" />
                <span class="help-tooltip">Add negative keywords to prevent your ads from showing for irrelevant searches.</span>
              </span>
            </h3>

            <div class="input-area">
              <div class="match-type-row">
                <span class="match-label">Match type</span>
                <label class="radio-label">
                  <input v-model="negativeMatchType" type="radio" value="Negative Exact" />
                  Negative exact
                </label>
                <label class="radio-label">
                  <input v-model="negativeMatchType" type="radio" value="Negative Phrase" />
                  Negative phrase
                </label>
              </div>
              <textarea
                v-model="negativeKeywordText"
                class="keyword-textarea"
                placeholder="Enter keywords separated by new line"
                rows="6"
              />
              <div class="action-row">
                <UiButton size="sm" @click="addNegativeKeywords">Add keywords</UiButton>
              </div>
            </div>

            <div v-if="form.negativeKeywords.length > 0" class="added-list">
              <div class="list-header">
                <span>{{ form.negativeKeywords.length }} added</span>
                <button type="button" class="remove-all-btn" @click="form.negativeKeywords = []">Remove all</button>
              </div>
              <div v-for="kw in form.negativeKeywords" :key="kw.id" class="added-item">
                <span class="item-text">{{ kw.keyword }}</span>
                <span class="item-match">{{ kw.matchType }}</span>
                <button type="button" class="item-remove" @click="removeNegativeKeyword(kw.id)">×</button>
              </div>
            </div>
          </section>

          <!-- Exclude Products Section -->
          <section id="section-negative-product" class="card">
            <h3 class="section-title">
              Exclude products
              <span class="help-wrap">
                <img :src="iconHelpCircle" alt="" width="16" height="16" class="help-icon" />
                <span class="help-tooltip">Exclude specific products to prevent your ads from appearing on those product pages.</span>
              </span>
            </h3>

            <div class="input-area">
              <textarea
                v-model="excludeProductText"
                class="keyword-textarea"
                placeholder="Enter ASIN separated by new line"
                rows="6"
              />
              <div class="action-row">
                <UiButton size="sm" @click="addExcludedProducts">Add products</UiButton>
              </div>
            </div>

            <div v-if="form.excludedProducts.length > 0" class="added-list">
              <div class="list-header">
                <span>{{ form.excludedProducts.length }} added</span>
                <button type="button" class="remove-all-btn" @click="form.excludedProducts = []">Remove all</button>
              </div>
              <div v-for="p in form.excludedProducts" :key="p.id" class="added-item">
                <span class="item-text">{{ p.asin }}</span>
                <button type="button" class="item-remove" @click="removeExcludedProduct(p.id)">×</button>
              </div>
            </div>
          </section>

          <!-- Exclude Brands Section -->
          <section id="section-negative-brand" class="card">
            <h3 class="section-title">
              Exclude brands
              <span class="help-wrap">
                <img :src="iconHelpCircle" alt="" width="16" height="16" class="help-icon" />
                <span class="help-tooltip">Exclude specific brands to prevent your ads from appearing on those brand pages.</span>
              </span>
            </h3>

            <div class="brand-search">
              <input
                v-model="brandSearchQuery"
                type="text"
                placeholder="Search by brand name"
                class="search-input"
              />
            </div>

            <div class="brand-grid">
              <div class="brand-list">
                <div
                  v-for="brand in filteredBrands"
                  :key="brand.id"
                  class="brand-row"
                  :class="{ selected: isBrandExcluded(brand.id) }"
                >
                  <span class="brand-name">{{ brand.name }}</span>
                  <button type="button" class="brand-btn" @click="toggleBrand(brand)">
                    {{ isBrandExcluded(brand.id) ? 'Added' : 'Exclude' }}
                  </button>
                </div>
              </div>

              <div class="brand-added">
                <div class="list-header">
                  <span>{{ form.excludedBrands.length }} added</span>
                  <button
                    v-if="form.excludedBrands.length > 0"
                    type="button"
                    class="remove-all-btn"
                    @click="form.excludedBrands = []"
                  >
                    Remove all
                  </button>
                </div>
                <div v-for="brand in form.excludedBrands" :key="brand.id" class="added-item">
                  <span class="item-text">{{ brand.name }}</span>
                  <button type="button" class="item-remove" @click="removeExcludedBrand(brand.id)">×</button>
                </div>
              </div>
            </div>
          </section>

        </main>
      </div>
    </div>
  </div>

  <BottomBar show-back @cancel="onCancel" @back="onBack" @next="onNext" />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useSbStore } from '@/stores/sb'
import Stepper from '@/components/Stepper.vue'
import BottomBar from '@/components/BottomBar.vue'
import UiButton from '@/components/ui/button/Button.vue'
import { useSbFlowSteps } from '@/composables/useSbFlowSteps'
import iconHelpCircle from '@/assets/icon-help-circle.svg'

const router = useRouter()
const { steps, getStepNumber, getNextPath, getBackPath } = useSbFlowSteps()
const { form } = storeToRefs(useSbStore())

const negativeSubItems = [
  { label: 'Negative keyword', anchorId: 'section-negative-keyword' },
  { label: 'Exclude products', anchorId: 'section-negative-product' },
  { label: 'Exclude brands', anchorId: 'section-negative-brand' }
]

const activeSubItem = ref('Negative keyword')

let observer = null
onMounted(() => {
  const sectionEls = negativeSubItems
    .map(s => ({ label: s.label, el: document.getElementById(s.anchorId) }))
    .filter(s => s.el)

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const matched = sectionEls.find(s => s.el === entry.target)
          if (matched) activeSubItem.value = matched.label
        }
      }
    },
    { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
  )
  sectionEls.forEach(s => observer.observe(s.el))
})

onUnmounted(() => {
  observer?.disconnect()
})

// Negative keywords
const negativeKeywordText = ref('')
const negativeMatchType = ref('Negative Exact')

function addNegativeKeywords() {
  const lines = negativeKeywordText.value.split('\n').map(l => l.trim()).filter(Boolean)
  for (const keyword of lines) {
    const exists = form.value.negativeKeywords.some(
      k => k.keyword.toLowerCase() === keyword.toLowerCase() && k.matchType === negativeMatchType.value
    )
    if (!exists) {
      form.value.negativeKeywords.push({
        id: `nk-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        keyword,
        matchType: negativeMatchType.value
      })
    }
  }
  negativeKeywordText.value = ''
}

function removeNegativeKeyword(id) {
  form.value.negativeKeywords = form.value.negativeKeywords.filter(k => k.id !== id)
}

// Excluded products
const excludeProductText = ref('')

function addExcludedProducts() {
  const lines = excludeProductText.value.split('\n').map(l => l.trim().toUpperCase()).filter(Boolean)
  for (const asin of lines) {
    const exists = form.value.excludedProducts.some(p => p.asin === asin)
    if (!exists) {
      form.value.excludedProducts.push({
        id: `ep-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        asin,
        title: '',
        image: ''
      })
    }
  }
  excludeProductText.value = ''
}

function removeExcludedProduct(id) {
  form.value.excludedProducts = form.value.excludedProducts.filter(p => p.id !== id)
}

// Excluded brands
const brandSearchQuery = ref('')

const MOCK_BRANDS = [
  { id: 'brand-dreo', name: 'DREO' },
  { id: 'brand-vornado', name: 'Vornado' },
  { id: 'brand-lasko', name: 'Lasko' },
  { id: 'brand-delonghi', name: "De'Longhi" },
  { id: 'brand-givebest', name: 'GiveBest' },
  { id: 'brand-honeywell', name: 'Honeywell' },
  { id: 'brand-pelonis', name: 'PELONIS' },
  { id: 'brand-kismile', name: 'Kismile' },
]

const filteredBrands = computed(() => {
  const q = brandSearchQuery.value.trim().toLowerCase()
  if (!q) return MOCK_BRANDS
  return MOCK_BRANDS.filter(b => b.name.toLowerCase().includes(q))
})

function isBrandExcluded(id) {
  return form.value.excludedBrands.some(b => b.id === id)
}

function toggleBrand(brand) {
  if (isBrandExcluded(brand.id)) {
    form.value.excludedBrands = form.value.excludedBrands.filter(b => b.id !== brand.id)
  } else {
    form.value.excludedBrands.push({ ...brand })
  }
}

function removeExcludedBrand(id) {
  form.value.excludedBrands = form.value.excludedBrands.filter(b => b.id !== id)
}

function onCancel() { router.push('/') }
function onBack()   { router.push(getBackPath('/sb/negative')) }
function onNext()   { router.push(getNextPath('/sb/negative')) }
</script>

<style scoped>
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
  display: flex;
  flex-direction: column;
}

.page-title {
  font-size: var(--text-3xl, 28px);
  font-weight: 700;
  color: var(--text-main);
  margin: 0 0 20px;
  padding: 0;
}

.main-content {
  flex: 1;
  min-width: 0;
  margin: 0;
  padding-bottom: 80px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.card {
  background: var(--bg-card);
  border-radius: var(--radius-card);
  padding: 28px 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-title {
  font-size: var(--text-2xl, 22px);
  font-weight: 600;
  color: var(--text-main);
  margin: 0;
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.help-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: default;
}

.help-icon {
  display: block;
  opacity: 0.5;
  transition: opacity 0.15s;
}

.help-wrap:hover .help-icon { opacity: 1; }

.help-tooltip {
  display: none;
  position: absolute;
  left: 50%;
  bottom: calc(100% + 6px);
  transform: translateX(-50%);
  background: #1e293b;
  color: #f8fafc;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.5;
  padding: 8px 12px;
  border-radius: 6px;
  width: 240px;
  white-space: normal;
  pointer-events: none;
  z-index: 100;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.help-wrap:hover .help-tooltip { display: block; }

.input-area {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.match-type-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px 18px;
}

.match-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-sub);
}

.radio-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-main);
  cursor: pointer;
}

.radio-label input {
  width: 14px;
  height: 14px;
  accent-color: var(--primary);
  cursor: pointer;
}

.keyword-textarea {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 10px 12px;
  font-family: inherit;
  font-size: var(--text-base, 14px);
  color: #111;
  resize: vertical;
  outline: none;
  line-height: 1.6;
  transition: border-color 0.15s;
}

.keyword-textarea:focus {
  border-color: var(--primary);
}

.action-row {
  display: flex;
  justify-content: flex-end;
}

.added-list {
  border: 1px solid var(--border);
  border-radius: var(--radius-md, 8px);
  overflow: hidden;
}

.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: var(--gray-50, #f8fafc);
  border-bottom: 1px solid var(--border);
  font-size: var(--text-sm, 13px);
  font-weight: 500;
  color: var(--text-main);
}

.remove-all-btn {
  background: none;
  border: none;
  color: var(--text-sub);
  font-size: 13px;
  cursor: pointer;
  padding: 0;
  font-family: inherit;
  transition: color 0.15s;
}

.remove-all-btn:hover { color: var(--color-danger); }

.added-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-bottom: 1px solid var(--border);
  font-size: var(--text-sm, 13px);
}

.added-item:last-child { border-bottom: none; }

.item-text {
  flex: 1;
  min-width: 0;
  color: var(--text-main);
}

.item-match {
  padding: 2px 8px;
  background: var(--gray-100, #f1f5f9);
  border-radius: 4px;
  font-size: var(--text-xs, 11px);
  color: var(--text-sub);
}

.item-remove {
  padding: 4px 8px;
  background: none;
  border: none;
  color: var(--text-hint);
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  border-radius: 4px;
  transition: color 0.15s;
}

.item-remove:hover { color: var(--color-danger); }

.brand-search {
  margin-bottom: 12px;
}

.search-input {
  width: 100%;
  max-width: 400px;
  height: 36px;
  border: 1px solid #d0d5dd;
  border-radius: 6px;
  padding: 0 12px;
  font-size: 14px;
  font-family: inherit;
  color: #111;
  background: #fff;
  box-sizing: border-box;
  outline: none;
  transition: border-color 0.15s;
}

.search-input:focus { border-color: var(--primary); }

.brand-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.brand-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.brand-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-radius: 4px;
  background: var(--gray-50, #f8fafc);
  transition: background 0.15s;
}

.brand-row:hover:not(.selected) { background: var(--gray-100, #f1f5f9); }

.brand-row.selected {
  background: #fff;
  border: 1px solid var(--primary);
}

.brand-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-main);
}

.brand-btn {
  background: none;
  border: none;
  color: var(--primary);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  font-family: inherit;
}

.brand-added {
  border: 1px solid var(--border);
  border-radius: var(--radius-md, 8px);
  overflow: hidden;
}
</style>
