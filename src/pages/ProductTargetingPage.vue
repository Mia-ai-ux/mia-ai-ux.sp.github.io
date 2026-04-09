<template>
  <div class="page-layout">
    <div class="page-center">
      <Stepper :steps="steps" :current-step="getStepNumber('/product-targeting')" />

      <div class="content-wrapper">
        <h2 class="page-title">
          Product targeting
          <span class="required-mark" aria-hidden="true">*</span>
        </h2>

        <main class="main-content">
          <div class="pt-shell">
            <!-- Left -->
            <div class="pt-left">
              <!-- Primary: Categories | Products -->
              <div class="primary-tabs">
                <button
                  type="button"
                  class="primary-tab"
                  :class="{ active: form.productTargetMode === 'category' }"
                  @click="form.productTargetMode = 'category'"
                >
                  Categories
                </button>
                <button
                  type="button"
                  class="primary-tab"
                  :class="{ active: form.productTargetMode === 'product' }"
                  @click="form.productTargetMode = 'product'"
                >
                  Products
                </button>
              </div>

              <div class="sub-tabs-row">
                <div class="sub-tabs">
                  <template v-if="form.productTargetMode === 'category'">
                    <button
                      v-for="t in categorySubTabs"
                      :key="t.id"
                      type="button"
                      class="sub-tab"
                      :class="{ active: form.productCategoryTab === t.id }"
                      @click="form.productCategoryTab = t.id"
                    >
                      {{ t.label }}
                    </button>
                  </template>
                  <template v-else>
                    <button
                      v-for="t in productSubTabs"
                      :key="t.id"
                      type="button"
                      class="sub-tab"
                      :class="{ active: form.productProductTab === t.id }"
                      @click="form.productProductTab = t.id"
                    >
                      {{ t.label }}
                    </button>
                  </template>
                </div>
                <button type="button" class="link-btn" @click="addAllFromSource">Add all</button>
              </div>

              <div class="pt-toolbar">
                <label class="toolbar-field">
                  <span class="toolbar-label">Ad group default bid</span>
                  <span class="bid-input-wrap">
                    <span class="currency">$</span>
                    <input
                      v-model.number="form.productTargetingDefaultBid"
                      class="bid-input"
                      type="number"
                      step="0.01"
                      min="0"
                    />
                  </span>
                </label>
                <div v-if="form.productTargetMode === 'product'" class="toolbar-field match-row">
                  <span class="toolbar-label">Targeting type</span>
                  <label class="chk"><input v-model="form.productDeliveryType.exact" type="checkbox" /> Exact</label>
                  <label class="chk"><input v-model="form.productDeliveryType.expanded" type="checkbox" /> Expanded</label>
                </div>
                <div v-if="form.productTargetMode === 'product' && form.productProductTab === 'suggested'" class="toolbar-field theme-field">
                  <span class="toolbar-label">ASIN theme</span>
                  <select v-model="form.productAsinTheme" class="theme-select">
                    <option value="similar">Suggested ASIN theme: Similar products</option>
                    <option value="complements">Suggested ASIN theme: Complements</option>
                  </select>
                </div>
              </div>

              <!-- ── Categories: suggested ── -->
              <div v-if="form.productTargetMode === 'category' && form.productCategoryTab === 'suggested'" class="pt-panel">
                <p class="panel-count">Total {{ suggestedCategories.length }} suggested categories</p>
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Suggested bid</th>
                      <th class="action-col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in suggestedCategories" :key="row.id">
                      <td>
                        <p class="cell-title">{{ row.path }}</p>
                      </td>
                      <td>
                        <span class="sugg-main">{{ row.suggestBid }}</span>
                        <div v-if="row.suggestRange" class="sugg-range">{{ row.suggestRange }}</div>
                      </td>
                      <td class="action-col">
                        <button type="button" class="icon-add" aria-label="Add category" @click="addCategory(row)">+</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- ── Categories: search ── -->
              <div v-else-if="form.productTargetMode === 'category' && form.productCategoryTab === 'search'" class="pt-panel">
                <input
                  v-model="categorySearchQuery"
                  type="search"
                  class="search-input"
                  placeholder="Search by category name"
                />
                <p class="panel-count">Total {{ filteredSearchCategories.length }} categories</p>
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Suggested bid</th>
                      <th class="action-col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in filteredSearchCategories" :key="row.id">
                      <td>
                        <p class="cell-title">{{ row.path }}</p>
                      </td>
                      <td>
                        <span class="sugg-main">{{ row.suggestBid }}</span>
                        <div v-if="row.suggestRange" class="sugg-range">{{ row.suggestRange }}</div>
                      </td>
                      <td class="action-col">
                        <button type="button" class="icon-add" aria-label="Add category" @click="addCategory(row)">+</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- ── Categories: campaigns ── -->
              <div v-else-if="form.productTargetMode === 'category' && form.productCategoryTab === 'campaigns'" class="pt-panel">
                <div class="filters-row">
                  <label class="filter-field">
                    <span class="toolbar-label">Campaign</span>
                    <select v-model="form.productSelectedCampaignId" class="filter-select">
                      <option value="">Select campaign</option>
                      <option v-for="c in mockCampaigns" :key="c.id" :value="c.id">{{ c.name }}</option>
                    </select>
                  </label>
                  <label class="filter-field">
                    <span class="toolbar-label">Ad group</span>
                    <select v-model="form.productSelectedAdGroupId" class="filter-select">
                      <option value="">Select ad group</option>
                      <option v-for="g in filteredAdGroups" :key="g.id" :value="g.id">{{ g.name }}</option>
                    </select>
                  </label>
                </div>
                <template v-if="!form.productSelectedCampaignId || !form.productSelectedAdGroupId">
                  <div class="empty-block">
                    <div class="empty-illus" aria-hidden="true">
                      <svg width="120" height="100" viewBox="0 0 120 100" fill="none">
                        <rect x="20" y="25" width="80" height="55" rx="4" stroke="#d4d8de" stroke-width="1.5" fill="#fafbfc"/>
                        <path d="M45 45l15-12 20 18" stroke="#c8cdd4" stroke-width="1.5" stroke-linecap="round"/>
                      </svg>
                    </div>
                    <p class="empty-text">No data yet</p>
                  </div>
                </template>
                <template v-else>
                  <p class="panel-count">Total {{ campaignCategoryRows.length }} categories</p>
                  <table class="data-table">
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th>Source group status</th>
                        <th>Status</th>
                        <th>Suggested bid</th>
                        <th class="action-col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="row in campaignCategoryRows" :key="row.id">
                        <td><p class="cell-title">{{ row.path }}</p></td>
                        <td class="muted">{{ row.sourceStatus }}</td>
                        <td class="muted">{{ row.status }}</td>
                        <td>
                          <span class="sugg-main">{{ row.suggestBid }}</span>
                          <div v-if="row.suggestRange" class="sugg-range">{{ row.suggestRange }}</div>
                        </td>
                        <td class="action-col">
                          <button type="button" class="icon-add" aria-label="Add category" @click="addCategory(row)">+</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </template>
              </div>

              <!-- ── Products: suggested ── -->
              <div v-else-if="form.productTargetMode === 'product' && form.productProductTab === 'suggested'" class="pt-panel">
                <p class="panel-count">Total {{ suggestedProducts.length }} suggested products</p>
                <table class="data-table product-table">
                  <thead>
                    <tr>
                      <th class="col-product">Product</th>
                      <th>Type</th>
                      <th>Suggested bid</th>
                      <th>Price</th>
                      <th>Rating</th>
                      <th>Reviews</th>
                      <th class="action-col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="p in suggestedProducts" :key="p.id">
                      <td class="col-product">
                        <div class="prod-cell">
                          <div class="prod-thumb">
                            <img :src="p.image" :alt="p.title" />
                          </div>
                          <div class="prod-text">
                            <p class="cell-title">{{ p.title }}</p>
                            <p class="cell-meta">{{ p.asin }} · {{ p.stock }}</p>
                          </div>
                        </div>
                      </td>
                      <td>{{ pickDeliveryLabel() }}</td>
                      <td>
                        <span class="sugg-main">{{ p.suggestBid }}</span>
                        <div v-if="p.suggestRange" class="sugg-range">{{ p.suggestRange }}</div>
                      </td>
                      <td>{{ p.price }}</td>
                      <td>{{ p.rating }} ★</td>
                      <td class="muted">{{ p.reviews.toLocaleString() }}</td>
                      <td class="action-col">
                        <button type="button" class="icon-add" aria-label="Add product" @click="addProduct(p)">+</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div class="pagination">
                  <span class="page-info">403 items total</span>
                  <div class="page-btns">
                    <button type="button" class="page-btn" disabled>Previous</button>
                    <button type="button" class="page-btn active">1</button>
                    <button type="button" class="page-btn">2</button>
                    <button type="button" class="page-btn">Next</button>
                  </div>
                  <select class="page-size" disabled><option>50 / page</option></select>
                </div>
              </div>

              <!-- ── Products: library ── -->
              <div v-else-if="form.productTargetMode === 'product' && form.productProductTab === 'library'" class="pt-panel">
                <p class="panel-hint">Add products from your saved targeting library.</p>
                <table class="data-table product-table">
                  <thead>
                    <tr>
                      <th class="col-product">Product</th>
                      <th>Type</th>
                      <th>Suggested bid</th>
                      <th class="action-col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="p in form.libraryProductAsins" :key="p.id">
                      <td class="col-product">
                        <div class="prod-cell">
                          <div class="prod-thumb">
                            <img :src="p.image" :alt="p.title" />
                          </div>
                          <div class="prod-text">
                            <p class="cell-title">{{ p.title }}</p>
                            <p class="cell-meta">{{ p.asin }}</p>
                          </div>
                        </div>
                      </td>
                      <td>{{ pickDeliveryLabel() }}</td>
                      <td>
                        <span class="sugg-main">{{ p.suggestBid }}</span>
                        <div v-if="p.suggestRange" class="sugg-range">{{ p.suggestRange }}</div>
                      </td>
                      <td class="action-col">
                        <button type="button" class="icon-add" aria-label="Add product" @click="addProductFromLibrary(p)">+</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- ── Products: campaigns ── -->
              <div v-else-if="form.productTargetMode === 'product' && form.productProductTab === 'campaigns'" class="pt-panel">
                <div class="filters-row">
                  <label class="filter-field">
                    <span class="toolbar-label">Campaign</span>
                    <select v-model="form.productSelectedCampaignId" class="filter-select">
                      <option value="">Select campaign</option>
                      <option v-for="c in mockCampaigns" :key="c.id" :value="c.id">{{ c.name }}</option>
                    </select>
                  </label>
                  <label class="filter-field">
                    <span class="toolbar-label">Ad group</span>
                    <select v-model="form.productSelectedAdGroupId" class="filter-select">
                      <option value="">Select ad group</option>
                      <option v-for="g in filteredAdGroups" :key="g.id" :value="g.id">{{ g.name }}</option>
                    </select>
                  </label>
                </div>
                <template v-if="!form.productSelectedCampaignId || !form.productSelectedAdGroupId">
                  <div class="empty-block">
                    <div class="empty-illus" aria-hidden="true">
                      <svg width="120" height="100" viewBox="0 0 120 100" fill="none">
                        <rect x="20" y="25" width="80" height="55" rx="4" stroke="#d4d8de" stroke-width="1.5" fill="#fafbfc"/>
                        <path d="M45 45l15-12 20 18" stroke="#c8cdd4" stroke-width="1.5" stroke-linecap="round"/>
                      </svg>
                    </div>
                    <p class="empty-text">No data yet</p>
                  </div>
                </template>
                <template v-else>
                  <p class="panel-count">Total {{ campaignProductRows.length }} products</p>
                  <table class="data-table product-table">
                    <thead>
                      <tr>
                        <th class="col-product">Product</th>
                        <th>Source group status</th>
                        <th>Type</th>
                        <th>Suggested bid</th>
                        <th class="action-col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="p in campaignProductRows" :key="p.id">
                        <td class="col-product">
                          <div class="prod-cell">
                            <div class="prod-thumb">
                              <img :src="p.image" :alt="p.title" />
                            </div>
                            <div class="prod-text">
                              <p class="cell-title">{{ p.title }}</p>
                              <p class="cell-meta">{{ p.asin }}</p>
                            </div>
                          </div>
                        </td>
                        <td class="muted">{{ p.sourceStatus }}</td>
                        <td>{{ pickDeliveryLabel() }}</td>
                        <td>
                          <span class="sugg-main">{{ p.suggestBid }}</span>
                          <div v-if="p.suggestRange" class="sugg-range">{{ p.suggestRange }}</div>
                        </td>
                        <td class="action-col">
                          <button type="button" class="icon-add" aria-label="Add product" @click="addProduct(p)">+</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </template>
              </div>

              <!-- ── Products: manual ── -->
              <div v-else class="pt-panel manual-panel">
                <textarea
                  v-model="manualAsinInput"
                  class="manual-textarea"
                  rows="10"
                  placeholder="Enter ASINs, one per line"
                />
                <div class="manual-actions">
                  <button type="button" class="primary-btn" @click="addManualAsins">Add</button>
                </div>
              </div>
            </div>

            <!-- Right: Added -->
            <div class="pt-right">
              <div class="pt-right-head">
                <span class="added-title">{{ form.productTargets.length }} added</span>
                <button
                  v-if="form.productTargets.length > 0"
                  type="button"
                  class="link-btn"
                  @click="removeAllAdded"
                >
                  Remove all
                </button>
              </div>

              <div v-if="form.productTargets.length === 0" class="empty-block tight">
                <div class="empty-illus" aria-hidden="true">
                  <svg width="120" height="100" viewBox="0 0 120 100" fill="none">
                    <rect x="20" y="25" width="80" height="55" rx="4" stroke="#d4d8de" stroke-width="1.5" fill="#fafbfc"/>
                    <path d="M45 45l15-12 20 18" stroke="#c8cdd4" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                </div>
                <p class="empty-text">No data yet</p>
              </div>

              <div v-else class="added-table-wrap">
                <table class="data-table added-table">
                  <thead>
                    <tr>
                      <th class="check-col">
                        <input type="checkbox" :checked="allAddedChecked" @change="toggleAllAdded" />
                      </th>
                      <th>
                        Category and product
                        <button type="button" class="th-refresh" aria-label="Refresh suggested bids" title="Refresh">↻</button>
                      </th>
                      <th>Suggested bid</th>
                      <th>Bulk apply bid</th>
                      <th class="action-col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in form.productTargets" :key="row.id">
                      <td class="check-col">
                        <input v-model="row.checked" type="checkbox" />
                      </td>
                      <td>
                        <div v-if="row.kind === 'category'" class="added-category">
                          <p class="cell-title">{{ row.title }}</p>
                        </div>
                        <div v-else class="added-product">
                          <div v-if="row.image" class="added-thumb">
                            <img :src="row.image" :alt="row.title" />
                          </div>
                          <div>
                            <p class="cell-title">{{ row.title }}</p>
                            <p class="cell-meta">Product — {{ row.deliveryType }}: {{ row.asin }}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span class="sugg-main">{{ row.suggestBid }}</span>
                        <div v-if="row.suggestRange && row.suggestRange !== '—'" class="sugg-range">{{ row.suggestRange }}</div>
                      </td>
                      <td class="muted">Default bid ${{ Number(row.bid).toFixed(2) }}</td>
                      <td class="action-col">
                        <button type="button" class="icon-remove" aria-label="Remove" @click="removeAdded(row.id)">×</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>

  <BottomBar show-back @cancel="onCancel" @back="onBack" @next="onNext" />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useCampaignStore } from '@/stores/campaign'
