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
              <button
                v-if="form.keywords.length > 0"
                type="button"
                class="remove-all-text-btn"
                @click="removeAllAdded"
              >
                Remove all
              </button>
            </div>

            <div class="kt-left-stack">
              <div v-if="form.keywordTargetTab === 'amazon'" class="kt-toolbar">
                <div class="toolbar-field match-types">
                  <span class="toolbar-label">Match type</span>
                  <label class="chk"><UiCheckbox v-model="form.keywordTargetingMatchTypes.exact" /> Exact</label>
                  <label class="chk"><UiCheckbox v-model="form.keywordTargetingMatchTypes.phrase" /> Phrase</label>
                  <label class="chk"><UiCheckbox v-model="form.keywordTargetingMatchTypes.broad" /> Broad</label>
                </div>
              </div>

              <!-- Enter list toolbar -->
              <div v-if="form.keywordTargetTab === 'enter'" class="kt-toolbar">
                <div class="toolbar-field">
                  <span class="toolbar-label">Custom Bid</span>
                  <div class="enter-bid-wrap">
                    <InlineNumberInput
                      v-model="enterBid"
                      :step="0.01"
                      suffix="USD"
                      size="default"
                    />
                  </div>
                </div>
                <div class="toolbar-field match-types">
                  <span class="toolbar-label">Match type</span>
                  <label class="chk"><UiCheckbox v-model="enterMatchTypes.exact" /> Exact</label>
                  <label class="chk"><UiCheckbox v-model="enterMatchTypes.phrase" /> Phrase</label>
                  <label class="chk"><UiCheckbox v-model="enterMatchTypes.broad" /> Broad</label>
                </div>
              </div>

              <!-- Enter list panel -->
              <div v-if="form.keywordTargetTab === 'enter'" class="kt-panel kt-panel--enter">
                <textarea
                  v-model="enterListText"
                  class="enter-textarea"
                  placeholder="Enter keyword separated by new line"
                  rows="10"
                />
                <div class="enter-bottom-row">
                  <div class="enter-upload-side">
                    <input
                      ref="enterFileInput"
                      type="file"
                      accept=".txt,.csv,.tsv,.xlsx,.xls,text/plain,text/csv,text/tab-separated-values,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                      class="enter-file-input-hidden"
                      @change="onEnterListFile"
                    />
                    <div class="enter-file-actions">
                      <button type="button" class="enter-upload-lite" @click="triggerEnterFilePick">
                        Upload file
                      </button>
                      <button type="button" class="enter-download-template" @click="downloadEnterListTemplate">
                        <Download class="enter-download-template__icon" :size="14" :stroke-width="2" aria-hidden="true" />
                        Download the XLSX template
                      </button>
                    </div>
                  </div>
                  <div class="enter-actions">
                    <UiButton type="button" size="sm" variant="default" @click="commitEnterList">
                      Add keywords
                    </UiButton>
                  </div>
                </div>
              </div>

              <!-- Amazon -->
              <div v-else-if="form.keywordTargetTab === 'amazon'" class="kt-panel">
                <table class="data-table data-table--kw-stack">
                  <thead>
                    <tr>
                      <th class="kw-stack-th">
                        <span class="kw-stack-th__primary">Keyword</span>
                        <span class="kw-stack-th__secondary">
                          IS | IR
                          <span class="kw-isir-wrap">
                            <button
                              type="button"
                              class="kw-stack-th__info"
                              aria-label="About impression share (IS) and impression rate (IR)"
                            >
                              <img :src="iconHelpCircle" width="14" height="14" alt="" />
                            </button>
                            <span class="kw-isir-tooltip">
                              <strong>Impression share (IS)</strong> is the percentage of impressions
                              you're getting on this term relative to all the impressions it is
                              generating.<br /><br />
                              <strong>Impression rank (IR)</strong> is where your IS stands relative
                              to other advertisers' share of impressions for the same term.<br /><br />
                              Use these to understand your impression coverage and help you decide
                              how much to bid.
                            </span>
                          </span>
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
                <div class="campaigns-match-row toolbar-field match-types">
                  <span class="toolbar-label">Match type</span>
                  <label class="chk"><UiCheckbox v-model="form.keywordTargetingMatchTypes.exact" /> Exact</label>
                  <label class="chk"><UiCheckbox v-model="form.keywordTargetingMatchTypes.phrase" /> Phrase</label>
                  <label class="chk"><UiCheckbox v-model="form.keywordTargetingMatchTypes.broad" /> Broad</label>
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
                <div v-else class="campaigns-table-stack">
                  <div class="campaigns-table-scroll">
                    <table class="data-table flat">
                      <thead>
                        <tr>
                          <th class="narrow" aria-label="Select rows">
                            <UiCheckbox
                              v-if="campaignSelectableRowKeys.length"
                              :model-value="campaignAllSelectableSelected"
                              @update:model-value="onCampaignSelectAll"
                            />
                          </th>
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
                            <td :colspan="showCampaignSourceStatusColumn ? 6 : 5" class="kt-match-empty">
                              No keywords to display for this ad group.
                            </td>
                          </tr>
                        </template>
                        <template v-else>
                          <template v-for="group in campaignTableGroups" :key="group.base.id">
                            <tr v-for="(line, lineIdx) in group.lines" :key="line.rowKey">
                              <td class="narrow">
                                <UiCheckbox
                                  :model-value="!!campaignSelected[line.rowKey]"
                                  :disabled="isAdded(group.base.text, line.matchType)"
                                  @update:model-value="
                                    (checked) =>
                                      toggleCampaignRow(
                                        line.rowKey,
                                        group.base.text,
                                        line.matchType,
                                        checked
                                      )
                                  "
                                />
                              </td>
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
                  <div v-if="campaignSelectedCount > 0" class="campaigns-bulk-actions">
                    <UiButton type="button" size="sm" variant="default" @click="addSelectedCampaignRows">
                      Add selected
                    </UiButton>
                  </div>
                </div>
              </div>
            </div>

            <div class="kt-right-stack">
              <div v-if="form.keywords.length === 0" class="empty-block tight">
                <div class="empty-illus" aria-hidden="true">
                  <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                    <rect x="6" y="10" width="44" height="32" rx="4" stroke="var(--gray-300,#d0d7e2)" stroke-width="1.5" fill="var(--gray-50,#f8fafc)"/>
                    <path d="M14 26h28M14 33h18" stroke="var(--gray-300,#d0d7e2)" stroke-width="1.5" stroke-linecap="round"/>
                    <path d="M36 38l6 6M42 38l-6 6" stroke="var(--primary,#1876ff)" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
                  </svg>
                </div>
                <p class="empty-text">尚未添加关键词</p>
                <p class="empty-hint">从左侧添加关键词</p>
              </div>

              <div v-else class="added-table-wrap">
                <table class="data-table added-table">
                  <thead>
                    <tr>
                      <th class="kw-stack-th">
                        <span class="kw-stack-th__primary">Keyword</span>
                        <span class="kw-stack-th__secondary">
                          IS | IR
                          <span class="kw-isir-wrap">
                            <button
                              type="button"
                              class="kw-stack-th__info"
                              aria-label="About impression share (IS) and impression rate (IR)"
                            >
                              <img :src="iconHelpCircle" width="14" height="14" alt="" />
                            </button>
                            <span class="kw-isir-tooltip">
                              <strong>Impression share (IS)</strong> is the percentage of impressions
                              you're getting on this term relative to all the impressions it is
                              generating.<br /><br />
                              <strong>Impression rank (IR)</strong> is where your IS stands relative
                              to other advertisers' share of impressions for the same term.<br /><br />
                              Use these to understand your impression coverage and help you decide
                              how much to bid.
                            </span>
                          </span>
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
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useCampaignStore } from '@/stores/campaign'
import Stepper from '@/components/Stepper.vue'
import BottomBar from '@/components/BottomBar.vue'
import UnderlineTabs from '@/components/ui/UnderlineTabs.vue'
import UiSelect from '@/components/ui/select/Select.vue'
import InlineNumberInput from '@/components/base/InlineNumberInput.vue'
import UiButton from '@/components/ui/button/Button.vue'
import UiCheckbox from '@/components/ui/checkbox/Checkbox.vue'
import iconHelpCircle from '@/assets/icon-help-circle.svg'
import { useFlowSteps } from '@/composables/useFlowSteps'
import * as XLSX from 'xlsx'
import { Download } from 'lucide-vue-next'

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
  { id: 'enter', label: 'Enter list' },
  { id: 'campaigns', label: 'Select from campaigns' },
  { id: 'amazon', label: 'Amazon Suggested' }
]

