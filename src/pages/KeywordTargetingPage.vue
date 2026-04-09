<template>
  <div class="page-layout">
    <div class="page-center">
      <Stepper :steps="steps" :current-step="getStepNumber('/keyword-targeting')" />

      <div class="content-wrapper">
        <h2 class="page-title">
          Keyword Targeting
          <span class="required-mark" aria-hidden="true">*</span>
        </h2>

        <main class="main-content">
          <div class="kt-shell">
            <!-- Left -->
            <div class="kt-left">
              <div class="kt-tabs-row">
                <div class="kt-tabs">
                  <button
                    v-for="t in tabs"
                    :key="t.id"
                    type="button"
                    class="kt-tab"
                    :class="{ active: form.keywordTargetTab === t.id }"
                    @click="form.keywordTargetTab = t.id"
                  >
                    {{ t.label }}
                  </button>
                </div>
                <button type="button" class="link-btn" @click="addAllFromSource">Add all</button>
              </div>

              <div class="kt-toolbar">
                <label class="toolbar-field">
                  <span class="toolbar-label">Ad group default bid</span>
                  <span class="bid-input-wrap">
                    <span class="currency">$</span>
                    <input
                      v-model.number="form.keywordTargetingDefaultBid"
                      class="bid-input"
                      type="number"
                      step="0.01"
                      min="0"
                    />
                  </span>
                </label>
                <div class="toolbar-field match-types">
                  <span class="toolbar-label">Match type</span>
                  <label class="chk"><input v-model="form.keywordTargetingMatchTypes.exact" type="checkbox" /> Exact</label>
                  <label class="chk"><input v-model="form.keywordTargetingMatchTypes.broad" type="checkbox" /> Broad</label>
                  <label class="chk"><input v-model="form.keywordTargetingMatchTypes.phrase" type="checkbox" /> Phrase</label>
                </div>
              </div>

              <!-- Amazon -->
              <div v-if="form.keywordTargetTab === 'amazon'" class="kt-panel">
                <div class="sort-row">
                  <select v-model="amazonSort" class="sort-select">
                    <option value="orders_desc">Descending · Historical order volume</option>
                    <option value="bid_desc">Descending · Suggested bid</option>
                  </select>
                </div>

                <div
                  v-for="group in amazonGroups"
                  :key="group.id"
                  class="kw-group"
                >
                  <button type="button" class="kw-group-head" @click="toggleGroup(group.id)">
                    <svg class="chev" :class="{ open: openGroups[group.id] }" width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M4 2l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    {{ group.title }}
                  </button>
                  <div v-show="openGroups[group.id]" class="kw-group-body">
                    <table class="data-table">
                      <thead>
                        <tr>
                          <th>Keyword</th>
                          <th class="narrow">IS</th>
                          <th class="narrow">IR</th>
                          <th>Match type</th>
                          <th>Suggested bid</th>
                          <th class="action-col">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="row in sortedAmazonRows(group.rows)" :key="row.id">
                          <td>
                            <p class="cell-title">{{ row.text }}</p>
                            <p v-if="row.subtitle" class="cell-meta">{{ row.subtitle }}</p>
                          </td>
                          <td class="muted">{{ row.is }}</td>
                          <td class="muted">{{ row.ir }}</td>
                          <td>{{ row.matchType }}</td>
                          <td>
                            <div class="sugg-main">{{ row.suggestBid }}</div>
                            <div class="sugg-range">{{ row.suggestRange }}</div>
                          </td>
                          <td class="action-col">
                            <button
                              type="button"
                              class="icon-add"
                              :class="{ added: isAdded(row.text) }"
                              :disabled="isAdded(row.text)"
                              :aria-label="isAdded(row.text) ? 'Already added' : 'Add keyword'"
                              @click="addFromRow(row)"
                            >
                              {{ isAdded(row.text) ? '✓' : '+' }}
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div class="pagination">
                  <span class="page-info">200 items total</span>
                  <div class="page-btns">
                    <button type="button" class="page-btn" disabled>Previous</button>
                    <button type="button" class="page-btn active">1</button>
                    <button type="button" class="page-btn">2</button>
                    <button type="button" class="page-btn">3</button>
                    <button type="button" class="page-btn">4</button>
                    <button type="button" class="page-btn">Next</button>
                  </div>
                  <select class="page-size" disabled>
                    <option>50 / page</option>
                  </select>
                </div>
              </div>

              <!-- Library -->
              <div v-else-if="form.keywordTargetTab === 'library'" class="kt-panel">
                <p class="panel-hint">Add keywords from your saved targeting library.</p>
                <table class="data-table flat">
                  <thead>
                    <tr>
                      <th>Keyword</th>
                      <th class="narrow">IS</th>
                      <th class="narrow">IR</th>
                      <th>Match type</th>
                      <th>Suggested bid</th>
                      <th class="action-col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in form.libraryKeywords" :key="row.id">
                      <td>
                        <p class="cell-title">{{ row.text }}</p>
                        <p v-if="row.subtitle" class="cell-meta">{{ row.subtitle }}</p>
                      </td>
                      <td class="muted">{{ row.is }}</td>
                      <td class="muted">{{ row.ir }}</td>
                      <td>{{ row.matchType }}</td>
                      <td>
                        <div class="sugg-main">{{ row.suggestBid }}</div>
                        <div class="sugg-range">{{ row.suggestRange }}</div>
                      </td>
                      <td class="action-col">
                        <button
                          type="button"
                          class="icon-add"
                          :class="{ added: isAdded(row.text) }"
                          :disabled="isAdded(row.text)"
                          :aria-label="isAdded(row.text) ? 'Already added' : 'Add keyword'"
                          @click="addFromRow(row)"
                        >
                          {{ isAdded(row.text) ? '✓' : '+' }}
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Campaigns -->
              <div v-else-if="form.keywordTargetTab === 'campaigns'" class="kt-panel">
                <div class="filters-row">
                  <label class="filter-field">
                    <span class="toolbar-label">Campaign</span>
                    <select v-model="form.keywordSelectedCampaignId" class="filter-select">
                      <option value="">Select campaign</option>
                      <option v-for="c in mockCampaigns" :key="c.id" :value="c.id">{{ c.name }}</option>
                    </select>
                  </label>
                  <label class="filter-field">
                    <span class="toolbar-label">Ad group</span>
                    <select v-model="form.keywordSelectedAdGroupId" class="filter-select">
                      <option value="">Select ad group</option>
                      <option v-for="g in filteredAdGroups" :key="g.id" :value="g.id">{{ g.name }}</option>
                    </select>
                  </label>
                </div>
                <div v-if="!form.keywordSelectedCampaignId || !form.keywordSelectedAdGroupId" class="empty-block">
                  <div class="empty-illus" aria-hidden="true">
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                      <rect x="8" y="14" width="48" height="36" rx="4" stroke="var(--gray-300,#d0d7e2)" stroke-width="1.5" fill="var(--gray-50,#f8fafc)"/>
                      <path d="M20 32h24M20 40h16" stroke="var(--gray-300,#d0d7e2)" stroke-width="1.5" stroke-linecap="round"/>
                      <circle cx="32" cy="24" r="4" stroke="var(--gray-300,#d0d7e2)" stroke-width="1.5"/>
                    </svg>
                  </div>
                  <p class="empty-text">请先选择 Campaign 和 Ad Group</p>
                  <p class="empty-hint">选择后将展示该广告组下的历史关键词</p>
                </div>
                <table v-else class="data-table flat">
                  <thead>
                    <tr>
                      <th>Keyword</th>
                      <th>Source status</th>
                      <th>Match type</th>
                      <th>Suggested bid</th>
                      <th class="action-col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in campaignKeywordRows" :key="row.id">
                      <td>
                        <p class="cell-title">{{ row.text }}</p>
                        <p v-if="row.subtitle" class="cell-meta">{{ row.subtitle }}</p>
                      </td>
                      <td class="muted">{{ row.status }}</td>
                      <td>{{ row.matchType }}</td>
                      <td>
                        <div class="sugg-main">{{ row.suggestBid }}</div>
                        <div class="sugg-range">{{ row.suggestRange }}</div>
                      </td>
                      <td class="action-col">
                        <button
                          type="button"
                          class="icon-add"
                          :class="{ added: isAdded(row.text) }"
                          :disabled="isAdded(row.text)"
                          :aria-label="isAdded(row.text) ? 'Already added' : 'Add keyword'"
                          @click="addFromRow(row)"
                        >
                          {{ isAdded(row.text) ? '✓' : '+' }}
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Manual -->
              <div v-else class="kt-panel manual-panel">
                <textarea
                  v-model="manualInput"
                  class="manual-textarea"
                  rows="10"
                  placeholder="Enter keywords, one per line"
                />
                <div class="manual-actions">
                  <button type="button" class="primary-btn" @click="addManualKeywords">Add</button>
                </div>
              </div>
            </div>

            <!-- Right -->
            <div class="kt-right">
              <div class="kt-right-head">
                <span class="added-title">{{ form.keywords.length }} added</span>
                <button
                  v-if="form.keywords.length > 0"
                  type="button"
                  class="link-btn"
                  @click="removeAllAdded"
                >
                  Remove all
                </button>
              </div>

              <div v-if="form.keywords.length === 0" class="empty-block tight">
                <div class="empty-illus" aria-hidden="true">
                  <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                    <rect x="6" y="10" width="44" height="32" rx="4" stroke="var(--gray-300,#d0d7e2)" stroke-width="1.5" fill="var(--gray-50,#f8fafc)"/>
                    <path d="M14 26h28M14 33h18" stroke="var(--gray-300,#d0d7e2)" stroke-width="1.5" stroke-linecap="round"/>
                    <path d="M36 38l6 6M42 38l-6 6" stroke="var(--primary,#1876ff)" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
                  </svg>
                </div>
                <p class="empty-text">尚未添加关键词</p>
                <p class="empty-hint">从左侧选择关键词，点击 + 添加到此处</p>
              </div>

              <div v-else class="added-table-wrap">
                <table class="data-table added-table">
                  <thead>
                    <tr>
                      <th class="check-col">
                        <input type="checkbox" :checked="allAddedChecked" @change="toggleAllAdded" />
                      </th>
                      <th>Keyword</th>
                      <th>Match type</th>
                      <th>Suggested bid</th>
                      <th>Bid (USD)</th>
                      <th class="action-col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="kw in form.keywords" :key="kw.id">
                      <td class="check-col">
                        <input v-model="kw.checked" type="checkbox" />
                      </td>
                      <td>
                        <p class="cell-title">{{ kw.text }}</p>
                        <p v-if="kw.subtitle" class="cell-meta">{{ kw.subtitle }}</p>
                      </td>
                      <td>{{ kw.matchType }}</td>
                      <td>
                        <div class="sugg-main">{{ kw.suggestBid }}</div>
                        <div class="sugg-range">{{ kw.suggestRange }}</div>
                      </td>
                      <td>
                        <span class="bid-input-wrap">
                          <span class="currency">$</span>
                          <input
                            v-model.number="kw.bid"
                            class="bid-input"
                            type="number"
                            step="0.01"
                            min="0"
                            :placeholder="Number(form.keywordTargetingDefaultBid).toFixed(2)"
                          />
                        </span>
                      </td>
                      <td class="action-col">
                        <button type="button" class="icon-remove" aria-label="Remove" @click="removeAdded(kw.id)">×</button>
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
import { ref, computed, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useCampaignStore } from '@/stores/campaign'
import Stepper from '@/components/Stepper.vue'
import BottomBar from '@/components/BottomBar.vue'
import { useFlowSteps } from '@/composables/useFlowSteps'