import Stepper from '@/components/Stepper.vue'
import BottomBar from '@/components/BottomBar.vue'
import { useFlowSteps } from '@/composables/useFlowSteps'

const router = useRouter()
const store = useCampaignStore()
const { form } = storeToRefs(store)
const { steps, getStepNumber, getNextPath, getBackPath } = useFlowSteps()

onMounted(() => {
  store.form.targeting = 'manual'
  store.form.manualTargetType = 'product'
})

const categorySubTabs = [
  { id: 'suggested', label: 'Amazon suggested' },
  { id: 'search', label: 'Search' },
  { id: 'campaigns', label: 'Select from campaigns' }
]

const productSubTabs = [
  { id: 'suggested', label: 'Amazon suggested' },
  { id: 'library', label: 'Add via targeting library' },
  { id: 'campaigns', label: 'Select from campaigns' },
  { id: 'manual', label: 'Manual input' }
]

const categorySearchQuery = ref('')
const manualAsinInput = ref('')

const suggestedCategories = [
  { id: 'c1', path: 'Home & Garden > Heating, Cooling & Air Quality > Space Heaters', suggestBid: '—', suggestRange: '' },
  { id: 'c2', path: 'Home & Garden > Heating, Cooling & Air Quality > Fans', suggestBid: '—', suggestRange: '' },
  { id: 'c3', path: 'Home & Garden > Tools & Home Improvement > Electrical', suggestBid: '$0.42', suggestRange: '$0.30–$0.55' },
  { id: 'c4', path: 'Health & Household > Household Supplies > Air Fresheners', suggestBid: '—', suggestRange: '' },
  { id: 'c5', path: 'Books > Engineering & Transportation > Engineering', suggestBid: '—', suggestRange: '' }
]