const keywordAddedMatchTypeOptions = [
  { value: 'Exact', label: 'Exact' },
  { value: 'Phrase', label: 'Phrase' },
  { value: 'Broad', label: 'Broad' }
]

/** Campaigns 表「Source status」列：暂隐藏，改 true 可恢复 */
const showCampaignSourceStatusColumn = false

/** 表格行顺序：Phrase → Broad → Exact（与 Match type 勾选从左到右一致） */
const DISPLAY_MATCH_ORDER = ['Phrase', 'Broad', 'Exact']

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

/** 按 suggestByMatch 里存在的类型过滤，行顺序同 DISPLAY_MATCH_ORDER */
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
  const toolbarTypes = matchTypesFromToolbar()
  if (!toolbarTypes.length) return []
  return campaignKeywordRows.value
    .map((base) => {
      const fromData = matchTypesFromSuggest(base.suggestByMatch)
      const types = fromData.filter((mt) => toolbarTypes.includes(mt))
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

/** Campaigns 表：按行多选（rowKey = baseId-matchType） */
const campaignSelected = ref({})

const campaignSelectableRowKeys = computed(() => {
  const keys = []
  for (const g of campaignTableGroups.value) {
    for (const line of g.lines) {
      if (!isAdded(g.base.text, line.matchType)) keys.push(line.rowKey)
    }
  }
  return keys
})

const campaignSelectedCount = computed(() =>
  Object.keys(campaignSelected.value).filter((k) => campaignSelected.value[k]).length
)

const campaignAllSelectableSelected = computed(() => {
  const sel = campaignSelectableRowKeys.value
  if (!sel.length) return false
  return sel.every((k) => campaignSelected.value[k])
})

function clearCampaignRowSelection() {
  campaignSelected.value = {}
}

function toggleCampaignRow(rowKey, text, matchType, checked) {
  if (isAdded(text, matchType)) return
  const next = { ...campaignSelected.value }
  if (checked) next[rowKey] = true
  else delete next[rowKey]
  campaignSelected.value = next
}

function onCampaignSelectAll(checked) {
  if (checked) {
    const next = { ...campaignSelected.value }
    for (const k of campaignSelectableRowKeys.value) next[k] = true
    campaignSelected.value = next
  } else {
    campaignSelected.value = {}
  }
}

function addSelectedCampaignRows() {
  for (const g of campaignTableGroups.value) {
    for (const line of g.lines) {
      if (!campaignSelected.value[line.rowKey]) continue
      if (isAdded(g.base.text, line.matchType)) continue
      addFromRow({
        text: g.base.text,
        is: g.base.is,
        ir: g.base.ir,
        matchType: line.matchType,
        suggestBid: line.suggestBid,
        suggestRange: line.suggestRange
      })
    }
  }
  clearCampaignRowSelection()
}

watch(
  () => [
    form.value.keywordSelectedCampaignId,
    form.value.keywordSelectedAdGroupId,
    form.value.keywordTargetingMatchTypes.exact,
    form.value.keywordTargetingMatchTypes.phrase,
    form.value.keywordTargetingMatchTypes.broad,
  ],
  () => clearCampaignRowSelection()
)

watch(
  () => form.value.keywordTargetTab,
  (tab) => {
    if (tab !== 'campaigns') clearCampaignRowSelection()
  }
)

/* ── Enter list ── */
const enterListText = ref('')
const enterFileInput = ref(null)
const enterBid = ref(form.value.keywordTargetingDefaultBid ?? 0.75)
const enterMatchTypes = ref({ exact: true, broad: false, phrase: false })

function triggerEnterFilePick() {
  enterFileInput.value?.click()
}

function downloadEnterListTemplate() {
  const ws = XLSX.utils.aoa_to_sheet([
    ['Keyword', 'Match type', 'Suggested bid'],
    ['humidifier for bedroom', 'Phrase', '1.00'],
  ])
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Keywords')
  XLSX.writeFile(wb, 'keyword-import-template.xlsx')
}

function normalizeUploadText(raw) {
  return raw.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n')
}

/** 工作表首行起：列 0=关键词原文，1=Match type，2=Suggested bid（单元格不做 trim，仅去行尾 \\r） */
function workbookRowsRaw(wb) {
  const sn = wb.SheetNames[0]
  if (!sn) return []
  const ws = wb.Sheets[sn]
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' })
  return rows
    .map((r) => {
      const arr = Array.isArray(r) ? r : []
      return {
        c0: String(arr[0] ?? '').replace(/\r$/, ''),
        c1: String(arr[1] ?? '').replace(/\r$/, ''),
        c2: String(arr[2] ?? '').replace(/\r$/, ''),
      }
    })
    .filter((row) => row.c0.length > 0)
}

function rowHasExtraColumns(row) {
  return row.c1.trim() !== '' || row.c2.trim() !== ''
}

function isLikelyKeywordHeaderRow(row) {
  const a = row.c0.trim().toLowerCase()
  const b = row.c1.trim().toLowerCase()
  const c = row.c2.trim().toLowerCase()
  if (a === 'keyword' || a === 'keywords') return true
  if (a.includes('keyword') && (b.includes('match') || c.includes('suggest') || c.includes('bid')))
    return true
  return false
}

function stripHeaderRow(rows) {
  if (!rows.length || !isLikelyKeywordHeaderRow(rows[0])) return rows
  return rows.slice(1)
}

/** 纯文本 / 无表头的 TSV：无 \\t 则整行为关键词；有 \\t 则前三列为 c0/c1/c2 */
function parseTextLinesToKeywordRows(text) {
  const norm = normalizeUploadText(text)
  const lines = norm.split('\n').map((l) => l.replace(/\r$/, ''))
  const rows = []
  for (const line of lines) {
    if (line === '') continue
    if (!line.includes('\t')) {
      rows.push({ c0: line, c1: '', c2: '' })
    } else {
      const p = line.split('\t')
      rows.push({
        c0: p[0] ?? '',
        c1: p[1] ?? '',
        c2: p[2] ?? '',
      })
    }
  }
  return rows
}

function normalizeMatchTypeCell(raw) {
  const s = String(raw ?? '').trim().toUpperCase()
  if (s === 'EXACT' || s === 'E') return 'Exact'
  if (s === 'PHRASE' || s === 'P') return 'Phrase'
  if (s === 'BROAD' || s === 'B') return 'Broad'
  return null
}

function parseSuggestedBidCell(raw) {
  const s = String(raw ?? '').trim()
  if (!s) return { suggestBid: '—', suggestRange: '—', bidNum: null }
  const n = parseFloat(s.replace(/[$,\s]/g, ''))
  if (Number.isFinite(n) && n >= 0) {
    return { suggestBid: `$${n.toFixed(2)}`, suggestRange: '—', bidNum: n }
  }
  return { suggestBid: s, suggestRange: '—', bidNum: null }
}

/** 上传：支持三列（Keyword / Match type / Suggested bid）；仅首列有内容时与旧版一致 */
function processKeywordUploadRows(rows) {
  const rowsUse = stripHeaderRow(rows)
  if (!rowsUse.length) return

  const multi = rowsUse.some(rowHasExtraColumns)
  if (!multi) {
    const joined = rowsUse.map((r) => r.c0).join('\n')
    if (joined.trim()) addEnterListLines(joined, { fromUpload: true })
    return
  }

  const fallbackTypes = [
    enterMatchTypes.value.exact && 'Exact',
    enterMatchTypes.value.phrase && 'Phrase',
    enterMatchTypes.value.broad && 'Broad',
  ].filter(Boolean)
  if (!fallbackTypes.length) return

  const defaultBid = enterBid.value || form.value.keywordTargetingDefaultBid

  for (const row of rowsUse) {
    if (!row.c0.length) continue
    const mtCell = normalizeMatchTypeCell(row.c1)
    const matchList = mtCell ? [mtCell] : fallbackTypes
    const sug = parseSuggestedBidCell(row.c2)
    const bidVal = sug.bidNum != null ? sug.bidNum : defaultBid

    for (const matchType of matchList) {
      const already = form.value.keywords.some(
        (k) => k.text === row.c0 && k.matchType === matchType
      )
      if (already) continue
      const id = `kw-enter-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
      form.value.keywords.push({
        id,
        text: row.c0,
        subtitle: '',
        matchType,
        is: '—',
        ir: '—',
        suggestBid: sug.suggestBid,
        suggestRange: sug.suggestRange,
        bid: bidVal,
      })
    }
  }
}

async function onEnterListFile(ev) {
  const input = ev.target
  const file = input.files?.[0]
  if (!file) return
  const lower = file.name.toLowerCase()
  const type = file.type || ''
  try {
    const isXlsx =
      lower.endsWith('.xlsx') ||
      type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    const isXls = lower.endsWith('.xls') || type === 'application/vnd.ms-excel'
    const isCsv = lower.endsWith('.csv') || type === 'text/csv'
    const isTsv = lower.endsWith('.tsv') || type === 'text/tab-separated-values'

    if (isXlsx || isXls) {
      const buf = await file.arrayBuffer()
      const wb = XLSX.read(buf, { type: 'array' })
      processKeywordUploadRows(workbookRowsRaw(wb))
    } else if (isCsv) {
      const text = normalizeUploadText(await file.text())
      const wb = XLSX.read(text, { type: 'string' })
      processKeywordUploadRows(workbookRowsRaw(wb))
    } else if (isTsv) {
      const text = normalizeUploadText(await file.text())
      const rows = text
        .split('\n')
        .map((line) => {
          const l = line.replace(/\r$/, '')
          if (l === '') return null
          const p = l.split('\t')
          return {
            c0: p[0] ?? '',
            c1: p[1] ?? '',
            c2: p[2] ?? '',
          }
        })
        .filter(Boolean)
        .filter((row) => row.c0.length > 0)
      processKeywordUploadRows(rows)
    } else {
      const out = normalizeUploadText(await file.text())
      if (out.trim()) processKeywordUploadRows(parseTextLinesToKeywordRows(out))
    }
  } catch {
    /* ignore read / parse errors */
  }
  input.value = ''
}

/** 按当前 Custom Bid / Match type 将多行文本加入右侧列表（与「Add keywords」一致） */
function addEnterListLines(sourceText, { fromUpload = false } = {}) {
  const bid = enterBid.value || form.value.keywordTargetingDefaultBid
  const selectedTypes = [
    enterMatchTypes.value.exact  && 'Exact',
    enterMatchTypes.value.phrase && 'Phrase',
    enterMatchTypes.value.broad  && 'Broad',
  ].filter(Boolean)

  if (!selectedTypes.length) return

  const lines = fromUpload
    ? normalizeUploadText(sourceText)
        .split('\n')
        .map((l) => l.replace(/\r$/, ''))
        .filter((l) => l !== '')
    : sourceText.split('\n').map((l) => l.trim()).filter(Boolean)
  lines.forEach((line) => {
    selectedTypes.forEach((matchType) => {
      const alreadyAdded = fromUpload
        ? form.value.keywords.some((k) => k.text === line && k.matchType === matchType)
        : form.value.keywords.some(
            (k) => k.text.toLowerCase() === line.toLowerCase() && k.matchType === matchType
          )
      if (alreadyAdded) return
      const id = `kw-enter-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
      form.value.keywords.push({
        id,
        text: line,
        subtitle: '',
        matchType,
        is: '—',
        ir: '—',
        suggestBid: '—',
        suggestRange: '—',
        bid,
      })
    })
  })
}

