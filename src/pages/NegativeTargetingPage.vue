<template>
  <div class="page-layout">
    <div class="page-center">
      <Stepper
        :steps="steps"
        :current-step="getStepNumber('/negative-targeting')"
        :active-sub-item="activeSubItem"
      />

      <div class="content-wrapper">
        <h2 class="page-title">Negative（optional）</h2>
        <main class="main-content">

          <!-- ── Negative Keyword（与 Exclude products 同构：card + 通栏工作台） ── -->
          <section id="section-negative-keyword" class="card ep-card nk-product-section">
            <h3 class="section-title">
              Negative keyword
              <span class="help-wrap">
                <img :src="iconHelpCircle" alt="" width="16" height="16" class="help-icon" />
                <span class="help-tooltip">Add negative keywords to prevent your ads from showing for irrelevant searches.</span>
              </span>
            </h3>

            <div class="nk-work">
              <div class="nk-work-lead">
                <h4 class="nk-enter-heading">Enter list</h4>
              </div>

              <div class="nk-work-head">
                <span class="nk-work-added-title">{{ form.negativeKeywords.length }} added</span>
                <button
                  v-if="form.negativeKeywords.length > 0"
                  type="button"
                  class="remove-all-text-btn"
                  @click="removeAll"
                >
                  Remove all
                </button>
              </div>

              <div class="nk-work-left">
                <div class="nk-enter-block">
                  <div class="nk-enter-match-row">
                    <span class="nk-enter-match-label">Match type</span>
                    <label class="nk-radio">
                      <input v-model="negativeEnterMatchType" type="radio" value="Negative Exact" />
                      Negative exact
                    </label>
                    <label class="nk-radio">
                      <input v-model="negativeEnterMatchType" type="radio" value="Negative Phrase" />
                      Negative phrase
                    </label>
                  </div>
                  <textarea
                    v-model="negativeEnterListText"
                    class="nk-enter-textarea"
                    placeholder="Enter keyword separated by new line"
                    rows="8"
                  />
                  <div class="nk-enter-bottom-row">
                    <div class="nk-enter-upload-side">
                      <input
                        ref="negativeFileInput"
                        type="file"
                        accept=".txt,.csv,.tsv,.xlsx,.xls,text/plain,text/csv,text/tab-separated-values,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                        class="nk-file-hidden"
                        @change="onNegativeEnterFile"
                      />
                      <div class="nk-enter-file-actions">
                        <button type="button" class="nk-upload-lite" @click="triggerNegativeFilePick">
                          Upload file
                        </button>
                        <button type="button" class="nk-download-template" @click="downloadNegativeTemplate">
                          <Download class="nk-download-template__icon" :size="14" :stroke-width="2" aria-hidden="true" />
                          Download the XLSX template
                        </button>
                      </div>
                    </div>
                    <div class="nk-enter-actions">
                      <UiButton type="button" size="sm" variant="default" @click="commitNegativeEnterList">
                        Add keywords
                      </UiButton>
                    </div>
                  </div>
                </div>
              </div>

              <div class="nk-work-right">
                <div v-if="form.negativeKeywords.length === 0" class="nk-empty-block nk-empty-block--kw">
                  <div class="nk-empty-illus" aria-hidden="true">
                    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                      <rect x="6" y="10" width="44" height="32" rx="4" stroke="var(--gray-300,#d0d7e2)" stroke-width="1.5" fill="var(--gray-50,#f8fafc)"/>
                      <path d="M14 26h28M14 33h18" stroke="var(--gray-300,#d0d7e2)" stroke-width="1.5" stroke-linecap="round"/>
                      <path d="M36 38l6 6M42 38l-6 6" stroke="var(--primary,#1876ff)" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
                    </svg>
                  </div>
                  <p class="nk-empty-text">尚未添加否定关键词</p>
                  <p class="nk-empty-hint">从左侧输入或上传添加</p>
                </div>

                <div v-else class="kw-table-wrap nk-kw-table-wrap nk-table-wrap--shell">
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
                            :id="'negative-kw-' + row.id"
                            v-model="row.keyword"
                            class="kw-input"
                            type="text"
                            placeholder="Enter Negative keyword"
                          />
                        </td>
                        <td class="col-match">
                          <div class="match-select-wrap">
                            <select v-model="row.matchType" class="match-select">
                              <option value="Negative Exact">Negative Exact</option>
                              <option value="Negative Phrase">Negative Phrase</option>
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
              </div>
            </div>
          </section>

          <!-- ── Exclude Products ── -->
          <section class="card ep-card ep-product-section" id="section-negative-product">
            <h3 class="section-title">
              Exclude products
              <span class="help-wrap">
                <img :src="iconHelpCircle" alt="" width="16" height="16" class="help-icon" />
                <span class="help-tooltip">Exclude specific products to prevent your ads from appearing on those product pages.</span>
              </span>
            </h3>

            <!-- 与 Keyword Targeting · kt-shell 同构：Tab 与「N added」同行，下为左右内容区 -->
            <div class="ep-work">
              <div class="ep-work-tabs">
                <UnderlineTabs v-model="excludedProductLeftTab" :items="excludedProductLeftTabs" size="lg" />
              </div>

              <div class="ep-work-head">
                <span class="ep-work-added-title">{{ form.excludedProducts.length }} added</span>
                <button
                  v-if="form.excludedProducts.length > 0"
                  type="button"
                  class="remove-all-text-btn"
                  @click="removeAllProducts"
                >
                  Remove all
                </button>
              </div>

              <div class="ep-work-left">
                <template v-if="excludedProductLeftTab === 'search'">
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
                      <button
                        class="eb-exclude-btn"
                        type="button"
                        @click="toggleProduct(product)"
                      >
                        {{ isExcluded(product.id) ? 'Added' : 'Exclude' }}
                      </button>
                    </div>
                    <p v-if="filteredProducts.length === 0" class="ep-empty">No products found.</p>
                  </div>
                </template>

                <template v-else>
                  <div class="ep-enter-block">
                    <textarea
                      v-model="epEnterListText"
                      class="ep-enter-textarea"
                      placeholder="Enter ASIN separated by new line"
                      rows="8"
                    />
                    <div class="ep-enter-bottom-row">
                      <div class="ep-enter-upload-side">
                        <input
                          ref="epEnterFileInput"
                          type="file"
                          accept=".txt,.csv,.tsv,.xlsx,.xls,text/plain,text/csv,text/tab-separated-values,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                          class="ep-file-hidden"
                          @change="onEpEnterFile"
                        />
                        <div class="ep-enter-file-actions">
                          <button type="button" class="ep-upload-lite" @click="triggerEpEnterFilePick">
                            Upload file
                          </button>
                          <button type="button" class="ep-download-template" @click="downloadEpAsinTemplate">
                            <Download class="ep-download-template__icon" :size="14" :stroke-width="2" aria-hidden="true" />
                            Download the XLSX template
                          </button>
                        </div>
                      </div>
                      <div class="ep-enter-actions">
                        <UiButton type="button" size="sm" variant="default" @click="commitEpEnterList">
                          Add products
                        </UiButton>
                      </div>
                    </div>
                  </div>
                </template>
              </div>

              <div class="ep-work-right">
                <div v-if="form.excludedProducts.length === 0" class="ep-empty-block ep-empty-block--kw">
                  <div class="ep-empty-illus" aria-hidden="true">
                    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                      <rect x="6" y="10" width="44" height="32" rx="4" stroke="var(--gray-300,#d0d7e2)" stroke-width="1.5" fill="var(--gray-50,#f8fafc)"/>
                      <path d="M14 26h28M14 33h18" stroke="var(--gray-300,#d0d7e2)" stroke-width="1.5" stroke-linecap="round"/>
                      <path d="M36 38l6 6M42 38l-6 6" stroke="var(--primary,#1876ff)" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
                    </svg>
                  </div>
                  <p class="ep-empty-text">尚未添加商品</p>
                  <p class="ep-empty-hint">从左侧添加商品</p>
                </div>

                <div v-else class="ep-added-table-wrap ep-added-table-wrap--shell">
                  <table class="ep-added-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Bid</th>
                        <th class="ep-action-col" aria-label="Action"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="row in form.excludedProducts" :key="row.id">
                        <td class="ep-col-product">
                          <template v-if="row.manual">
                            <input
                              :id="'ep-asin-' + row.id"
                              v-model="row.asin"
                              class="ep-asin-input"
                              type="text"
                              placeholder="Enter ASIN (e.g. B08Q6LV5CR)"
                              @keydown.enter.prevent="commitEpAsin(row)"
                              @blur="commitEpAsin(row)"
                            />
                          </template>
                          <template v-else>
                            <div class="ep-added-product">
                              <div class="ep-added-thumb">
                                <img v-if="row.image" :src="row.image" :alt="row.title" />
                                <svg v-else width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
                                  <rect width="40" height="40" rx="4" fill="#f3f5f8"/>
                                  <rect x="10" y="12" width="20" height="16" rx="2" stroke="#c8cdd4" stroke-width="1.2" fill="none"/>
                                  <circle cx="15" cy="18" r="2" fill="#c8cdd4"/>
                                  <path d="M10 24l5-4 4 3 4-3 7 5" stroke="#c8cdd4" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                              </div>
                              <div class="ep-added-info">
                                <p v-if="row.title" class="ep-added-title">{{ row.title }}</p>
                                <p class="ep-added-meta">ASIN: {{ row.asin }}</p>
                              </div>
                            </div>
                          </template>
                        </td>
                        <td class="ep-col-bid">
                          <span class="ep-bid-wrap">
                            <span class="ep-currency">$</span>
                            <input
                              v-model.number="row.bid"
                              class="ep-bid-input"
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="0.00"
                            />
                          </span>
                        </td>
                        <td class="ep-action-col">
                          <button type="button" class="ep-remove-btn" aria-label="Remove" @click="removeProduct(row.id)">×</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useCampaignStore } from '@/stores/campaign'