const searchCategoryPool = [
  ...suggestedCategories,
  { id: 'c6', path: 'Stationery & Office Supplies > Writing & Correction', suggestBid: '$0.28', suggestRange: '$0.20–$0.38' },
  { id: 'c7', path: 'Health & Personal Care > Vitamins & Supplements', suggestBid: '$0.55', suggestRange: '$0.40–$0.72' },
  { id: 'c8', path: 'Books > Literature & Fiction', suggestBid: '—', suggestRange: '' }
]

const filteredSearchCategories = computed(() => {
  const q = categorySearchQuery.value.trim().toLowerCase()
  if (!q) return searchCategoryPool
  return searchCategoryPool.filter(c => c.path.toLowerCase().includes(q))
})

const mockCampaigns = [
  { id: 'c1', name: 'SP Heaters Q1' },
  { id: 'c2', name: 'SP Brand Defense' }
]

const mockAdGroups = [
  { id: 'g1', campaignId: 'c1', name: 'Heaters – Exact' },
  { id: 'g2', campaignId: 'c1', name: 'Heaters – Broad' },
  { id: 'g3', campaignId: 'c2', name: 'Brand – Exact' }
]

const filteredAdGroups = computed(() => {
  const cid = form.value.productSelectedCampaignId
  if (!cid) return mockAdGroups
  return mockAdGroups.filter(g => g.campaignId === cid)
})

