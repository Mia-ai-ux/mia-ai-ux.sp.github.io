<template>
  <div class="page-layout">
    <div class="page-center">
      <Stepper :steps="steps" :current-step="getStepNumber('/negative-targeting')" />

      <div class="content-wrapper">
        <h2 class="page-title">Negative Targeting</h2>
        <main class="main-content">

          <!-- ── Negative Keyword ── -->
          <section class="card" id="section-negative-keyword">
            <!-- Row 1: 标题 + 问号图标 -->
            <h3 class="section-title">
              Negative keyword
              <span class="help-wrap">
                <img :src="iconHelpCircle" alt="" width="16" height="16" class="help-icon" />
                <span class="help-tooltip">Add negative keywords to prevent your ads from showing for irrelevant searches.</span>
              </span>
            </h3>

            <!-- Row 3: + Add keyword | Remove all -->
            <div class="toolbar-row">
              <button class="add-link-btn" type="button" @click="addRow">+ Add keyword</button>
              <button
                v-if="form.negativeKeywords.length > 0"
                class="remove-all-btn"
                type="button"
                @click="removeAll"
              >
                Remove all
              </button>
            </div>

            <!-- Row 4: 表格（有数据时显示） -->
            <div v-if="form.negativeKeywords.length > 0" class="kw-table-wrap">
              <table class="kw-table">
                <thead>
                  <tr>
                    <th class="col-kw">Keyword</th>
                    <th class="col-match">Match type</th>
                    <th class="col-action"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in form.negativeKeywords" :key="row.id">
                    <td class="col-kw">
                      <input
                        v-model="row.keyword"
                        class="kw-input"
                        type="text"
                        placeholder="Enter Negative keyword"
                      />
                    </td>
                    <td class="col-match">
                      <div class="match-select-wrap">
                        <select v-model="row.matchType" class="match-select">
                          <option value="Exact">Exact</option>
                          <option value="Phrase">Phrase</option>
                        </select>
                        <svg class="select-chevron" width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </div>
                    </td>
                    <td class="col-action">
                      <button class="delete-btn" type="button" @click="removeRow(row.id)">Delete</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <!-- ── Exclude Products ── -->
          <section class="card ep-card" id="section-negative-product">
            <h3 class="section-title">
              Exclude products
              <span class="help-wrap">
                <img :src="iconHelpCircle" alt="" width="16" height="16" class="help-icon" />
                <span class="help-tooltip">Exclude specific products to prevent your ads from appearing on those product pages.</span>
              </span>
            </h3>

            <div class="ep-body">
              <!-- Left: Search panel -->
              <div class="ep-left">
                <div class="ep-search-bar">
                  <input
                    v-model="searchQuery"
                    class="ep-search"
                    type="text"
                    placeholder="Search by product name or ASIN"
                  />
                  <button class="ep-search-btn" type="button">Search</button>
                </div>
                <div class="ep-results">
                  <div
                    v-for="product in filteredProducts"
                    :key="product.id"
                    class="ep-product-row"
                    :class="{ selected: isExcluded(product.id) }"
                    @click="toggleProduct(product)"
                  >
                    <div class="ep-product-card">
                      <div class="ep-thumb">
                        <div class="ep-thumb-bg"></div>
                        <img class="ep-thumb-img" :src="product.image" :alt="product.title" />
                      </div>
                      <div class="ep-info">
                        <p class="ep-title">{{ product.title }}</p>
                        <div class="ep-meta">
                          <span class="ep-stars">
                            <svg v-for="i in 5" :key="i" :width="11" :height="11" viewBox="0 0 12 12" :fill="i <= roundRating(product.rating) ? '#f5a623' : '#e0e0e0'">
                              <path d="M6 1l1.3 2.6 2.9.4-2.1 2 .5 2.9L6 7.5l-2.6 1.4.5-2.9-2.1-2 2.9-.4z"/>
                            </svg>
                          </span>
                          <span class="ep-reviews">({{ product.reviews.toLocaleString() }})</span>
                          <span class="ep-sep">|</span>
                          <span class="ep-orig-price">{{ product.originalPrice }}</span>
                          <span class="ep-price">{{ product.price }}</span>
                          <span class="ep-sep">|</span>
                          <span class="ep-stock">In stock</span>
                          <span class="ep-sep">|</span>
                          <span class="ep-asin">ASIN：{{ product.asin }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="ep-checkbox" :class="{ checked: isExcluded(product.id) }">
                      <svg v-if="isExcluded(product.id)" width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M1.5 5l2.5 2.5 4.5-5" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </div>
                  </div>
                  <p v-if="filteredProducts.length === 0" class="ep-empty">No products found.</p>
                </div>
              </div>

              <!-- Right: Added panel -->
              <div class="ep-right">
                <div class="ep-right-header">
                  <span class="ep-added-count">{{ form.excludedProducts.length }} added</span>
                  <button v-if="form.excludedProducts.length > 0" class="ep-remove-all" type="button" @click="removeAllProducts">Remove all</button>
                </div>
                <div class="ep-added-list">
                  <div v-for="product in form.excludedProducts" :key="product.id" class="ep-added-row">
                    <div class="ep-product-card">
                      <div class="ep-thumb">
                        <div class="ep-thumb-bg"></div>
                        <img class="ep-thumb-img" :src="product.image" :alt="product.title" />
                      </div>
                      <div class="ep-info">
                        <p class="ep-title">{{ product.title }}</p>
                        <div class="ep-meta">
                          <span class="ep-stars">
                            <svg v-for="i in 5" :key="i" :width="11" :height="11" viewBox="0 0 12 12" :fill="i <= roundRating(product.rating) ? '#f5a623' : '#e0e0e0'">
                              <path d="M6 1l1.3 2.6 2.9.4-2.1 2 .5 2.9L6 7.5l-2.6 1.4.5-2.9-2.1-2 2.9-.4z"/>
                            </svg>
                          </span>
                          <span class="ep-reviews">({{ product.reviews.toLocaleString() }})</span>
                          <span class="ep-sep">|</span>
                          <span class="ep-orig-price">{{ product.originalPrice }}</span>
                          <span class="ep-price">{{ product.price }}</span>
                          <span class="ep-sep">|</span>
                          <span class="ep-stock">In stock</span>
                          <span class="ep-sep">|</span>
                          <span class="ep-asin">ASIN：{{ product.asin }}</span>
                        </div>
                      </div>
                    </div>
                    <button class="ep-delete" type="button" @click="removeProduct(product.id)">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
                      </svg>
                    </button>
                  </div>
                  <p v-if="form.excludedProducts.length === 0" class="ep-empty-right">No excluded products yet.</p>
                </div>
              </div>
            </div>
          </section>

          <!-- ── Exclude Brands ── -->
          <section class="card ep-card" id="section-negative-brand">
            <h3 class="section-title">
              Exclude brands
              <span class="help-wrap">
                <img :src="iconHelpCircle" alt="" width="16" height="16" class="help-icon" />
                <span class="help-tooltip">Exclude specific brands to prevent your ads from appearing on those brand pages.</span>
              </span>
            </h3>

            <div class="ep-body">
              <!-- Left: Search panel -->
              <div class="ep-left">
                <div class="ep-search-bar">
                  <input
                    v-model="brandSearchQuery"
                    class="ep-search"
                    type="text"
                    placeholder="Search by brand name"
                  />
                  <button class="ep-search-btn" type="button">Search</button>
                </div>
                <div class="ep-results">
                  <div
                    v-for="brand in filteredBrands"
                    :key="brand.id"
                    class="eb-brand-row"
                    :class="{ selected: isBrandExcluded(brand.id) }"
                  >
                    <span class="eb-brand-name">{{ brand.name }}</span>
                    <button
                      class="eb-exclude-btn"
                      type="button"
                      @click="toggleBrand(brand)"
                    >
                      {{ isBrandExcluded(brand.id) ? 'Added' : 'Exclude' }}
                    </button>
                  </div>
                  <p v-if="filteredBrands.length === 0" class="ep-empty">No brands found.</p>
                </div>
              </div>

              <!-- Right: Added panel -->
              <div class="ep-right">
                <div class="ep-right-header">
                  <span class="ep-added-count">{{ form.excludedBrands.length }} added</span>
                  <button v-if="form.excludedBrands.length > 0" class="ep-remove-all" type="button" @click="removeAllBrands">Remove all</button>
                </div>
                <div class="ep-added-list">
                  <div v-for="brand in form.excludedBrands" :key="brand.id" class="eb-added-row">
                    <span class="eb-brand-name">{{ brand.name }}</span>
                    <button class="eb-close-btn" type="button" @click="removeBrand(brand.id)">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M2 2l10 10M12 2L2 12"/>
                      </svg>
                    </button>
                  </div>
                  <p v-if="form.excludedBrands.length === 0" class="ep-empty-right">No excluded brands yet.</p>
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useCampaignStore } from '@/stores/campaign'
import Stepper from '@/components/Stepper.vue'
import BottomBar from '@/components/BottomBar.vue'
import { useFlowSteps } from '@/composables/useFlowSteps'
import iconHelpCircle from '@/assets/icon-help-circle.svg'