const router = useRouter()
const campaignStore = useCampaignStore()
const { form } = storeToRefs(campaignStore)
const { steps, getStepNumber, getNextPath, getBackPath } = useFlowSteps()

onMounted(() => {
  campaignStore.form.targeting = 'manual'
  campaignStore.form.manualTargetType = 'keyword'
})

const tabs = [
  { id: 'amazon', label: 'Amazon keywords' },
  { id: 'library', label: 'Add via targeting library' },
  { id: 'campaigns', label: 'Select from campaigns' },
  { id: 'manual', label: 'Manual input' }
]

const amazonSort = ref('orders_desc')
const manualInput = ref('')

const openGroups = reactive({
  brand: true,
  category: true
})

function toggleGroup(id) {
  openGroups[id] = !openGroups[id]
}

const amazonGroups = [
  {
    id: 'brand',
    title: 'Keywords related to your brand',
    rows: [
      { id: 'a1', text: 'dreo brand heater', subtitle: 'Brand term', is: '8.2%', ir: 5, matchType: 'Exact', suggestBid: '$0.52', suggestRange: '$0.37–$0.62' },
      { id: 'a2', text: 'dreo portable heater', subtitle: 'Brand + product', is: '9.1%', ir: 4, matchType: 'Exact', suggestBid: '$0.61', suggestRange: '$0.45–$0.78' }
    ]
  },
  {
    id: 'category',
    title: 'Keywords related to your product category',
    rows: [
      { id: 'a3', text: 'space heaters indoor use', subtitle: 'Indoor space heaters', is: '14.2%', ir: 2, matchType: 'Exact', suggestBid: '$1.37', suggestRange: '$1.06–$1.76' },
      { id: 'a4', text: 'energy efficient electric heater', subtitle: 'Energy efficient heating', is: '11.8%', ir: 3, matchType: 'Exact', suggestBid: '$1.12', suggestRange: '$0.88–$1.41' },
      { id: 'a5', text: 'dreo portable heater', subtitle: 'Portable Dreo heater', is: '10.5%', ir: 3, matchType: 'Exact', suggestBid: '$0.98', suggestRange: '$0.72–$1.22' }
    ]
  }
]