const campaignCategoryRows = computed(() => {
  if (!form.value.productSelectedCampaignId || !form.value.productSelectedAdGroupId) return []
  return [
    { id: 'cc1', path: 'Home & Garden > Space Heaters > Ceramic', sourceStatus: 'Active', status: 'Enabled', suggestBid: '$0.61', suggestRange: '$0.48–$0.78' },
    { id: 'cc2', path: 'Home & Garden > Fans > Tower Fans', sourceStatus: 'Active', status: 'Enabled', suggestBid: '$0.44', suggestRange: '$0.32–$0.58' }
  ]
})

const suggestedProducts = [
  { id: 'p1', asin: 'B08Q6LV5CR', title: 'PureMate 46-inch Tower Fan', image: 'https://m.media-amazon.com/images/I/61e7RvINXUL._AC_SL1500_.jpg', stock: 'In stock', suggestBid: '—', suggestRange: '', price: '$59.49', rating: 4.5, reviews: 3201 },
  { id: 'p2', asin: 'B0C5CV8CTW', title: 'Dreo Ceramic Heater, 2025 Winter Mode', image: 'https://m.media-amazon.com/images/I/81G+4gzszVL._AC_SY879_.jpg', stock: 'In stock', suggestBid: '$1.12', suggestRange: '$0.88–$1.35', price: '$39.25', rating: 4.5, reviews: 16346 },
  { id: 'p3', asin: 'B09XK2DTVP', title: 'Vornado MVH Vortex Heater', image: 'https://m.media-amazon.com/images/I/71pB9RvWyRL._AC_SL1500_.jpg', stock: 'Out of stock', suggestBid: '$0.98', suggestRange: '$0.72–$1.15', price: '$49.99', rating: 4.4, reviews: 8921 }
]