const router = useRouter()
const { steps, getStepNumber, getNextPath, getBackPath } = useFlowSteps()
const { form } = storeToRefs(useCampaignStore())

// ── Negative Keyword ──
function addRow() {
  form.value.negativeKeywords.push({ id: Date.now() + Math.random(), keyword: '', matchType: 'Exact' })
}
function removeRow(id) {
  form.value.negativeKeywords = form.value.negativeKeywords.filter(r => r.id !== id)
}
function removeAll() {
  form.value.negativeKeywords = []
}

// ── Exclude Products ──
const MOCK_PRODUCTS = [
  { id: 'B0C5CV8CTW', image: 'https://m.media-amazon.com/images/I/81G+4gzszVL._AC_SY879_.jpg', title: 'Dreo Ceramic Heater, 2025 Winter Mode, Small, Electric Stove, Automatic Temperature Adjustment and Timer Function, Fall Off, Overheating Protection, Memory Function, 1,200 W/1,000 W/800 W, Power, Eco', rating: 4.5, reviews: 16346, originalPrice: 'US$41.22', price: 'US$39.25', asin: 'B0C5CV8CTW' },
  { id: 'B09XK2DTVP', image: 'https://m.media-amazon.com/images/I/71pB9RvWyRL._AC_SL1500_.jpg', title: 'Vornado MVH Vortex Heater with 3 Heat Settings, Fan Circulator, Auto Climate Control, and Safety Tip-Over Protection', rating: 4.4, reviews: 8921, originalPrice: 'US$59.99', price: 'US$49.99', asin: 'B09XK2DTVP' },
  { id: 'B08BDRG9WR', image: 'https://m.media-amazon.com/images/I/71zb9zUZLKL._AC_SL1500_.jpg', title: 'Lasko 5775 Electric 1500W Bathroom Space Heater with Fan & Adjustable Thermostat for Home', rating: 4.3, reviews: 12450, originalPrice: 'US$45.00', price: 'US$38.99', asin: 'B08BDRG9WR' },
  { id: 'B07WNKRP8V', image: 'https://m.media-amazon.com/images/I/61e7RvINXUL._AC_SL1500_.jpg', title: 'De\'Longhi Ceramic Tower Heater, Full Room Quiet 1500W, Adjustable Thermostat, 3 Heat Settings, Energy Saving Mode, Remote Control', rating: 4.5, reviews: 5320, originalPrice: 'US$89.99', price: 'US$74.99', asin: 'B07WNKRP8V' },
  { id: 'B09G9TQ71Z', image: 'https://m.media-amazon.com/images/I/71Q9U8RBCBL._AC_SL1500_.jpg', title: 'GiveBest Portable Electric Space Heater, 1500W/750W ETL Certified Ceramic Heater with Thermostat, Safe Plug-in Wall Heater with Overheat Protection', rating: 4.2, reviews: 9876, originalPrice: 'US$29.99', price: 'US$24.99', asin: 'B09G9TQ71Z' },
]