const mockCampaigns = [
  { id: 'c1', name: 'SP Heaters Q1' },
  { id: 'c2', name: 'SP Brand Defense' }
]

const mockAdGroups = [
  { id: 'g1', campaignId: 'c1', name: 'Heaters – Exact' },
  { id: 'g2', campaignId: 'c1', name: 'Heaters – Broad' },
  { id: 'g3', campaignId: 'c2', name: 'Brand – Exact' }
]

const campaignKeywordRows = computed(() => {
  if (!form.value.keywordSelectedCampaignId || !form.value.keywordSelectedAdGroupId) return []
  return [
    { id: 'ck1', text: 'small space heater', subtitle: 'Compact heater', status: 'Active', matchType: 'Exact', suggestBid: '$0.89', suggestRange: '$0.65–$1.08' },
    { id: 'ck2', text: 'quiet heater bedroom', subtitle: 'Bedroom heater', status: 'Active', matchType: 'Phrase', suggestBid: '$0.76', suggestRange: '$0.55–$0.94' }
  ]
})

const filteredAdGroups = computed(() => {
  const cid = form.value.keywordSelectedCampaignId
  if (!cid) return mockAdGroups
  return mockAdGroups.filter(g => g.campaignId === cid)
})

function sortedAmazonRows(rows) {
  const r = [...rows]
  if (amazonSort.value === 'bid_desc') {
    r.sort((a, b) => parseBid(b.suggestBid) - parseBid(a.suggestBid))
  }
  return r
}