const campaignProductRows = computed(() => {
  if (!form.value.productSelectedCampaignId || !form.value.productSelectedAdGroupId) return []
  return suggestedProducts.slice(0, 2).map((p, i) => ({
    ...p,
    id: `cp-${p.asin}-${i}`,
    sourceStatus: 'Active'
  }))
})

function pickDeliveryTypeForAdd() {
  const d = form.value.productDeliveryType
  if (d.exact && !d.expanded) return 'Exact'
  if (!d.exact && d.expanded) return 'Expanded'
  if (d.exact && d.expanded) return 'Exact'
  return 'Exact'
}

function pickDeliveryLabel() {
  const d = form.value.productDeliveryType
  if (d.exact && d.expanded) return 'Exact / Expanded'
  if (d.expanded) return 'Expanded'
  if (d.exact) return 'Exact'
  return 'Exact'
}

function categoryKey(path) {
  return `cat:${path}`
}

function productKey(asin, delivery) {
  return `prod:${asin}:${delivery}`
}

function isCategoryAdded(path) {
  const k = categoryKey(path)
  return form.value.productTargets.some(t => t.kind === 'category' && t.pathKey === k)
}

function isProductAdded(asin, delivery) {
  const k = productKey(asin, delivery)
  return form.value.productTargets.some(t => t.kind === 'product' && t.productKey === k)
}