const searchQuery = ref('')

const filteredProducts = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return MOCK_PRODUCTS
  return MOCK_PRODUCTS.filter(p =>
    p.title.toLowerCase().includes(q) || p.asin.toLowerCase().includes(q)
  )
})

function isExcluded(id) {
  return form.value.excludedProducts.some(p => p.id === id)
}

function toggleProduct(product) {
  if (isExcluded(product.id)) {
    form.value.excludedProducts = form.value.excludedProducts.filter(p => p.id !== product.id)
  } else {
    form.value.excludedProducts.push({ ...product })
  }
}

function removeProduct(id) {
  form.value.excludedProducts = form.value.excludedProducts.filter(p => p.id !== id)
}

function removeAllProducts() {
  form.value.excludedProducts = []
}

function roundRating(r) { return Math.round(r) }

// ── Exclude Brands ──
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

const brandSearchQuery = ref('')

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

function removeBrand(id) {
  form.value.excludedBrands = form.value.excludedBrands.filter(b => b.id !== id)
}

function removeAllBrands() {
  form.value.excludedBrands = []
}

function onCancel() { router.push('/') }
function onBack()   { router.push(getBackPath('/negative-targeting')) }
function onNext()   { router.push(getNextPath('/negative-targeting')) }
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
  width: var(--content-width, 70vw);
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

