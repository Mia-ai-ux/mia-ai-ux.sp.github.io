<template>
  <div class="page-layout">
    <div class="page-center">
      <Stepper :steps="steps" :current-step="getStepNumber('/keyword-targeting')" />

      <div class="content-wrapper">
        <h2 class="page-title">Keyword Targeting</h2>

        <main class="main-content">
          <div class="kt-shell">
            <div class="kt-tabs-row">
              <UnderlineTabs v-model="form.keywordTargetTab" :items="tabs" size="lg" />
            </div>

            <div class="kt-right-head">
              <span class="added-title">{{ form.keywords.length }} added</span>
            </div>

            <div class="kt-left-stack">
              <div v-if="form.keywordTargetTab === 'amazon'" class="kt-toolbar">
                <div class="toolbar-field match-types">
                  <span class="toolbar-label">Match type</span>
                  <label class="chk"><input v-model="form.keywordTargetingMatchTypes.exact" type="checkbox" /> Exact</label>
                  <label class="chk"><input v-model="form.keywordTargetingMatchTypes.broad" type="checkbox" /> Broad</label>
                  <label class="chk"><input v-model="form.keywordTargetingMatchTypes.phrase" type="checkbox" /> Phrase</label>
                </div>
              </div>

              <!-- Amazon -->
              <div v-if="form.keywordTargetTab === 'amazon'" class="kt-panel">
                <table class="data-table data-table--kw-stack">
                  <thead>
                    <tr>
                      <th class="kw-stack-th">
                        <span class="kw-stack-th__primary">Keyword</span>
                        <span class="kw-stack-th__secondary">
                          IS | IR
                          <button
                            type="button"
                            class="kw-stack-th__info"
                            aria-label="About impression share (IS) and impression rate (IR)"
                          >
                            <img :src="iconHelpCircle" width="14" height="14" alt="" />
                          </button>
                        </span>
                      </th>
                      <th>Match type</th>
                      <th>Suggested bid</th>
                      <th class="action-col" aria-label="Action"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-if="amazonTableGroups.length === 0">
                      <tr>
                        <td colspan="4" class="kt-match-empty">
                          Select at least one match type above to see suggestions.
                        </td>
                      </tr>
                    </template>
                    <template v-else>
                      <template v-for="group in amazonTableGroups" :key="group.base.id">
                        <tr v-for="(line, lineIdx) in group.lines" :key="line.rowKey">
                        <td
                          v-if="lineIdx === 0"
                          :rowspan="group.lines.length"
                          class="kw-stack-td kw-stack-td--rowspan"
                        >
                          <p class="cell-title kw-stack-td__title">{{ group.base.text }}</p>
                          <p class="kw-stack-td__meta">IS: {{ group.base.is }} | IR: {{ group.base.ir }}</p>
                        </td>
                        <td>{{ line.matchType }}</td>
                        <td>
                          <div class="sugg-main">{{ line.suggestBid }}</div>
                          <div class="sugg-range">{{ line.suggestRange }}</div>
                        </td>
                        <td class="action-col">
                          <button
                            type="button"
                            class="eb-exclude-btn"
                            :disabled="isAdded(group.base.text, line.matchType)"
                            :aria-label="isAdded(group.base.text, line.matchType) ? 'Already added' : 'Add keyword'"
                            @click="
                              addFromRow({
                                text: group.base.text,
                                is: group.base.is,
                                ir: group.base.ir,
                                matchType: line.matchType,
                                suggestBid: line.suggestBid,
                                suggestRange: line.suggestRange
                              })
                            "
                          >
                            {{ isAdded(group.base.text, line.matchType) ? 'Added' : 'Add' }}
                          </button>
                        </td>
                        </tr>
                      </template>
                    </template>
                  </tbody>
                </table>
              </div>

              <!-- Campaigns -->
              <div v-else-if="form.keywordTargetTab === 'campaigns'" class="kt-panel kt-panel--campaigns">
                <div class="filters-row">
                  <label class="filter-field">
                    <span class="toolbar-label">Campaign</span>
                    <div class="filter-ui-select">
                      <UiSelect
                        v-model="form.keywordSelectedCampaignId"
                        placeholder="Select campaign"
                        :options="keywordCampaignSelectOptions"
                      />
                    </div>
                  </label>
                  <label class="filter-field">
                    <span class="toolbar-label">Ad group</span>
                    <div class="filter-ui-select">
                      <UiSelect
                        v-model="form.keywordSelectedAdGroupId"
                        placeholder="Select ad group"
                        :options="keywordAdGroupSelectOptions"
                        :disabled="!form.keywordSelectedCampaignId"
                      />
                    </div>
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
                      <th v-if="showCampaignSourceStatusColumn">Source status</th>
                      <th>Match type</th>
                      <th>Suggested bid</th>
                      <th class="action-col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-if="campaignTableGroups.length === 0">
                      <tr>
                        <td :colspan="showCampaignSourceStatusColumn ? 5 : 4" class="kt-match-empty">
                          No keywords to display for this ad group.
                        </td>
                      </tr>
                    </template>
                    <template v-else>
                      <template v-for="group in campaignTableGroups" :key="group.base.id">
                        <tr v-for="(line, lineIdx) in group.lines" :key="line.rowKey">
                        <td
                          v-if="lineIdx === 0"
                          :rowspan="group.lines.length"
                          class="kw-stack-td kw-stack-td--rowspan"
                        >
                          <p class="cell-title">{{ group.base.text }}</p>
                          <p class="cell-meta cell-meta--isir">IS: {{ group.base.is }} | IR: {{ group.base.ir }}</p>
                        </td>
                        <td
                          v-if="showCampaignSourceStatusColumn && lineIdx === 0"
                          :rowspan="group.lines.length"
                          class="muted kw-td-status"
                        >
                          {{ group.base.status }}
                        </td>
                        <td>{{ line.matchType }}</td>
                        <td>
                          <div class="sugg-main">{{ line.suggestBid }}</div>
                          <div class="sugg-range">{{ line.suggestRange }}</div>
                        </td>
                        <td class="action-col">
                          <button
                            type="button"
                            class="eb-exclude-btn"
                            :disabled="isAdded(group.base.text, line.matchType)"
                            :aria-label="isAdded(group.base.text, line.matchType) ? 'Already added' : 'Add keyword'"
                            @click="
                              addFromRow({
                                text: group.base.text,
                                is: group.base.is,
                                ir: group.base.ir,
                                matchType: line.matchType,
                                suggestBid: line.suggestBid,
                                suggestRange: line.suggestRange
                              })
                            "
                          >
                            {{ isAdded(group.base.text, line.matchType) ? 'Added' : 'Add' }}
                          </button>
                        </td>
                        </tr>
                      </template>
                    </template>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="kt-right-stack">
              <div class="kt-added-toolbar">
                <button type="button" class="add-keyword-lite-btn" @click="addManualKeywordRow">
                  <span class="add-keyword-lite-btn__plus" aria-hidden="true">+</span>
                  Add keyword
                </button>
                <button
                  v-if="form.keywords.length > 0"
                  type="button"
                  class="remove-all-text-btn"
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
                <p class="empty-hint">从左侧添加，或点击上方 + Add keyword 手动输入</p>
              </div>

              <div v-else class="added-table-wrap">
                <table class="data-table added-table">
                  <thead>
                    <tr>
                      <th class="kw-stack-th">
                        <span class="kw-stack-th__primary">Keyword</span>
                        <span class="kw-stack-th__secondary">
                          IS | IR
                          <button
                            type="button"
                            class="kw-stack-th__info"
                            aria-label="About impression share (IS) and impression rate (IR)"
                          >
                            <img :src="iconHelpCircle" width="14" height="14" alt="" />
                          </button>
                        </span>
                      </th>
                      <th>Match type</th>
                      <th>Suggested bid</th>
                      <th>Bid</th>
                      <th class="action-col" aria-label="Action"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="kw in form.keywords" :key="kw.id">
                      <td class="kw-stack-td">
                        <template v-if="kw.manual">
                          <input
                            :id="'added-kw-' + kw.id"
                            v-model="kw.text"
                            class="added-kw-input"
                            type="text"
                            placeholder="Enter keyword"
                          />
                          <p class="kw-stack-td__meta">IS: — | IR: —</p>
                        </template>
                        <template v-else>
                          <p class="cell-title kw-stack-td__title">{{ kw.text }}</p>
                          <p class="kw-stack-td__meta">IS: {{ kw.is }} | IR: {{ kw.ir }}</p>
                        </template>
                      </td>
                      <td>
                        <template v-if="kw.manual">
                          <div class="added-match-select">
                            <UiSelect
                              v-model="kw.matchType"
                              size="sm"
                              :options="keywordAddedMatchTypeOptions"
                            />
                          </div>
                        </template>
                        <template v-else>{{ kw.matchType }}</template>
                      </td>
                      <td>
                        <div class="sugg-main">{{ kw.suggestBid }}</div>
                        <div class="sugg-range">{{ kw.suggestRange }}</div>
                      </td>
                      <td>
                        <span class="bid-input-wrap bid-input-wrap--minimal">
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
import { computed, nextTick, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useCampaignStore } from '@/stores/campaign'
import Stepper from '@/components/Stepper.vue'
import BottomBar from '@/components/BottomBar.vue'
import UnderlineTabs from '@/components/ui/UnderlineTabs.vue'
import UiSelect from '@/components/ui/select/Select.vue'
import iconHelpCircle from '@/assets/icon-help-circle.svg'
import { useFlowSteps } from '@/composables/useFlowSteps'