import Stepper from '@/components/Stepper.vue'
import BottomBar from '@/components/BottomBar.vue'
import UnderlineTabs from '@/components/ui/UnderlineTabs.vue'
import UiButton from '@/components/ui/button/Button.vue'
import { useFlowSteps } from '@/composables/useFlowSteps'
import iconHelpCircle from '@/assets/icon-help-circle.svg'
import * as XLSX from 'xlsx'
import { Download } from 'lucide-vue-next'

const router = useRouter()
const { steps, getStepNumber, getNextPath, getBackPath } = useFlowSteps()
const { form } = storeToRefs(useCampaignStore())

/** 与 useFlowSteps negativeSubItems 的 label / anchorId 一致，供侧栏子项高亮 */
const negativeStepSubItems = [
  { label: 'Negative keyword', anchorId: 'section-negative-keyword' },
  { label: 'Exclude products', anchorId: 'section-negative-product' },
  { label: 'Exclude brands', anchorId: 'section-negative-brand' }
]

const activeSubItem = ref('Negative keyword')

let sectionObserver = null
onMounted(() => {
  const sectionEls = negativeStepSubItems
    .map((s) => ({ label: s.label, el: document.getElementById(s.anchorId) }))
    .filter((s) => s.el)

  sectionObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const matched = sectionEls.find((s) => s.el === entry.target)
          if (matched) activeSubItem.value = matched.label
        }
      }
    },
    { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
  )
  sectionEls.forEach((s) => sectionObserver.observe(s.el))
})