/* ── Card ── */
.card {
  background: var(--bg-card);
  border-radius: var(--radius-card);
  padding: 28px 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ── Toolbar row ── */
.toolbar-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: -8px;
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


.remove-all-btn {
  background: none;
  border: none;
  color: var(--primary);
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  padding: 4px 0;
  font-family: inherit;
  transition: opacity 0.15s;
}

.remove-all-btn:hover { opacity: 0.7; }

/* ── Table (shadcn style) ── */
.kw-table-wrap {
  width: 100%;
  overflow: hidden;
}

.kw-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  caption-side: bottom;
}

.kw-table thead tr {
  background: #f8f9fb;
  border-bottom: 1px solid #e2e8f0;
}

.kw-table th {
  height: 48px;
  padding: 0 16px;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  vertical-align: middle;
}

.kw-table td {
  padding: 12px 16px;
  font-size: 16px;
  color: #0f172a;
  vertical-align: middle;
  border-bottom: 1px solid #f1f5f9;
}

.kw-table tbody tr:last-child td { border-bottom: none; }
.kw-table tbody tr:hover { background: rgba(0,0,0,0.025); }

.col-kw     { width: auto; }
.col-match  { width: 140px; }
.col-action { width: 72px; text-align: right; }

/* ── Keyword input ── */
.kw-input {
  width: 100%;
  height: 36px;
  border: none;
  padding: 0 4px;
  font-size: 16px;
  font-family: inherit;
  color: #111;
  background: transparent;
  box-sizing: border-box;
  outline: none;
}

.kw-input::placeholder { color: #c0c8d8; }

/* ── Match type select ── */
.match-select-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.match-select {
  appearance: none;
  height: 32px;
  border: none;
  padding: 0 24px 0 0;
  font-size: 16px;
  font-family: inherit;
  color: #374151;
  background: transparent;
  outline: none;
  cursor: pointer;
}

.select-chevron {
  position: absolute;
  right: 0;
  pointer-events: none;
  color: #94a3b8;
}

/* ── Delete button ── */
.delete-btn {
  background: none;
  border: none;
  color: #1876ff;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  font-family: inherit;
  transition: opacity 0.15s;
}

.delete-btn:hover { opacity: 0.65; }

/* ── Help icon + tooltip ── */
.help-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
  margin-left: 2px;
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

.help-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-top-color: #1e293b;
}

.help-wrap:hover .help-tooltip { display: block; }

/* ── Add link button ── */
.add-link-btn {
  background: none;
  border: none;
  color: #1876ff;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  font-family: inherit;
  align-self: flex-start;
  transition: opacity 0.15s;
}

.add-link-btn:hover { opacity: 0.7; }

/* ── Exclude Products ── */
.ep-card { gap: 16px; }

.ep-body {
  /* 商品 / 品牌列表卡片与缩略图底：与设计稿一致 */
  --ep-list-surface: #f8f8f8;
  --ep-list-hover: #f0f0f0;
  display: flex;
  gap: 0;
  min-height: 400px;
  overflow: hidden;
}

/* Left panel */
.ep-left {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e2e8f0;
}

.ep-search-bar {
  display: flex;
  align-items: center;
  gap: 0;
  padding: 8px 14px;
  border-top: 1px solid #e2e8f0;
}

.ep-search {
  flex: 1;
  min-width: 0;
  height: 36px;
  border: 1px solid #d0d5dd;
  border-radius: 3px 0 0 3px;
  padding: 0 12px;
  font-size: 14px;
  font-family: inherit;
  color: #111;
  background: #fff;
  box-sizing: border-box;
  outline: none;
  transition: border-color 0.15s;
}