function addCategory(row) {
  const k = categoryKey(row.path)
  if (isCategoryAdded(row.path)) return
  const def = form.value.productTargetingDefaultBid
  form.value.productTargets.push({
    id: `pt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    kind: 'category',
    pathKey: k,
    title: row.path,
    subtitle: '',
    deliveryType: 'Category',
    suggestBid: row.suggestBid || '—',
    suggestRange: row.suggestRange || '',
    bid: def,
    checked: false,
    asin: '',
    image: ''
  })
}

function addProduct(p) {
  const delivery = pickDeliveryTypeForAdd()
  if (isProductAdded(p.asin, delivery)) return
  const def = form.value.productTargetingDefaultBid
  form.value.productTargets.push({
    id: `pt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    kind: 'product',
    productKey: productKey(p.asin, delivery),
    title: p.title,
    subtitle: '',
    asin: p.asin,
    image: p.image,
    deliveryType: delivery,
    suggestBid: p.suggestBid || '—',
    suggestRange: p.suggestRange || '',
    bid: def,
    checked: false
  })
}

function addProductFromLibrary(p) {
  addProduct({
    id: p.id,
    asin: p.asin,
    title: p.title,
    image: p.image,
    stock: '—',
    suggestBid: p.suggestBid,
    suggestRange: p.suggestRange,
    price: '—',
    rating: '—',
    reviews: 0
  })
}