function parseBid(s) {
  const n = parseFloat(String(s).replace(/[^0-9.]/g, ''))
  return Number.isFinite(n) ? n : 0
}

function pickMatchType() {
  const m = form.value.keywordTargetingMatchTypes
  if (m.exact) return 'Exact'
  if (m.phrase) return 'Phrase'
  if (m.broad) return 'Broad'
  return 'Exact'
}

function isAdded(text) {
  return form.value.keywords.some(k => k.text.toLowerCase() === text.toLowerCase())
}

function addFromRow(row) {
  const text = row.text.trim()
  if (!text) return
  if (form.value.keywords.some(k => k.text.toLowerCase() === text.toLowerCase())) return
  const def = form.value.keywordTargetingDefaultBid
  const mt = row.matchType || pickMatchType()
  form.value.keywords.push({
    id: `kw-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    text,
    subtitle: row.subtitle || '',
    matchType: mt,
    is: row.is ?? '—',
    ir: row.ir ?? '—',
    suggestBid: row.suggestBid ?? '—',
    suggestRange: row.suggestRange ?? '—',
    bid: def,
    checked: false
  })
}

function addManualKeywords() {
  const lines = manualInput.value.split('\n').map(l => l.trim()).filter(Boolean)
  const mt = pickMatchType()
  const def = form.value.keywordTargetingDefaultBid
  lines.forEach(text => {
    if (form.value.keywords.some(k => k.text.toLowerCase() === text.toLowerCase())) return
    form.value.keywords.push({
      id: `kw-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      text,
      subtitle: '',
      matchType: mt,
      is: '—',
      ir: '—',
      suggestBid: '—',
      suggestRange: '—',
      bid: def,
      checked: false
    })
  })
  manualInput.value = ''
}