function commitEnterList() {
  addEnterListLines(enterListText.value, { fromUpload: false })
  enterListText.value = ''
}

function removeAdded(id) {
  form.value.keywords = form.value.keywords.filter(k => k.id !== id)
}

function removeAllAdded() {
  form.value.keywords = []
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

/* 固定最小高度 + border-box，与右侧表格区域竖向节奏对齐 */
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

.enter-bid-wrap {
  max-width: 220px;
  width: 100%;
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

.kt-panel--enter {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.enter-bottom-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  width: 100%;
}

.enter-upload-side {
  position: relative;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.enter-file-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.enter-file-input-hidden {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
}

.enter-upload-lite {
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

.enter-upload-lite:hover {
  border-color: var(--primary, #1d4ed8);
  color: var(--primary, #1d4ed8);
  background: #fff;
}

.enter-download-template {
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

.enter-download-template:hover {
  color: var(--primary, #1d4ed8);
}

.enter-download-template:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.35);
}

.enter-download-template__icon {
  flex-shrink: 0;
  color: inherit;
}

.enter-hint {
  margin: 0;
  font-size: var(--text-sm, 13px);
  color: var(--text-sub, #6b7280);
  line-height: 1.6;
}

.enter-textarea {
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
.enter-textarea:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59,130,246,.15);
}
.enter-textarea::placeholder {
  color: #9ca3af;
}
.enter-actions {
  display: flex;
  justify-content: flex-end;
  flex-shrink: 0;
}
.filters-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 0;
}

.campaigns-match-row {
  flex-wrap: wrap;
  margin-top: 20px;
  margin-bottom: 18px;
}

.campaigns-table-stack {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 0;
}

.campaigns-table-scroll {
  overflow: auto;
  width: 100%;
}

.campaigns-bulk-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 12px;
  flex-shrink: 0;
}

.campaigns-table-stack .narrow {
  width: 40px;
  text-align: center;
  vertical-align: middle;
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

/* IS | IR tooltip bubble */
.kw-isir-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.kw-isir-tooltip {
  display: none;
  position: absolute;
  top: calc(100% + 8px);
  left: -8px;
  transform: none;
  width: 280px;
  background: #1c1f23;
  color: #fff;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.65;
  padding: 10px 14px;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  pointer-events: none;
  z-index: 200;
  white-space: normal;
  text-align: left;
}

.kw-isir-tooltip::after {
  content: '';
  position: absolute;
  bottom: 100%;
  left: 14px;
  transform: none;
  border: 5px solid transparent;
  border-bottom-color: #1c1f23;
}

.kw-isir-wrap:hover .kw-isir-tooltip {
  display: block;
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
  justify-content: space-between;
  gap: 12px;
  padding: 12px 20px;
  border-bottom: 1px solid var(--border);
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
  flex-shrink: 0;
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

/* 与左侧 .kt-panel 一致：左右 20px、底 14px；顶 18px 与左侧工具栏下缘节奏对齐 */
.added-table-wrap {
  flex: 1;
  overflow: auto;
  padding: 18px 20px 14px;
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