function addManualAsins() {
  const lines = manualAsinInput.value.split('\n').map(l => l.trim().toUpperCase()).filter(Boolean)
  const delivery = pickDeliveryTypeForAdd()
  const def = form.value.productTargetingDefaultBid
  lines.forEach(asin => {
    if (isProductAdded(asin, delivery)) return
    form.value.productTargets.push({
      id: `pt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      kind: 'product',
      productKey: productKey(asin, delivery),
      title: `ASIN ${asin}`,
      subtitle: '',
      asin,
      image: '',
      deliveryType: delivery,
      suggestBid: '—',
      suggestRange: '',
      bid: def,
      checked: false
    })
  })
  manualAsinInput.value = ''
}

function collectSourceRows() {
  const mode = form.value.productTargetMode
  if (mode === 'category') {
    const tab = form.value.productCategoryTab
    if (tab === 'suggested') return suggestedCategories.map(r => ({ type: 'cat', row: r }))
    if (tab === 'search') return filteredSearchCategories.value.map(r => ({ type: 'cat', row: r }))
    if (tab === 'campaigns') return campaignCategoryRows.value.map(r => ({ type: 'cat', row: r }))
  } else {
    const tab = form.value.productProductTab
    if (tab === 'suggested') return suggestedProducts.map(r => ({ type: 'prod', row: r }))
    if (tab === 'library') return form.value.libraryProductAsins.map(r => ({ type: 'lib', row: r }))
    if (tab === 'campaigns') return campaignProductRows.value.map(r => ({ type: 'prod', row: r }))
  }
  return []
}

function addAllFromSource() {
  const items = collectSourceRows()
  items.forEach(({ type, row }) => {
    if (type === 'cat') addCategory(row)
    else if (type === 'lib') addProductFromLibrary(row)
    else addProduct(row)
  })
}

function removeAdded(id) {
  form.value.productTargets = form.value.productTargets.filter(t => t.id !== id)
}

function removeAllAdded() {
  form.value.productTargets = []
}

const allAddedChecked = computed(() =>
  form.value.productTargets.length > 0 && form.value.productTargets.every(t => t.checked)
)

function toggleAllAdded(e) {
  const on = e.target.checked
  form.value.productTargets.forEach(t => { t.checked = on })
}

function onCancel() { router.push('/') }
function onBack() { router.push(getBackPath('/product-targeting')) }
function onNext() { router.push(getNextPath('/product-targeting')) }
</script>

<style scoped>
.page-layout {
  display: flex;
  justify-content: center;
  min-height: calc(100vh - 60px);
  width: 100%;
}

.page-center {
  display: flex;
  align-items: flex-start;
  gap: 40px;
  width: 70vw;
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
  font-size: 2em;
  font-weight: 700;
  color: #111;
  margin: 0 0 16px;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 4px;
}

.required-mark {
  color: #e5484d;
  font-size: 0.85em;
  font-weight: 600;
}

.main-content {
  flex: 1;
  min-width: 0;
  margin: 0;
  padding-bottom: 72px;
}

.pt-shell {
  display: flex;
  gap: 0;
  min-height: 520px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.pt-left {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e2e8f0;
}

.primary-tabs {
  display: flex;
  gap: 0;
  padding: 0 16px;
  border-bottom: 1px solid #e2e8f0;
}

.primary-tab {
  background: none;
  border: none;
  padding: 14px 20px;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-sub);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  font-family: inherit;
}

.primary-tab:hover {
  color: var(--text-main);
}

.primary-tab.active {
  color: #1876ff;
  border-bottom-color: #1876ff;
}

.sub-tabs-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 16px;
  border-bottom: 1px solid #e2e8f0;
  flex-wrap: wrap;
}

.sub-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.sub-tab {
  background: none;
  border: none;
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-sub);
  cursor: pointer;
  border-radius: 4px;
  font-family: inherit;
}

.sub-tab:hover {
  background: #f1f5f9;
  color: var(--text-main);
}

.sub-tab.active {
  color: #1876ff;
  background: #eff6ff;
}

.link-btn {
  background: none;
  border: none;
  color: #1876ff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  padding: 6px 8px;
  font-family: inherit;
}

.pt-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px 20px;
  padding: 12px 16px;
  border-bottom: 1px solid #e2e8f0;
  background: #fafbfc;
}

.toolbar-field {
  display: flex;
  align-items: center;
  gap: 10px;
}

.toolbar-label {
  font-size: 13px;
  color: var(--text-sub);
  white-space: nowrap;
}

.bid-input-wrap {
  display: inline-flex;
  align-items: center;
  border: 1px solid #d0d5dd;
  border-radius: 4px;
  background: #fff;
  padding: 0 10px;
  height: 36px;
}

.currency {
  color: var(--text-sub);
  font-size: 14px;
}

.bid-input {
  width: 72px;
  border: none;
  outline: none;
  font-size: 14px;
  padding: 0 4px;
  background: transparent;
}

.match-row {
  gap: 12px;
}

.chk {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  cursor: pointer;
}

.theme-field {
  flex: 1;
  min-width: 200px;
}

.theme-select {
  flex: 1;
  max-width: 360px;
  height: 36px;
  padding: 0 10px;
  border: 1px solid #d0d5dd;
  border-radius: 4px;
  font-size: 13px;
  background: #fff;
}

.pt-panel {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 12px 16px 16px;
}

.panel-count {
  margin: 0 0 10px;
  font-size: 13px;
  color: var(--text-sub);
}

.panel-hint {
  margin: 0 0 12px;
  font-size: 13px;
  color: var(--text-sub);
}

.search-input {
  width: 100%;
  max-width: 400px;
  height: 40px;
  padding: 0 14px;
  border: 1px solid #d0d5dd;
  border-radius: 6px;
  font-size: 14px;
  margin-bottom: 12px;
  font-family: inherit;
}

.filters-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;
}

.filter-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.filter-select {
  min-width: 200px;
  height: 36px;
  padding: 0 10px;
  border: 1px solid #d0d5dd;
  border-radius: 4px;
  font-size: 14px;
  background: #fff;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.data-table thead tr {
  background: #f8f9fb;
  border-bottom: 1px solid #e2e8f0;
}

.data-table th {
  text-align: left;
  padding: 10px 12px;
  font-weight: 600;
  color: var(--text-main);
}

.data-table td {
  padding: 12px;
  vertical-align: middle;
  border-bottom: 1px solid #f1f5f9;
}

.action-col {
  width: 56px;
  text-align: center;
}

.col-product {
  min-width: 220px;
}

.cell-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-main);
  line-height: 1.35;
}

.cell-meta {
  margin: 4px 0 0;
  font-size: 13px;
  color: var(--text-sub);
  line-height: 1.45;
}

.muted {
  color: var(--text-sub);
}

.sugg-main {
  font-weight: 600;
}

.sugg-range {
  font-size: 12px;
  color: var(--text-sub);
  margin-top: 2px;
}

.icon-add {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  border: 1px solid #e2e8f0;
  background: #fff;
  color: #1876ff;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  font-family: inherit;
}

.icon-add:hover {
  background: #eff6ff;
}

.prod-cell {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.prod-thumb {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  border-radius: 4px;
  overflow: hidden;
  background: #f5f5f5;
}

.prod-thumb img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.prod-text {
  min-width: 0;
}

.product-table .col-product {
  max-width: 320px;
}

.pagination {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
}

.page-info {
  font-size: 13px;
  color: var(--text-sub);
}

.page-btns {
  display: flex;
  gap: 4px;
}

.page-btn {
  min-width: 32px;
  height: 32px;
  padding: 0 8px;
  border: 1px solid #e2e8f0;
  background: #fff;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  font-family: inherit;
}

.page-btn.active {
  border-color: #1876ff;
  color: #1876ff;
  background: #eff6ff;
}

.page-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.page-size {
  height: 32px;
  padding: 0 8px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 13px;
}

.manual-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.manual-textarea {
  width: 100%;
  min-height: 200px;
  padding: 12px 14px;
  border: 1px solid #d0d5dd;
  border-radius: 6px;
  font-size: 14px;
  resize: vertical;
  font-family: inherit;
}

.manual-actions {
  display: flex;
  justify-content: flex-end;
}

.primary-btn {
  height: 40px;
  padding: 0 20px;
  background: #1876ff;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
}

.primary-btn:hover {
  background: #0f5fd4;
}

.empty-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  min-height: 240px;
}

.empty-block.tight {
  min-height: 200px;
}

.empty-text {
  margin: 8px 0 0;
  font-size: 14px;
  color: var(--text-sub);
}

.pt-right {
  width: 44%;
  min-width: 300px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
}

.pt-right-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #e2e8f0;
  min-height: 49px;
}

.added-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-main);
}

.added-table-wrap {
  flex: 1;
  overflow: auto;
}

.added-table .check-col {
  width: 40px;
  text-align: center;
}

.th-refresh {
  margin-left: 6px;
  background: none;
  border: none;
  color: var(--text-sub);
  cursor: pointer;
  font-size: 14px;
  vertical-align: middle;
}

.th-refresh:hover {
  color: #1876ff;
}

.added-product {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.added-thumb {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 4px;
  overflow: hidden;
  background: #f5f5f5;
}

.added-thumb img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.icon-remove {
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  color: var(--text-sub);
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
  border-radius: 4px;
  font-family: inherit;
}

.icon-remove:hover {
  color: #ef4444;
  background: #fef2f2;
}
</style>