function collectSourceRows() {
  const tab = form.value.keywordTargetTab
  if (tab === 'amazon') {
    return amazonGroups.flatMap(g => g.rows)
  }
  if (tab === 'library') {
    return [...form.value.libraryKeywords]
  }
  if (tab === 'campaigns') {
    return campaignKeywordRows.value
  }
  return []
}

function addAllFromSource() {
  collectSourceRows().forEach(row => addFromRow(row))
}

function removeAdded(id) {
  form.value.keywords = form.value.keywords.filter(k => k.id !== id)
}

function removeAllAdded() {
  form.value.keywords = []
}

const allAddedChecked = computed(() =>
  form.value.keywords.length > 0 && form.value.keywords.every(k => k.checked)
)

function toggleAllAdded(e) {
  const on = e.target.checked
  form.value.keywords.forEach(k => { k.checked = on })
}

function onCancel() { router.push('/') }
function onBack() { router.push(getBackPath('/keyword-targeting')) }
function onNext() { router.push(getNextPath('/keyword-targeting')) }
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

.kt-shell {
  display: flex;
  gap: 0;
  min-height: 520px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.kt-left {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e2e8f0;
}

.kt-tabs-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid #e2e8f0;
  flex-wrap: wrap;
}

.kt-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.kt-tab {
  background: none;
  border: none;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-sub);
  cursor: pointer;
  border-radius: 4px;
  font-family: inherit;
}

.kt-tab:hover {
  color: var(--text-main);
  background: #f1f5f9;
}

.kt-tab.active {
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

.link-btn:hover {
  opacity: 0.8;
}

.kt-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 20px 24px;
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

.match-types {
  gap: 12px;
}

.chk {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: var(--text-main);
  cursor: pointer;
}

.kt-panel {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 12px 16px 16px;
}

.sort-row {
  margin-bottom: 12px;
}

.sort-select {
  height: 36px;
  padding: 0 12px;
  border: 1px solid #d0d5dd;
  border-radius: 4px;
  font-size: 13px;
  background: #fff;
  min-width: 260px;
}

.kw-group {
  margin-bottom: 8px;
  border: 1px solid #e8ecf0;
  border-radius: 6px;
  overflow: hidden;
}

.kw-group-head {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
  background: #f8f9fb;
  border: none;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-main);
  cursor: pointer;
  text-align: left;
  font-family: inherit;
}

.chev {
  transition: transform 0.15s;
  color: var(--text-sub);
}

.chev.open {
  transform: rotate(90deg);
}

.kw-group-body {
  background: #fff;
}

.panel-hint {
  margin: 0 0 12px;
  font-size: 13px;
  color: var(--text-sub);
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

.data-table.flat {
  margin-top: 8px;
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
  white-space: nowrap;
}

.data-table td {
  padding: 12px;
  vertical-align: top;
  border-bottom: 1px solid #f1f5f9;
}

.data-table .narrow {
  width: 56px;
}

.data-table .action-col {
  width: 56px;
  text-align: center;
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
  color: var(--text-main);
}

.sugg-range {
  font-size: 12px;
  color: var(--text-sub);
  margin-top: 2px;
}

.icon-add {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm, 4px);
  border: 1px solid var(--border);
  background: var(--bg-card);
  color: var(--primary, #1876ff);
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.icon-add:hover:not(:disabled) {
  background: var(--primary-light, #eff6ff);
  border-color: var(--primary-border, #bfdbfe);
}

/* 已添加状态：绿色对勾，禁用交互 */
.icon-add.added {
  color: var(--color-success, #22c55e);
  border-color: hsl(142, 71%, 80%);
  background: hsl(142, 71%, 97%);
  cursor: default;
  opacity: 1;
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

.manual-textarea::placeholder {
  color: #94a3b8;
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

.kt-right {
  width: 42%;
  min-width: 280px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background: #fff;
}

.kt-right-head {
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

.empty-block {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  min-height: 280px;
}

.empty-block.tight {
  min-height: 200px;
}

.empty-text {
  margin: 10px 0 4px;
  font-size: var(--text-base, 14px);
  font-weight: 600;
  color: var(--text-main);
}

.empty-hint {
  margin: 0;
  font-size: var(--text-sm, 13px);
  color: var(--text-sub);
  text-align: center;
  line-height: 1.5;
}

.added-table-wrap {
  flex: 1;
  overflow: auto;
}

.added-table .check-col {
  width: 40px;
  text-align: center;
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