onUnmounted(() => {
  sectionObserver?.disconnect()
})

// ── Negative Keyword ──
function removeRow(id) {
  form.value.negativeKeywords = form.value.negativeKeywords.filter(r => r.id !== id)
}
function removeAll() {
  form.value.negativeKeywords = []
}

/* ── Negative keyword · Enter list ── */
const negativeEnterListText = ref('')
const negativeEnterMatchType = ref('Negative Exact')
const negativeFileInput = ref(null)

function triggerNegativeFilePick() {
  negativeFileInput.value?.click()
}

function normalizeNegativeUploadText(raw) {
  return raw.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n')
}

function negativeWorkbookFirstColumnLinesRaw(wb) {
  const sn = wb.SheetNames[0]
  if (!sn) return ''
  const ws = wb.Sheets[sn]
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' })
  return rows
    .map((r) => String(Array.isArray(r) ? r[0] : ''))
    .filter((cell) => cell.length > 0)
    .join('\n')
}

function addNegativeEnterListLines(sourceText, fromUpload = false) {
  const mt = negativeEnterMatchType.value
  const lines = fromUpload
    ? normalizeNegativeUploadText(sourceText)
        .split('\n')
        .map((l) => l.replace(/\r$/, ''))
        .filter((l) => l !== '')
    : sourceText.split('\n').map((l) => l.trim()).filter(Boolean)
  lines.forEach((keyword) => {
    const already = fromUpload
      ? form.value.negativeKeywords.some((k) => k.keyword === keyword && k.matchType === mt)
      : form.value.negativeKeywords.some(
          (k) => k.keyword.trim().toLowerCase() === keyword.toLowerCase() && k.matchType === mt
        )
    if (already) return
    form.value.negativeKeywords.push({
      id: `nk-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      keyword,
      matchType: mt,
    })
  })
}

function commitNegativeEnterList() {
  addNegativeEnterListLines(negativeEnterListText.value, false)
  negativeEnterListText.value = ''
}

async function onNegativeEnterFile(ev) {
  const input = ev.target
  const file = input.files?.[0]
  if (!file) return
  const lower = file.name.toLowerCase()
  const type = file.type || ''
  try {
    let out = ''
    const isXlsx =
      lower.endsWith('.xlsx') ||
      type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    const isXls = lower.endsWith('.xls') || type === 'application/vnd.ms-excel'
    const isCsv = lower.endsWith('.csv') || type === 'text/csv'
    const isTsv = lower.endsWith('.tsv') || type === 'text/tab-separated-values'

    if (isXlsx || isXls) {
      const buf = await file.arrayBuffer()
      const wb = XLSX.read(buf, { type: 'array' })
      out = negativeWorkbookFirstColumnLinesRaw(wb)
    } else if (isCsv) {
      const text = normalizeNegativeUploadText(await file.text())
      const wb = XLSX.read(text, { type: 'string' })
      out = negativeWorkbookFirstColumnLinesRaw(wb)
    } else if (isTsv) {
      const text = normalizeNegativeUploadText(await file.text())
      out = text
        .split('\n')
        .map((line) => (line.split('\t')[0] ?? '').replace(/\r$/, ''))
        .filter((cell) => cell.length > 0)
        .join('\n')
    } else {
      out = normalizeNegativeUploadText(await file.text())
    }
    if (out.trim()) addNegativeEnterListLines(out, true)
  } catch {
    /* ignore */
  }
  input.value = ''
}

function downloadNegativeTemplate() {
  const ws = XLSX.utils.aoa_to_sheet([['Keyword']])
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Keywords')
  XLSX.writeFile(wb, 'negative-keyword-import-template.xlsx')
}

// ── Exclude Products · Search | Enter list ──
const excludedProductLeftTab = ref('enter')
const excludedProductLeftTabs = [
  { id: 'enter', label: 'Enter list' },
  { id: 'search', label: 'Search' },
]

const epEnterListText = ref('')
const epEnterFileInput = ref(null)

function parseAsinLine(line) {
  const raw = String(line || '')
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
  if (raw.length !== 10) return ''
  return /^[A-Z0-9]{10}$/.test(raw) ? raw : ''
}

/** 与 Product targeting 一致：用于匹配 mock；展示仍用上传原文 */
function epAsinDedupeKey(raw) {
  return String(raw ?? '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '')
}

function triggerEpEnterFilePick() {
  epEnterFileInput.value?.click()
}

function epWorkbookFirstColumnLinesRaw(wb) {
  const sn = wb.SheetNames[0]
  if (!sn) return ''
  const ws = wb.Sheets[sn]
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' })
  return rows
    .map((r) => String(Array.isArray(r) ? r[0] : ''))
    .filter((cell) => cell.length > 0)
    .join('\n')
}

function addEpEnterListLines(sourceText, fromUpload = false) {
  const lines = fromUpload
    ? normalizeNegativeUploadText(sourceText)
        .split('\n')
        .map((l) => l.replace(/\r$/, ''))
        .filter((l) => l !== '')
    : sourceText.split('\n').map((l) => l.trim()).filter(Boolean)

  const seen = new Set()
  for (const line of lines) {
    if (fromUpload) {
      if (seen.has(line)) continue
      seen.add(line)
      const dup = form.value.excludedProducts.some((p) => p.asin === line)
      if (dup) continue
      const norm = epAsinDedupeKey(line)
      const mock =
        norm.length === 10 ? MOCK_PRODUCTS.find((p) => p.asin.toUpperCase() === norm) : null
      const id = `ep-bulk-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
      if (mock) {
        form.value.excludedProducts.push({
          ...mock,
          id,
          asin: line,
          bid: 0.02,
          manual: false,
        })
      } else {
        form.value.excludedProducts.push({
          id,
          asin: line,
          title: '',
          image: '',
          bid: 0.02,
          manual: false,
        })
      }
      continue
    }

    const asin = parseAsinLine(line)
    if (!asin || seen.has(asin)) continue
    seen.add(asin)
    const dup = form.value.excludedProducts.some((p) => (p.asin || '').toUpperCase() === asin)
    if (dup) continue
    const mock = MOCK_PRODUCTS.find((p) => p.asin.toUpperCase() === asin)
    if (mock) {
      form.value.excludedProducts.push({ ...mock, bid: 0.02, manual: false })
    } else {
      const id = `ep-bulk-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
      form.value.excludedProducts.push({
        id,
        asin,
        title: '',
        image: '',
        bid: 0.02,
        manual: false,
      })
    }
  }
}

function commitEpEnterList() {
  addEpEnterListLines(epEnterListText.value, false)
  epEnterListText.value = ''
}

async function onEpEnterFile(ev) {
  const input = ev.target
  const file = input.files?.[0]
  if (!file) return
  const lower = file.name.toLowerCase()
  const type = file.type || ''
  try {
    let out = ''
    const isXlsx =
      lower.endsWith('.xlsx') ||
      type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    const isXls = lower.endsWith('.xls') || type === 'application/vnd.ms-excel'
    const isCsv = lower.endsWith('.csv') || type === 'text/csv'
    const isTsv = lower.endsWith('.tsv') || type === 'text/tab-separated-values'

    if (isXlsx || isXls) {
      const buf = await file.arrayBuffer()
      const wb = XLSX.read(buf, { type: 'array' })
      out = epWorkbookFirstColumnLinesRaw(wb)
    } else if (isCsv) {
      const text = normalizeNegativeUploadText(await file.text())
      const wb = XLSX.read(text, { type: 'string' })
      out = epWorkbookFirstColumnLinesRaw(wb)
    } else if (isTsv) {
      const text = normalizeNegativeUploadText(await file.text())
      out = text
        .split('\n')
        .map((line) => (line.split('\t')[0] ?? '').replace(/\r$/, ''))
        .filter((cell) => cell.length > 0)
        .join('\n')
    } else {
      out = normalizeNegativeUploadText(await file.text())
    }
    if (out.trim()) addEpEnterListLines(out, true)
  } catch {
    /* ignore */
  }
  input.value = ''
}

function downloadEpAsinTemplate() {
  const ws = XLSX.utils.aoa_to_sheet([['ASIN']])
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Products')
  XLSX.writeFile(wb, 'exclude-product-asin-import-template.xlsx')
}

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
    form.value.excludedProducts.push({ ...product, bid: 0.02, manual: false })
  }
}

function commitEpAsin(row) {
  const asin = (row.asin || '').trim().toUpperCase()
  if (!asin) {
    form.value.excludedProducts = form.value.excludedProducts.filter(p => p.id !== row.id)
    return
  }
  row.asin = asin
  row.manual = false
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

/* ── Card（Exclude products / brands 等） ── */
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

/* Negative keyword / Exclude products：同一套通栏工作台（与 Keyword kt-shell 同构） */
.nk-product-section .nk-work,
.ep-product-section .ep-work {
  --neg-target-pad-x: 32px;
  display: grid;
  grid-template-columns: minmax(0, 46%) 1fr;
  grid-template-rows: auto 1fr;
  min-height: 520px;
  width: calc(100% + 2 * var(--neg-target-pad-x));
  margin-left: calc(-1 * var(--neg-target-pad-x));
  margin-right: calc(-1 * var(--neg-target-pad-x));
  background: var(--bg-card);
  border-radius: 0;
  overflow: hidden;
  box-sizing: border-box;
  border-top: 1px solid var(--border);
}

.ep-product-section .ep-work {
  --ep-list-surface: #f8f8f8;
  --ep-list-hover: #f0f0f0;
}

.nk-product-section .nk-work-lead,
.ep-product-section .ep-work-tabs {
  grid-column: 1;
  grid-row: 1;
  align-self: stretch;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 24px 20px 0;
  border-bottom: 1px solid var(--border);
  border-right: 1px solid var(--border);
  box-sizing: border-box;
}

.nk-product-section .nk-work-lead .nk-enter-heading {
  margin: 0;
  padding-bottom: 14px;
  font-size: var(--text-lg, 16px);
  font-weight: 600;
  color: var(--text-main);
}

.nk-product-section .nk-work-left .nk-enter-block {
  flex: 1;
  min-height: 0;
  padding: 18px 20px 14px;
}

.ep-product-section .ep-work-tabs :deep(.underline-tabs) {
  width: 100%;
}

.ep-product-section .ep-work-tabs :deep(.underline-tabs--lg .underline-tabs__trigger) {
  padding: 0 0 14px;
}

.nk-product-section .nk-work-head,
.ep-product-section .ep-work-head {
  grid-column: 2;
  grid-row: 1;
  align-self: stretch;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 20px;
  border-bottom: 1px solid var(--border);
  box-sizing: border-box;
}

.nk-product-section .nk-work-added-title,
.ep-product-section .ep-work-added-title {
  flex-shrink: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-main);
}

.nk-product-section .nk-work-left,
.ep-product-section .ep-work-left {
  grid-column: 1;
  grid-row: 2;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--border);
  box-sizing: border-box;
}

.nk-product-section .nk-work-right,
.ep-product-section .ep-work-right {
  grid-column: 2;
  grid-row: 2;
  min-width: 300px;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: #fff;
  box-sizing: border-box;
}

.remove-all-text-btn {
  margin: 0;
  padding: 0;
  border: none;
  background: none;
  color: var(--text-sub);
  font-size: 15px;
  font-weight: 500;
  line-height: 1.25;
  cursor: pointer;
  font-family: inherit;
  transition: color 0.15s;
}

.remove-all-text-btn:hover {
  color: #ef4444;
}

.ep-product-section .ep-work-left .ep-search-bar {
  padding: 18px 20px 16px;
}

.ep-product-section .ep-work-left .ep-enter-block {
  flex: 1;
  min-height: 0;
  padding: 18px 20px 14px;
}

.ep-product-section .ep-work-left .ep-results {
  flex: 1;
  min-height: 0;
}

.ep-product-section .ep-work-right .ep-empty-block--kw,
.nk-product-section .nk-work-right .nk-empty-block--kw {
  flex: 1;
  min-height: 200px;
  padding: 40px 20px;
  box-sizing: border-box;
}

.ep-product-section .ep-work-right .ep-empty-block--kw .ep-empty-text,
.nk-product-section .nk-work-right .nk-empty-block--kw .nk-empty-text {
  margin: 10px 0 4px;
  font-size: var(--text-base, 14px);
  font-weight: 600;
  color: var(--text-main);
}

.ep-product-section .ep-work-right .ep-empty-block--kw .ep-empty-hint,
.nk-product-section .nk-work-right .nk-empty-block--kw .nk-empty-hint {
  margin: 0;
  font-size: var(--text-sm, 13px);
  color: var(--text-sub);
  text-align: center;
  line-height: 1.5;
}

.ep-product-section .ep-added-table-wrap--shell,
.nk-product-section .nk-table-wrap--shell {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 18px 20px 14px;
  box-sizing: border-box;
}

/* ── Negative keyword · Enter list ── */
.nk-enter-block {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.nk-enter-match-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px 18px;
}

.nk-enter-match-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-sub);
  white-space: nowrap;
}

.nk-radio {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-main);
  cursor: pointer;
  font-family: inherit;
}

.nk-radio input {
  width: 14px;
  height: 14px;
  accent-color: var(--primary, #1d4ed8);
  cursor: pointer;
}

.nk-enter-textarea {
  flex: 1;
  min-height: 140px;
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
  transition: border-color 0.15s, box-shadow 0.15s;
}

.nk-enter-textarea:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.nk-enter-textarea::placeholder {
  color: #9ca3af;
}

.nk-enter-bottom-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  width: 100%;
}

.nk-enter-upload-side {
  position: relative;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.nk-file-hidden {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
}

.nk-enter-file-actions {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 16px;
}

.nk-upload-lite {
  margin: 0;
  padding: 6px 10px;
  border: 1px dashed #c4c9d4;
  border-radius: 3px;
  background: var(--gray-50, #f8fafc);
  color: var(--text-sub, #6b7280);
  font-size: 12px;
  font-weight: 500;
  font-family: inherit;
  line-height: 1.3;
  cursor: pointer;
  white-space: nowrap;
  transition: border-color 0.15s, color 0.15s, background 0.15s;
}

.nk-upload-lite:hover {
  border-color: var(--primary, #1d4ed8);
  color: var(--primary, #1d4ed8);
  background: #fff;
}

.nk-download-template {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin: 0;
  padding: 4px 2px;
  border: none;
  border-radius: 3px;
  background: transparent;
  color: var(--text-main, #374151);
  font-size: 12px;
  font-weight: 500;
  font-family: inherit;
  line-height: 1.3;
  cursor: pointer;
  white-space: nowrap;
  transition: color 0.15s, opacity 0.15s;
}

.nk-download-template:hover {
  color: var(--primary, #1d4ed8);
}

.nk-download-template:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.35);
}

.nk-download-template__icon {
  flex-shrink: 0;
  color: inherit;
}

.nk-enter-actions {
  display: flex;
  justify-content: flex-end;
  flex-shrink: 0;
}

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

.col-kw     { width: 30%; }
.col-match  { width: 200px; }
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
  color: var(--text-sub);
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  font-family: inherit;
  transition: color 0.15s;
}

.delete-btn:hover {
  color: #ef4444;
}

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

/* ── Exclude Products ── */
.ep-card { gap: 16px; }

.ep-body {
  /* 商品 / 品牌列表卡片与缩略图底：与设计稿一致 */
  --ep-list-surface: #f8f8f8;
  --ep-list-hover: #f0f0f0;
  /* 与 .ep-search-bar 上下 padding 24+24 + 输入行 36 对齐，使左右列表起点一致 */
  --ep-column-header-height: 84px;
  display: flex;
  align-items: stretch;
  gap: 0;
  min-height: 400px;
  overflow: hidden;
  border-top: 1px solid #e2e8f0;
}

/* Left panel */
.ep-left {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  padding-right: 32px;
  border-right: 1px solid #e2e8f0;
}

/* Exclude products · Enter list（与 Negative keyword Enter 区节奏一致） */
.ep-enter-block {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 4px 0 0;
  box-sizing: border-box;
}

.ep-enter-textarea {
  flex: 1;
  min-height: 120px;
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
  transition: border-color 0.15s, box-shadow 0.15s;
}

.ep-enter-textarea:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.ep-enter-textarea::placeholder {
  color: #9ca3af;
}

.ep-enter-bottom-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  width: 100%;
}

.ep-enter-upload-side {
  position: relative;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.ep-file-hidden {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
}

.ep-enter-file-actions {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 16px;
}

.ep-upload-lite {
  margin: 0;
  padding: 6px 10px;
  border: 1px dashed #c4c9d4;
  border-radius: 3px;
  background: var(--gray-50, #f8fafc);
  color: var(--text-sub, #6b7280);
  font-size: 12px;
  font-weight: 500;
  font-family: inherit;
  line-height: 1.3;
  cursor: pointer;
  white-space: nowrap;
  transition: border-color 0.15s, color 0.15s, background 0.15s;
}

.ep-upload-lite:hover {
  border-color: var(--primary, #1d4ed8);
  color: var(--primary, #1d4ed8);
  background: #fff;
}

.ep-download-template {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin: 0;
  padding: 4px 2px;
  border: none;
  border-radius: 3px;
  background: transparent;
  color: var(--text-main, #374151);
  font-size: 12px;
  font-weight: 500;
  font-family: inherit;
  line-height: 1.3;
  cursor: pointer;
  white-space: nowrap;
  transition: color 0.15s, opacity 0.15s;
}

.ep-download-template:hover {
  color: var(--primary, #1d4ed8);
}

.ep-download-template:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.35);
}

.ep-download-template__icon {
  flex-shrink: 0;
  color: inherit;
}

.ep-enter-actions {
  display: flex;
  justify-content: flex-end;
  flex-shrink: 0;
}

.ep-search-bar {
  display: flex;
  align-items: center;
  gap: 0;
  margin: 0;
  padding: 16px 0 20px;
  box-sizing: border-box;
  flex-shrink: 0;
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
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ep-product-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border-radius: 4px;
  border: 1px solid transparent;
  background: var(--ep-list-surface);
  cursor: default;
  transition: border-color 0.15s, background 0.15s;
}
.ep-product-row:hover:not(.selected) { background: var(--ep-list-hover); }
.ep-product-row.selected {
  background: #fff;
  border-color: var(--selected-border);
}

.ep-product-row .eb-exclude-btn {
  align-self: center;
  flex-shrink: 0;
}

/* Right panel */
.ep-right {
  width: 45%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  padding-left: 12px;
}

.ep-right-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 14px;
  box-sizing: border-box;
  min-height: var(--ep-column-header-height);
  flex-shrink: 0;
  border-bottom: 1px solid var(--border-strong, #e2e8f0);
}

.ep-added-count {
  font-size: 20px;
  color: #272b36;
  font-weight: 600;
}

.ep-remove-all {
  background: none;
  border: none;
  color: var(--text-sub);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  font-family: inherit;
  transition: color 0.15s;
}

.ep-remove-all:hover { color: #ef4444; }

/* ── Added table ── */
.ep-added-table-wrap {
  flex: 1;
  overflow-y: auto;
}

.ep-added-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.ep-added-table thead tr {
  background: #f8f9fb;
  border-bottom: 1px solid #e2e8f0;
}

.ep-added-table th {
  height: 44px;
  padding: 0 12px;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  vertical-align: middle;
}

.ep-added-table td {
  padding: 10px 12px;
  font-size: 13px;
  color: var(--text-main);
  vertical-align: middle;
  border-bottom: 1px solid #f1f5f9;
}

.ep-added-table tbody tr:last-child td { border-bottom: none; }
.ep-added-table tbody tr:hover { background: rgba(0,0,0,0.02); }

.ep-col-product { width: auto; }
.ep-col-bid { width: 80px; }
.ep-action-col { width: 36px; text-align: center; }

/* Product card in table */
.ep-added-product {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.ep-added-thumb {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border-radius: 4px;
  overflow: hidden;
  background: #f3f5f8;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ep-added-thumb img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.ep-added-info {
  min-width: 0;
  flex: 1;
}

.ep-added-title {
  margin: 0;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-main);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ep-added-meta {
  margin: 2px 0 0;
  font-size: 12px;
  color: var(--text-hint);
}

/* ASIN input (minimal, borderless) */
.ep-asin-input {
  width: 100%;
  border: none;
  background: transparent;
  outline: none;
  font-size: 13px;
  font-family: inherit;
  color: var(--text-main);
  padding: 0 4px;
}

.ep-asin-input::placeholder { color: #c0c8d8; }

/* Bid input */
.ep-bid-wrap {
  display: inline-flex;
  align-items: center;
  gap: 2px;
}

.ep-currency {
  font-size: 13px;
  color: var(--text-sub);
}

.ep-bid-input {
  width: 52px;
  border: none;
  background: transparent;
  outline: none;
  font-size: 13px;
  font-family: inherit;
  color: var(--text-main);
  padding: 2px 0;
}

.ep-bid-input::-webkit-inner-spin-button,
.ep-bid-input::-webkit-outer-spin-button { opacity: 0; }

/* Remove (×) button */
.ep-remove-btn {
  background: none;
  border: none;
  color: var(--text-hint);
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 3px;
  font-family: inherit;
  transition: color 0.15s;
}

.ep-remove-btn:hover { color: #ef4444; }

/* Empty state（nk 与 ep 共用骨架，避免右侧空状态散成横排） */
.ep-empty-block,
.nk-empty-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 32px 16px;
  gap: 8px;
}

.ep-empty-illus,
.nk-empty-illus {
  opacity: 0.6;
}

.ep-empty-text {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-sub);
}

.ep-empty-hint {
  margin: 0;
  font-size: 12px;
  color: var(--text-hint);
  text-align: center;
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
  transition: color 0.15s;
}

.eb-close-btn:hover {
  color: #ef4444;
}
</style>