const router = useRouter()
const campaignStore = useCampaignStore()
const { form } = storeToRefs(campaignStore)
const { steps, getStepNumber, getNextPath, getBackPath } = useFlowSteps()

onMounted(() => {
  campaignStore.form.targeting = 'manual'
  campaignStore.form.manualTargetType = 'keyword'
  if (campaignStore.form.keywordTargetTab === 'library' || campaignStore.form.keywordTargetTab === 'manual') {
    campaignStore.form.keywordTargetTab = 'amazon'
  }
})

const tabs = [
  { id: 'amazon', label: 'Amazon Suggested' },
  { id: 'campaigns', label: 'Select from campaigns' }
]

const keywordAddedMatchTypeOptions = [
  { value: 'Exact', label: 'Exact' },
  { value: 'Phrase', label: 'Phrase' },
  { value: 'Broad', label: 'Broad' }
]

/** Campaigns 表「Source status」列：暂隐藏，改 true 可恢复 */
const showCampaignSourceStatusColumn = false

/** 表格行顺序与参考稿一致：Broad → Phrase → Exact */
const DISPLAY_MATCH_ORDER = ['Broad', 'Phrase', 'Exact']

const amazonSuggestedRows = [
  {
    id: 'a3',
    text: 'space heaters indoor use',
    is: '14.2%',
    ir: 2,
    suggestByMatch: {
      Broad: { bid: '$1.45', range: '$1.12–$1.78' },
      Phrase: { bid: '$1.40', range: '$1.08–$1.72' },
      Exact: { bid: '$1.37', range: '$1.06–$1.76' }
    }
  },
  {
    id: 'a4',
    text: 'energy efficient electric heater',
    is: '11.8%',
    ir: 3,
    suggestByMatch: {
      Broad: { bid: '$1.22', range: '$0.95–$1.48' },
      Phrase: { bid: '$1.17', range: '$0.91–$1.42' },
      Exact: { bid: '$1.12', range: '$0.88–$1.41' }
    }
  },
  {
    id: 'a5',
    text: 'dreo portable heater',
    is: '10.5%',
    ir: 3,
    suggestByMatch: {
      Broad: { bid: '$1.08', range: '$0.82–$1.32' },
      Phrase: { bid: '$1.02', range: '$0.78–$1.28' },
      Exact: { bid: '$0.98', range: '$0.72–$1.22' }
    }
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

const keywordCampaignSelectOptions = computed(() =>
  mockCampaigns.map((c) => ({ value: c.id, label: c.name }))
)

const filteredAdGroups = computed(() => {
  const cid = form.value.keywordSelectedCampaignId
  if (!cid) return []
  return mockAdGroups.filter((g) => g.campaignId === cid)
})

const keywordAdGroupSelectOptions = computed(() =>
  filteredAdGroups.value.map((g) => ({ value: g.id, label: g.name }))
)

watch(
  () => form.value.keywordSelectedCampaignId,
  () => {
    form.value.keywordSelectedAdGroupId = ''
  }
)

/** Campaigns 表：每行只带数据源里实际存在的 match type；不同 ad group 演示不同组合 */
const campaignKeywordRows = computed(() => {
  if (!form.value.keywordSelectedCampaignId || !form.value.keywordSelectedAdGroupId) return []
  const gid = form.value.keywordSelectedAdGroupId

  const ck1Full = {
    id: 'ck1',
    text: 'small space heater',
    is: '14.2%',
    ir: 2,
    status: 'Active',
    suggestByMatch: {
      Broad: { bid: '$0.98', range: '$0.72–$1.15' },
      Phrase: { bid: '$0.92', range: '$0.68–$1.10' },
      Exact: { bid: '$0.89', range: '$0.65–$1.08' }
    }
  }
  const ck2Full = {
    id: 'ck2',
    text: 'quiet heater bedroom',
    is: '11.8%',
    ir: 3,
    status: 'Active',
    suggestByMatch: {
      Broad: { bid: '$0.84', range: '$0.62–$1.02' },
      Phrase: { bid: '$0.79', range: '$0.58–$0.98' },
      Exact: { bid: '$0.76', range: '$0.55–$0.94' }
    }
  }

  if (gid === 'g1') {
    return [
      { ...ck1Full, suggestByMatch: { Exact: ck1Full.suggestByMatch.Exact } },
      { ...ck2Full, suggestByMatch: { Exact: ck2Full.suggestByMatch.Exact } }
    ]
  }
  if (gid === 'g2') {
    return [
      {
        ...ck1Full,
        suggestByMatch: {
          Broad: ck1Full.suggestByMatch.Broad,
          Phrase: ck1Full.suggestByMatch.Phrase
        }
      },
      { ...ck2Full, suggestByMatch: { Broad: ck2Full.suggestByMatch.Broad } }
    ]
  }
  if (gid === 'g3') {
    return [ck1Full, { ...ck2Full, suggestByMatch: { Phrase: ck2Full.suggestByMatch.Phrase, Exact: ck2Full.suggestByMatch.Exact } }]
  }
  return [ck1Full, ck2Full]
})

function matchTypesFromToolbar() {
  const m = form.value.keywordTargetingMatchTypes
  return DISPLAY_MATCH_ORDER.filter((name) => {
    if (name === 'Broad') return m.broad
    if (name === 'Phrase') return m.phrase
    return m.exact
  })
}

/** Select from campaigns：按每条关键词数据里出现的 match type 列行，顺序固定 Broad → Phrase → Exact */
function matchTypesFromSuggest(suggestByMatch) {
  if (!suggestByMatch || typeof suggestByMatch !== 'object') return []
  return DISPLAY_MATCH_ORDER.filter((name) => suggestByMatch[name] != null)
}

const amazonTableGroups = computed(() => {
  const types = matchTypesFromToolbar()
  if (!types.length) return []
  return amazonSuggestedRows.map((base) => ({
    base,
    lines: types.map((mt) => {
      const s = base.suggestByMatch[mt]
      return {
        rowKey: `${base.id}-${mt}`,
        matchType: mt,
        suggestBid: s?.bid ?? '—',
        suggestRange: s?.range ?? '—'
      }
    })
  }))
})

const campaignTableGroups = computed(() => {
  return campaignKeywordRows.value
    .map((base) => {
      const types = matchTypesFromSuggest(base.suggestByMatch)
      return {
        base,
        lines: types.map((mt) => {
          const s = base.suggestByMatch[mt]
          return {
            rowKey: `${base.id}-${mt}`,
            matchType: mt,
            suggestBid: s?.bid ?? '—',
            suggestRange: s?.range ?? '—'
          }
        })
      }
    })
    .filter((g) => g.lines.length > 0)
})

function pickMatchType() {
  const m = form.value.keywordTargetingMatchTypes
  if (m.exact) return 'Exact'
  if (m.phrase) return 'Phrase'
  if (m.broad) return 'Broad'
  return 'Exact'
}

function isAdded(text, matchType) {
  const t = text.trim().toLowerCase()
  return form.value.keywords.some(
    k => k.text.toLowerCase() === t && k.matchType === matchType
  )
}

function addFromRow(row) {
  const text = row.text.trim()
  const mt = row.matchType || pickMatchType()
  if (!text || !mt) return
  if (isAdded(text, mt)) return
  const def = form.value.keywordTargetingDefaultBid
  form.value.keywords.push({
    id: `kw-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    text,
    subtitle: row.subtitle || '',
    matchType: mt,
    is: row.is ?? '—',
    ir: row.ir ?? '—',
    suggestBid: row.suggestBid ?? '—',
    suggestRange: row.suggestRange ?? '—',
    bid: def
  })
}

function removeAdded(id) {
  form.value.keywords = form.value.keywords.filter(k => k.id !== id)
}

function removeAllAdded() {
  form.value.keywords = []
}

function addManualKeywordRow() {
  const def = form.value.keywordTargetingDefaultBid
  const id = `kw-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
  form.value.keywords.push({
    id,
    text: '',
    subtitle: '',
    matchType: 'Exact',
    is: '—',
    ir: '—',
    suggestBid: '—',
    suggestRange: '—',
    bid: def,
    manual: true
  })
  nextTick(() => {
    document.getElementById(`added-kw-${id}`)?.focus()
  })
}

function onCancel() { router.push('/') }
function onBack() { router.push(getBackPath('/keyword-targeting')) }
function onNext() { router.push(getNextPath('/keyword-targeting')) }
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
  margin: 0 0 16px;
  padding: 0;
}

.main-content {
  flex: 1;
  min-width: 0;
  margin: 0;
  padding-bottom: 80px;
}

.kt-shell {
  display: grid;
  grid-template-columns: minmax(0, 46%) 1fr;
  grid-template-rows: auto 1fr;
  min-height: 520px;
  background: var(--bg-card);
  border-radius: var(--radius-card);
  overflow: hidden;
}

/* 首行：Tab 与「N added」同高（grid 同行 auto 取较高一侧并拉伸） */
.kt-tabs-row {
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

.kt-left-stack {
  grid-column: 1;
  grid-row: 2;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--border);
}

.kt-right-stack {
  grid-column: 2;
  grid-row: 2;
  min-width: 300px;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: #fff;
}

.kt-tabs-row :deep(.underline-tabs) {
  width: 100%;
}

/* 与卡片左 32px 对齐文案：去掉 Tab 按钮自身左右内边距；上内边距用行容器 32px 承担 */
.kt-tabs-row :deep(.underline-tabs--lg .underline-tabs__trigger) {
  padding: 0 0 14px;
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

/* 与 .kt-added-toolbar 同高：固定最小高度 + border-box，表格表头左右对齐 */
.kt-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 20px 24px;
  box-sizing: border-box;
  flex-shrink: 0;
  min-height: 64px;
  padding: 18px 20px;
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
  gap: 8px 12px;
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
  padding: 0 20px 14px;
}

/* 与 .kt-toolbar 上下 padding(18px) 一致：Tab 下缘 → 筛选项 → 表格的竖向节奏同 Amazon Suggested */
.kt-panel--campaigns {
  padding-top: 18px;
}

.filters-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 18px;
}

.filter-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.filter-ui-select {
  min-width: 200px;
  max-width: 320px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.data-table.flat {
  margin-top: 0;
}

.data-table thead tr {
  background: #f8f9fb;
  border-bottom: 1px solid var(--border);
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

/* 左右列表表格 cell 内边距一致 */
.kt-left-stack .data-table th,
.added-table-wrap .added-table th {
  padding: 8px 10px;
}

.kt-left-stack .data-table td,
.added-table-wrap .added-table td {
  padding: 10px;
}

/* Amazon Suggested / 右侧已添加表：Keyword + IS|IR 纵向叠放（与设计稿一致） */
.data-table--kw-stack .kw-stack-th,
.added-table .kw-stack-th {
  white-space: normal;
  vertical-align: bottom;
  min-width: 140px;
}

.data-table--kw-stack .kw-stack-th__primary,
.added-table .kw-stack-th__primary {
  display: block;
  font-size: var(--text-base, 14px);
  font-weight: 600;
  color: var(--text-main);
  line-height: 1.35;
}

.data-table--kw-stack .kw-stack-th__secondary,
.added-table .kw-stack-th__secondary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 6px;
  font-size: var(--text-xs, 12px);
  font-weight: 400;
  color: var(--text-sub);
  line-height: 1.3;
}

.data-table--kw-stack .kw-stack-th__info,
.added-table .kw-stack-th__info {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  border: none;
  background: none;
  cursor: help;
  line-height: 0;
  opacity: 0.75;
}

.data-table--kw-stack .kw-stack-th__info:hover,
.added-table .kw-stack-th__info:hover {
  opacity: 1;
}

.data-table--kw-stack .kw-stack-td__title,
.added-table .kw-stack-td__title {
  font-size: var(--text-md, 15px);
}

.data-table--kw-stack .kw-stack-td__meta,
.added-table .kw-stack-td__meta {
  margin: 6px 0 0;
  font-size: var(--text-xs, 12px);
  font-weight: 400;
  color: var(--text-sub);
  line-height: 1.4;
}

.data-table .kw-stack-td--rowspan {
  vertical-align: top;
}

.data-table .kw-td-status {
  vertical-align: top;
}

.kt-match-empty {
  text-align: center;
  padding: 28px 16px;
  font-size: 14px;
  color: var(--text-sub);
}

.data-table .narrow {
  width: 56px;
}

.data-table .action-col {
  width: 72px;
  text-align: right;
  vertical-align: middle;
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

/* Campaigns 表关键词下：与 Amazon IS|IR 行视觉一致 */
.data-table.flat .cell-meta--isir {
  margin: 6px 0 0;
  font-size: var(--text-xs, 12px);
  font-weight: 400;
  line-height: 1.4;
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

/* 与 Negative「Exclude brands」行内文字按钮一致 */
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
  white-space: nowrap;
}

.eb-exclude-btn:hover:not(:disabled) {
  opacity: 0.7;
}

.eb-exclude-btn:disabled {
  color: var(--text-sub);
  opacity: 1;
  cursor: default;
}

.kt-right-head {
  grid-column: 2;
  grid-row: 1;
  align-self: stretch;
  display: flex;
  align-items: center;
  padding: 12px 20px;
  border-bottom: 1px solid var(--border);
  box-sizing: border-box;
}

.kt-added-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  box-sizing: border-box;
  flex-shrink: 0;
  min-height: 64px;
  padding: 18px 20px;
}

.add-keyword-lite-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin: 0;
  padding: 0;
  border: none;
  background: none;
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.25;
  color: #1876ff;
  cursor: pointer;
  transition: opacity 0.15s;
}

.add-keyword-lite-btn:hover {
  opacity: 0.75;
}

.add-keyword-lite-btn__plus {
  font-size: 15px;
  font-weight: 500;
  line-height: 1;
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

/* 手动行：与 Negative keyword 表内输入一致的极简样式 */
.added-table tbody td:first-child {
  min-width: 160px;
}

.added-kw-input {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  height: 36px;
  padding: 0 4px;
  border: none;
  border-radius: 0;
  font-size: 14px;
  font-family: inherit;
  color: var(--text-main);
  background: transparent;
  outline: none;
}

.added-kw-input::placeholder {
  color: #c0c8d8;
}

.added-match-select {
  min-width: 0;
  width: fit-content;
  max-width: 100%;
}

.added-match-select :deep(.ui-select-wrap) {
  width: auto;
  min-width: 0;
  max-width: 100%;
  display: inline-block;
  vertical-align: middle;
}

.added-match-select :deep(.ui-select-trigger) {
  border: none;
  background: transparent;
  box-shadow: none;
  padding-left: 0;
  padding-right: 2px;
  width: auto;
  min-width: 0;
  justify-content: flex-start;
  gap: 2px;
}

.added-match-select :deep(.ui-select-value) {
  flex: 0 1 auto;
}

.added-match-select :deep(.ui-select-trigger:hover) {
  border-color: transparent;
}

.added-match-select :deep(.ui-select-trigger:focus-visible) {
  outline: none;
  border-color: transparent;
  box-shadow: none;
}

.added-match-select :deep(.ui-select-chevron) {
  color: #94a3b8;
}

/* 已添加表内出价列：全部极简（与手动行一致） */
.added-table .bid-input-wrap--minimal {
  border: none;
  background: transparent;
  padding: 0 4px;
  height: auto;
  min-height: 32px;
  display: inline-flex;
  align-items: center;
  max-width: 100%;
}

.added-table .bid-input-wrap--minimal .bid-input {
  flex: 1 1 auto;
  width: 72px;
  min-width: 56px;
  max-width: 100%;
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
  padding-left: 20px;
  padding-right: 20px;
  box-sizing: border-box;
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

/* 与左侧 .kt-panel 一致：左右 20px、底 14px */
.added-table-wrap {
  flex: 1;
  overflow: auto;
  padding: 0 20px 14px;
  box-sizing: border-box;
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
}
</style>