.ep-search:focus { border-color: #1876ff; }
.ep-search::placeholder { color: #b0bac8; }

.ep-search-btn {
  height: 36px;
  padding: 0 18px;
  border: 1px solid #1876ff;
  border-left: none;
  border-radius: 0 3px 3px 0;
  background: #1876ff;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s;
}

.ep-search-btn:hover { background: #0f5fd4; }

.ep-results {
  flex: 1;
  overflow-y: auto;
}

.ep-product-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  margin: 12px 14px 0;
  border-radius: 4px;
  border: 1px solid transparent;
  background: var(--ep-list-surface);
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}
.ep-product-row:first-child { margin-top: 12px; }
.ep-product-row:hover { background: var(--ep-list-hover); }
.ep-product-row.selected {
  background: #fff;
  border-color: var(--selected-border);
}

/* Right panel */
.ep-right {
  width: 45%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
}

.ep-right-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-top: 1px solid #e2e8f0;
  min-height: 43px;
}

.ep-added-count {
  font-size: 20px;
  color: #272b36;
  font-weight: 600;
}

.ep-remove-all {
  background: none;
  border: none;
  color: #1876ff;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  font-family: inherit;
  transition: opacity 0.15s;
}

.ep-remove-all:hover { opacity: 0.7; }

.ep-added-list {
  flex: 1;
  overflow-y: auto;
}

.ep-added-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  margin: 12px 14px 0;
  border-radius: 4px;
  border: 1px solid transparent;
  background: var(--ep-list-surface);
}

/* Product card shared */
.ep-product-card {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  flex: 1;
  min-width: 0;
}

.ep-thumb {
  position: relative;
  width: 56px;
  height: 56px;
  flex-shrink: 0;
  border-radius: 4px;
  overflow: hidden;
  background: var(--ep-list-surface);
}

.ep-thumb-bg {
  position: absolute;
  inset: 0;
  background: var(--ep-list-surface);
}

.ep-thumb-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.ep-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ep-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-main);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
}

.ep-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 3px;
  font-size: 13px;
  color: var(--text-sub);
  line-height: 1.45;
}

.ep-stars {
  display: inline-flex;
  align-items: center;
  gap: 1px;
}

.ep-reviews { color: #1876ff; }
.ep-sep { color: #d0d0d0; }
.ep-orig-price { color: #999; text-decoration: line-through; }
.ep-price { color: #fe4041; font-weight: 500; }
.ep-stock { color: #999; }
.ep-asin { color: #999; }

/* Checkbox */
.ep-checkbox {
  width: 16px;
  height: 16px;
  border-radius: 3px;
  border: 1px solid #dcdcdc;
  background: rgba(255,255,255,0.9);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, border-color 0.15s;
}

.ep-checkbox.checked {
  background: #1876ff;
  border-color: #1876ff;
}

/* Delete button */
.ep-delete {
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  border-radius: 4px;
  transition: color 0.15s, background 0.15s;
}

.ep-delete:hover {
  color: #ef4444;
  background: #fef2f2;
}

/* Empty states */
.ep-empty, .ep-empty-right {
  padding: 24px 16px;
  text-align: center;
  font-size: 13px;
  color: #94a3b8;
  margin: 0;
}

/* ── Exclude Brands ── */
.eb-brand-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  margin: 12px 14px 0;
  border-radius: 4px;
  border: 1px solid transparent;
  background: var(--ep-list-surface);
  transition: border-color 0.15s, background 0.15s;
}

.eb-brand-row:hover:not(.selected) {
  background: var(--ep-list-hover);
}

.eb-brand-row.selected {
  background: #fff;
  border-color: var(--selected-border);
}

.eb-brand-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-main);
}

.eb-exclude-btn {
  background: none;
  border: none;
  color: #1876ff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  font-family: inherit;
  transition: opacity 0.15s;
  flex-shrink: 0;
}

.eb-exclude-btn:hover { opacity: 0.7; }

.eb-added-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  margin: 12px 14px 0;
  border-radius: 4px;
  border: 1px solid transparent;
  background: var(--ep-list-surface);
}

.eb-close-btn {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 4px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  border-radius: 4px;
  transition: color 0.15s, background 0.15s;
}

.eb-close-btn:hover {
  color: #111;
  background: rgba(0, 0, 0, 0.06);
}
</style>
