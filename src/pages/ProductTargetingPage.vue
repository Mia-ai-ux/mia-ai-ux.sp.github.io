<template>
  <div class="page-layout">
    <div class="page-center">
      <Stepper :steps="steps" :current-step="getStepNumber('/product-targeting')" />

      <div class="content-wrapper">
        <h2 class="page-title">Product targeting</h2>

        <main class="main-content">

          <!-- ═══════════════ Categories Module ═══════════════ -->
          <section class="pt-module">
            <div class="pt-module-head">
              <h3 class="pt-module-title">Categories</h3>
            </div>

            <div class="pt-shell">
              <!-- Row 1: tabs | right head -->
              <div class="pt-tabs-row">
                <UnderlineTabs v-model="form.productCategoryTab" :items="categorySubTabs" size="lg" />
              </div>
              <div class="pt-right-head">
                <span class="added-title">{{ categoryTargets.length }} added</span>
                <button
                  v-if="categoryTargets.length > 0"
                  type="button"
                  class="link-btn"
                  @click="removeAllCategories"
                >
                  Remove all
                </button>
              </div>

              <!-- Row 2: left content | right content -->
              <div class="pt-left-stack">
                <!-- ── Categories: suggested ── -->
                <div v-if="form.productCategoryTab === 'suggested'" class="pt-panel">
                  <table class="data-table">
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th>Suggested bid</th>
                        <th class="action-col" aria-label="Action"></th>
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
                          <button type="button" class="text-add-btn" aria-label="Add category" @click="addCategory(row)">Add</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- ── Categories: campaigns ── -->
                <div v-else-if="form.productCategoryTab === 'campaigns'" class="pt-panel pt-panel--campaigns">
                  <div class="filters-row">
                    <label class="filter-field">
                      <span class="toolbar-label">Campaign</span>
                      <div class="filter-ui-select">
                        <UiSelect
                          v-model="form.productSelectedCampaignId"
                          placeholder="Select campaign"
                          :options="ptCampaignSelectOptions"
                        />
                      </div>
                    </label>
                    <label class="filter-field">
                      <span class="toolbar-label">Ad group</span>
                      <div class="filter-ui-select">
                        <UiSelect
                          v-model="form.productSelectedAdGroupId"
                          placeholder="Select ad group"
                          :options="ptAdGroupSelectOptions"
                          :disabled="!form.productSelectedCampaignId"
                        />
                      </div>
                    </label>
                  </div>
                  <template v-if="!form.productSelectedCampaignId || !form.productSelectedAdGroupId">
                    <div class="empty-block">
                      <div class="empty-illus" aria-hidden="true">
                        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                          <rect x="8" y="14" width="48" height="36" rx="4" stroke="var(--gray-300,#d0d7e2)" stroke-width="1.5" fill="var(--gray-50,#f8fafc)"/>
                          <path d="M20 32h24M20 40h16" stroke="var(--gray-300,#d0d7e2)" stroke-width="1.5" stroke-linecap="round"/>
                          <circle cx="32" cy="24" r="4" stroke="var(--gray-300,#d0d7e2)" stroke-width="1.5"/>
                        </svg>
                      </div>
                      <p class="empty-text">请先选择 Campaign 和 Ad Group</p>
                      <p class="empty-hint">选择后将展示该广告组下的历史分类</p>
                    </div>
                  </template>
                  <template v-else>
                    <table class="data-table">
                      <thead>
                        <tr>
                          <th>Category</th>
                          <th>Source group status</th>
                          <th>Status</th>
                          <th>Suggested bid</th>
                          <th class="action-col" aria-label="Action"></th>
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
                            <button type="button" class="text-add-btn" aria-label="Add category" @click="addCategory(row)">Add</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </template>
                </div>
              </div>

              <div class="pt-right-stack">
                <div v-if="categoryTargets.length === 0" class="empty-block tight">
                  <div class="empty-illus" aria-hidden="true">
                    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                      <rect x="6" y="10" width="44" height="32" rx="4" stroke="var(--gray-300,#d0d7e2)" stroke-width="1.5" fill="var(--gray-50,#f8fafc)"/>
                      <path d="M14 26h28M14 33h18" stroke="var(--gray-300,#d0d7e2)" stroke-width="1.5" stroke-linecap="round"/>
                      <path d="M36 38l6 6M42 38l-6 6" stroke="var(--primary,#1876ff)" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
                    </svg>
                  </div>
                  <p class="empty-text">尚未添加分类</p>
                  <p class="empty-hint">从左侧选择并添加</p>
                </div>

                <div v-else class="added-table-wrap">
                  <table class="data-table added-table">
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th>Bid</th>
                        <th class="action-col" aria-label="Action"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="row in categoryTargets" :key="row.id">
                        <td>
                          <p class="cell-title">{{ row.title }}</p>
                        </td>
                        <td>
                          <span class="bid-input-wrap bid-input-wrap--minimal">
                            <span class="currency">$</span>
                            <input
                              v-model.number="row.bid"
                              class="bid-input"
                              type="number"
                              step="0.01"
                              min="0"
                              :placeholder="Number(form.productTargetingDefaultBid).toFixed(2)"
                            />
                          </span>
                        </td>
                        <td class="action-col">
                          <button type="button" class="icon-remove" aria-label="Remove" @click="removeAdded(row.id)">×</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          <!-- ═══════════════ Products Module ═══════════════ -->
          <section class="pt-module">
            <div class="pt-module-head">
              <h3 class="pt-module-title">Products</h3>
            </div>

            <div class="pt-shell">
              <!-- Row 1: tabs | right head -->
              <div class="pt-tabs-row">
                <UnderlineTabs v-model="form.productProductTab" :items="productSubTabs" size="lg" />
              </div>
              <div class="pt-right-head">
                <span class="added-title">{{ productOnlyTargets.length }} added</span>
              </div>

              <!-- Row 2: left content | right content -->
              <div class="pt-left-stack">
                <div v-if="form.productProductTab !== 'campaigns'" class="pt-toolbar">
                  <div class="toolbar-field match-row">
                    <span class="toolbar-label">Targeting type</span>
                    <label class="chk"><input v-model="form.productDeliveryType.exact" type="checkbox" /> Exact</label>
                    <label class="chk"><input v-model="form.productDeliveryType.expanded" type="checkbox" /> Expanded</label>
                  </div>
                </div>

                <!-- ── Products: suggested ── -->
                <div v-if="form.productProductTab === 'suggested'" class="pt-panel">
                  <table class="data-table product-table">
                    <thead>
                      <tr>
                        <th class="col-product">Product</th>
                        <th>Type</th>
                        <th>Suggested bid</th>
                        <th>Reviews</th>
                        <th class="action-col" aria-label="Action"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <template v-for="p in filteredSuggestedProducts" :key="p.id">
                        <!-- single-type row -->
                        <tr v-if="!bothDeliveryChecked">
                          <td class="col-product">
                            <div class="prod-cell">
                              <div class="prod-thumb">
                                <img :src="p.image" :alt="p.title" />
                              </div>
                              <div class="prod-text">
                                <p class="cell-title">{{ p.title }}</p>
                                <p class="cell-meta">
                                  <span class="meta-stars">
                                    <svg v-for="i in 5" :key="i" width="10" height="10" viewBox="0 0 12 12" :fill="i <= Math.round(p.rating) ? '#f5a623' : '#e0e0e0'">
                                      <path d="M6 1l1.3 2.6 2.9.4-2.1 2 .5 2.9L6 7.5l-2.6 1.4.5-2.9-2.1-2 2.9-.4z" />
                                    </svg>
                                  </span>
                                  <span>({{ p.reviews.toLocaleString() }})</span>
                                  <span class="meta-sep">|</span>
                                  <span class="meta-orig-price">{{ p.originalPrice }}</span>
                                  <span class="meta-price">{{ p.price }}</span>
                                  <span class="meta-sep">|</span>
                                  <span>{{ p.stock }}</span>
                                  <span class="meta-sep">|</span>
                                  <span>ASIN: {{ p.asin }}</span>
                                </p>
                              </div>
                            </div>
                          </td>
                          <td>{{ p.matchType === 'exact' ? 'Exact' : 'Expanded' }}</td>
                          <td>
                            <span class="sugg-main">{{ p.suggestBid }}</span>
                            <div v-if="p.suggestRange" class="sugg-range">{{ p.suggestRange }}</div>
                          </td>
                          <td class="muted">{{ p.reviews.toLocaleString() }}</td>
                          <td class="action-col">
                            <button type="button" class="text-add-btn" aria-label="Add product" @click="addProduct(p)">Add</button>
                          </td>
                        </tr>
                        <!-- both-type: Exact row -->
                        <template v-else>
                          <tr class="dual-row dual-row--first">
                            <td class="col-product" rowspan="2">
                              <div class="prod-cell">
                                <div class="prod-thumb">
                                  <img :src="p.image" :alt="p.title" />
                                </div>
                                <div class="prod-text">
                                  <p class="cell-title">{{ p.title }}</p>
                                  <p class="cell-meta">
                                    <span class="meta-stars">
                                      <svg v-for="i in 5" :key="i" width="10" height="10" viewBox="0 0 12 12" :fill="i <= Math.round(p.rating) ? '#f5a623' : '#e0e0e0'">
                                        <path d="M6 1l1.3 2.6 2.9.4-2.1 2 .5 2.9L6 7.5l-2.6 1.4.5-2.9-2.1-2 2.9-.4z" />
                                      </svg>
                                    </span>
                                    <span>({{ p.reviews.toLocaleString() }})</span>
                                    <span class="meta-sep">|</span>
                                    <span class="meta-orig-price">{{ p.originalPrice }}</span>
                                    <span class="meta-price">{{ p.price }}</span>
                                    <span class="meta-sep">|</span>
                                    <span>{{ p.stock }}</span>
                                    <span class="meta-sep">|</span>
                                    <span>ASIN: {{ p.asin }}</span>
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td>Exact</td>
                            <td>
                              <span class="sugg-main">{{ p.suggestBid }}</span>
                              <div v-if="p.suggestRange" class="sugg-range">{{ p.suggestRange }}</div>
                            </td>
                            <td class="muted">{{ p.reviews.toLocaleString() }}</td>
                            <td class="action-col">
                              <button
                                type="button"
                                class="text-add-btn"
                                :class="{ 'text-add-btn--added': isProductAdded(p.asin, 'Exact') }"
                                aria-label="Add product as Exact"
                                @click="addProductWithType(p, 'Exact')"
                              >{{ isProductAdded(p.asin, 'Exact') ? 'Added' : 'Add' }}</button>
                            </td>
                          </tr>
                          <!-- both-type: Expanded row -->
                          <tr class="dual-row dual-row--second">
                            <td>Expanded</td>
                            <td></td>
                            <td></td>
                            <td class="action-col">
                              <button
                                type="button"
                                class="text-add-btn"
                                :class="{ 'text-add-btn--added': isProductAdded(p.asin, 'Expanded') }"
                                aria-label="Add product as Expanded"
                                @click="addProductWithType(p, 'Expanded')"
                              >{{ isProductAdded(p.asin, 'Expanded') ? 'Added' : 'Add' }}</button>
                            </td>
                          </tr>
                        </template>
                      </template>
                    </tbody>
                  </table>
                </div>

                <!-- ── Products: library ── -->
                <div v-else-if="form.productProductTab === 'library'" class="pt-panel">
                  <table class="data-table product-table">
                    <thead>
                      <tr>
                        <th class="col-product">Product</th>
                        <th>Type</th>
                        <th>Suggested bid</th>
                        <th class="action-col" aria-label="Action"></th>
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
                          <button type="button" class="text-add-btn" aria-label="Add product" @click="addProductFromLibrary(p)">Add</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- ── Products: campaigns ── -->
                <div v-else-if="form.productProductTab === 'campaigns'" class="pt-panel pt-panel--campaigns">
                  <div class="filters-row">
                    <label class="filter-field">
                      <span class="toolbar-label">Campaign</span>
                      <div class="filter-ui-select">
                        <UiSelect
                          v-model="form.productSelectedCampaignId"
                          placeholder="Select campaign"
                          :options="ptCampaignSelectOptions"
                        />
                      </div>
                    </label>
                    <label class="filter-field">
                      <span class="toolbar-label">Ad group</span>
                      <div class="filter-ui-select">
                        <UiSelect
                          v-model="form.productSelectedAdGroupId"
                          placeholder="Select ad group"
                          :options="ptAdGroupSelectOptions"
                          :disabled="!form.productSelectedCampaignId"
                        />
                      </div>
                    </label>
                  </div>
                  <template v-if="!form.productSelectedCampaignId || !form.productSelectedAdGroupId">
                    <div class="empty-block">
                      <div class="empty-illus" aria-hidden="true">
                        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                          <rect x="8" y="14" width="48" height="36" rx="4" stroke="var(--gray-300,#d0d7e2)" stroke-width="1.5" fill="var(--gray-50,#f8fafc)"/>
                          <path d="M20 32h24M20 40h16" stroke="var(--gray-300,#d0d7e2)" stroke-width="1.5" stroke-linecap="round"/>
                          <circle cx="32" cy="24" r="4" stroke="var(--gray-300,#d0d7e2)" stroke-width="1.5"/>
                        </svg>
                      </div>
                      <p class="empty-text">请先选择 Campaign 和 Ad Group</p>
                      <p class="empty-hint">选择后将展示该广告组下的历史商品定向</p>
                    </div>
                  </template>
                  <template v-else>
                    <table class="data-table product-table">
                      <thead>
                        <tr>
                          <th class="col-product">Product</th>
                          <th>Source group status</th>
                          <th>Type</th>
                          <th>Suggested bid</th>
                          <th class="action-col" aria-label="Action"></th>
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
                            <button type="button" class="text-add-btn" aria-label="Add product" @click="addProduct(p)">Add</button>
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

              <div class="pt-right-stack">
                <!-- toolbar -->
                <div class="pt-added-toolbar">
                  <button type="button" class="add-asin-btn" @click="addManualProductRow">
                    <span class="add-asin-btn__plus" aria-hidden="true">+</span>
                    Add product
                  </button>
                  <button
                    v-if="productOnlyTargets.length > 0"
                    type="button"
                    class="remove-all-text-btn"
                    @click="removeAllProducts"
                  >Remove all</button>
                </div>

                <div v-if="productOnlyTargets.length === 0" class="empty-block tight">
                  <div class="empty-illus" aria-hidden="true">
                    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                      <rect x="6" y="10" width="44" height="32" rx="4" stroke="var(--gray-300,#d0d7e2)" stroke-width="1.5" fill="var(--gray-50,#f8fafc)"/>
                      <path d="M14 26h28M14 33h18" stroke="var(--gray-300,#d0d7e2)" stroke-width="1.5" stroke-linecap="round"/>
                      <path d="M36 38l6 6M42 38l-6 6" stroke="var(--primary,#1876ff)" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
                    </svg>
                  </div>
                  <p class="empty-text">尚未添加商品</p>
                  <p class="empty-hint">从左侧选择添加，或点击上方 + Add product 手动输入</p>
                </div>

                <div v-else class="added-table-wrap">
                  <table class="data-table added-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Type</th>
                        <th>Bid</th>
                        <th class="action-col" aria-label="Action"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="row in productOnlyTargets" :key="row.id">
                        <td>
                          <template v-if="row.manual">
                            <input
                              :id="'added-asin-' + row.id"
                              v-model="row.asin"
                              class="added-kw-input"
                              type="text"
                              placeholder="Enter ASIN (e.g. B08Q6LV5CR)"
                              @keydown.enter="commitManualAsin(row)"
                              @blur="commitManualAsin(row)"
                            />
                          </template>
                          <template v-else>
                            <div class="added-product">
                              <div class="added-thumb">
                                <img v-if="row.image" :src="row.image" :alt="row.title" />
                                <svg v-else width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
                                  <rect width="40" height="40" rx="4" fill="#f3f5f8"/>
                                  <rect x="10" y="12" width="20" height="16" rx="2" stroke="#c8cdd4" stroke-width="1.2" fill="none"/>
                                  <circle cx="15" cy="18" r="2" fill="#c8cdd4"/>
                                  <path d="M10 24l5-4 4 3 4-3 7 5" stroke="#c8cdd4" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                              </div>
                              <div class="added-product__info">
                                <p class="cell-title">{{ row.title || row.asin }}</p>
                                <p class="cell-meta">
                                  <span class="meta-sep" style="color:#d0d0d0">ASIN:</span>
                                  {{ row.asin }}
                                </p>
                              </div>
                            </div>
                          </template>
                        </td>
                        <td class="col-type">
                          <div class="added-match-select">
                            <UiSelect
                              v-model="row.deliveryType"
                              size="sm"
                              :options="deliveryTypeOptions"
                            />
                          </div>
                        </td>
                        <td>
                          <span class="bid-input-wrap bid-input-wrap--minimal">
                            <span class="currency">$</span>
                            <input
                              v-model.number="row.bid"
                              class="bid-input"
                              type="number"
                              step="0.01"
                              min="0"
                              :placeholder="Number(form.productTargetingDefaultBid).toFixed(2)"
                            />
                          </span>
                        </td>
                        <td class="action-col">
                          <button type="button" class="icon-remove" aria-label="Remove" @click="removeAdded(row.id)">×</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
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
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useCampaignStore } from '@/stores/campaign'
import Stepper from '@/components/Stepper.vue'
import BottomBar from '@/components/BottomBar.vue'
import UiSelect from '@/components/ui/select/Select.vue'
import UnderlineTabs from '@/components/ui/UnderlineTabs.vue'
import { useFlowSteps } from '@/composables/useFlowSteps'

const router = useRouter()
const store = useCampaignStore()
const { form } = storeToRefs(store)
const { steps, getStepNumber, getNextPath, getBackPath } = useFlowSteps()

onMounted(() => {
  store.form.targeting = 'manual'
  store.form.manualTargetType = 'product'
})

const deliveryTypeOptions = [
  { label: 'Exact',    value: 'Exact' },
  { label: 'Expanded', value: 'Expanded' }
]

const categorySubTabs = [
  { id: 'campaigns', label: 'Select from campaigns' },
  { id: 'suggested', label: 'Amazon suggested' }
]

const productSubTabs = [
  { id: 'campaigns', label: 'Select from campaigns' },
  { id: 'suggested', label: 'Amazon suggested' }
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

const ptCampaignSelectOptions = computed(() =>
  mockCampaigns.map(c => ({ value: c.id, label: c.name }))
)

const ptAdGroupSelectOptions = computed(() =>
  filteredAdGroups.value.map(g => ({ value: g.id, label: g.name }))
)

watch(
  () => form.value.productSelectedCampaignId,
  () => { form.value.productSelectedAdGroupId = '' }
)

const campaignCategoryRows = computed(() => {
  if (!form.value.productSelectedCampaignId || !form.value.productSelectedAdGroupId) return []
  return [
    { id: 'cc1', path: 'Home & Garden > Space Heaters > Ceramic', sourceStatus: 'Active', status: 'Enabled', suggestBid: '$0.61', suggestRange: '$0.48–$0.78' },
    { id: 'cc2', path: 'Home & Garden > Fans > Tower Fans', sourceStatus: 'Active', status: 'Enabled', suggestBid: '$0.44', suggestRange: '$0.32–$0.58' }
  ]
})

const suggestedProducts = [
  { id: 'p1', asin: 'B08Q6LV5CR', title: 'PureMate 46-inch Tower Fan', image: 'https://m.media-amazon.com/images/I/61e7RvINXUL._AC_SL1500_.jpg', stock: 'In stock', suggestBid: '—', suggestRange: '', originalPrice: '$69.99', price: '$59.49', rating: 4.5, reviews: 3201, matchType: 'exact' },
  { id: 'p2', asin: 'B0C5CV8CTW', title: 'Dreo Ceramic Heater, 2025 Winter Mode', image: 'https://m.media-amazon.com/images/I/81G+4gzszVL._AC_SY879_.jpg', stock: 'In stock', suggestBid: '$1.12', suggestRange: '$0.88–$1.35', originalPrice: '$41.22', price: '$39.25', rating: 4.5, reviews: 16346, matchType: 'expanded' },
  { id: 'p3', asin: 'B09XK2DTVP', title: 'Vornado MVH Vortex Heater', image: 'https://m.media-amazon.com/images/I/71pB9RvWyRL._AC_SL1500_.jpg', stock: 'Out of stock', suggestBid: '$0.98', suggestRange: '$0.72–$1.15', originalPrice: '$59.99', price: '$49.99', rating: 4.4, reviews: 8921, matchType: 'exact' }
]

const campaignProductRows = computed(() => {
  if (!form.value.productSelectedCampaignId || !form.value.productSelectedAdGroupId) return []
  return suggestedProducts.slice(0, 2).map((p, i) => ({
    ...p,
    id: `cp-${p.asin}-${i}`,
    sourceStatus: 'Active'
  }))
})

const categoryTargets = computed(() =>
  form.value.productTargets.filter(t => t.kind === 'category')
)

const productOnlyTargets = computed(() =>
  form.value.productTargets.filter(t => t.kind === 'product')
)

const bothDeliveryChecked = computed(() =>
  form.value.productDeliveryType.exact && form.value.productDeliveryType.expanded
)

const filteredSuggestedProducts = computed(() => {
  const { exact, expanded } = form.value.productDeliveryType
  if (!exact && !expanded) return []
  if (exact && expanded) return suggestedProducts
  return suggestedProducts.filter(p =>
    exact ? p.matchType === 'exact' : p.matchType === 'expanded'
  )
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

function addProductWithType(p, delivery) {
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

function addManualProductRow() {
  const id = `pt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
  form.value.productTargets.push({
    id,
    kind: 'product',
    productKey: `prod:manual-${id}:Exact`,
    title: '',
    asin: '',
    image: '',
    deliveryType: 'Exact',
    suggestBid: '—',
    suggestRange: '',
    bid: form.value.productTargetingDefaultBid,
    checked: false,
    manual: true
  })
  nextTick(() => {
    const el = document.getElementById(`added-asin-${id}`)
    if (el) el.focus()
  })
}

function commitManualAsin(row) {
  const asin = (row.asin || '').trim().toUpperCase()
  if (!asin) return
  row.asin = asin
  row.title = row.title || asin
  row.productKey = productKey(asin, row.deliveryType)
  row.manual = false
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

function addAllCategorySource() {
  const tab = form.value.productCategoryTab
  let rows = []
  if (tab === 'suggested') rows = suggestedCategories
  else if (tab === 'search') rows = filteredSearchCategories.value
  else if (tab === 'campaigns') rows = campaignCategoryRows.value
  rows.forEach(row => addCategory(row))
}

function addAllProductSource() {
  const tab = form.value.productProductTab
  if (tab === 'suggested') {
    suggestedProducts.forEach(p => addProduct(p))
  } else if (tab === 'library') {
    form.value.libraryProductAsins.forEach(p => addProductFromLibrary(p))
  } else if (tab === 'campaigns') {
    campaignProductRows.value.forEach(p => addProduct(p))
  }
}

function removeAdded(id) {
  form.value.productTargets = form.value.productTargets.filter(t => t.id !== id)
}

function removeAllCategories() {
  form.value.productTargets = form.value.productTargets.filter(t => t.kind !== 'category')
}

function removeAllProducts() {
  form.value.productTargets = form.value.productTargets.filter(t => t.kind !== 'product')
}

function onCancel() { router.push('/') }
function onBack() { router.push(getBackPath('/product-targeting')) }
function onNext() { router.push(getNextPath('/product-targeting')) }
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
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* ── Module card ── */
.pt-module {
  background: var(--bg-card);
  overflow: hidden;
}

.pt-module-head {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
}

.pt-module-title {
  font-size: var(--text-2xl, 22px);
  font-weight: 600;
  color: var(--text-main);
  margin: 0;
}

/* ── Shell: 2×2 grid (tabs|head / content|content) ── */
.pt-shell {
  display: grid;
  grid-template-columns: minmax(0, 56%) 1fr;
  grid-template-rows: auto 1fr;
  min-height: 400px;
}

/* Row 1 col 1: tabs */
.pt-tabs-row {
  grid-column: 1;
  grid-row: 1;
  align-self: stretch;
  padding: 0 16px;
  border-bottom: 1px solid var(--border);
  border-right: 1px solid var(--border);
  box-sizing: border-box;
}

.pt-tabs-row :deep(.underline-tabs) {
  width: 100%;
}

.pt-tabs-row :deep(.underline-tabs--lg .underline-tabs__trigger) {
  padding-left: 0;
  padding-right: 0;
}

/* Row 1 col 2: "N added" head */
.pt-right-head {
  grid-column: 2;
  grid-row: 1;
  align-self: stretch;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
  box-sizing: border-box;
}

/* Row 2 col 1: left content */
.pt-left-stack {
  grid-column: 1;
  grid-row: 2;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--border);
}

/* Row 2 col 2: right content */
.pt-added-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  box-sizing: border-box;
  flex-shrink: 0;
  min-height: 52px;
  padding: 14px 20px;
}

.add-asin-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin: 0;
  padding: 0;
  border: none;
  background: none;
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  color: var(--primary, #1876ff);
  cursor: pointer;
}
.add-asin-btn:hover { opacity: 0.75; }

.add-asin-btn__plus {
  font-size: 15px;
  font-weight: 500;
  line-height: 1;
}

.remove-all-text-btn {
  margin: 0;
  padding: 0;
  border: none;
  background: none;
  font-family: inherit;
  font-size: 13px;
  color: var(--text-sub);
  cursor: pointer;
}
.remove-all-text-btn:hover { color: var(--text-main); }

.added-kw-input {
  width: 100%;
  box-sizing: border-box;
  border: none;
  padding: 0 4px;
  font-size: 13px;
  font-family: inherit;
  color: var(--text-main);
  background: transparent;
  outline: none;
}
.added-kw-input::placeholder { color: #c0c8d8; }

.pt-right-stack {
  grid-column: 2;
  grid-row: 2;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
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

.pt-toolbar {
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

.col-type {
  white-space: nowrap;
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
}

.added-match-select :deep(.ui-select-trigger:hover) { border-color: transparent; }
.added-match-select :deep(.ui-select-trigger:focus-visible) {
  outline: none;
  border-color: transparent;
  box-shadow: none;
}

.added-match-select :deep(.ui-select-chevron) { color: #94a3b8; }

.added-table .bid-input-wrap--minimal {
  border: none;
  background: transparent;
  padding: 0 4px;
  height: auto;
  min-height: 32px;
}

.added-table .bid-input-wrap--minimal .bid-input {
  flex: 1 1 auto;
  width: 72px;
  min-width: 56px;
  max-width: 100%;
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
  padding: 0 20px 14px;
}

.pt-panel--campaigns {
  padding-top: 18px;
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

/* ── Data table ── */
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
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
  font-size: 12px;
  color: var(--text-sub);
  line-height: 1.5;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 3px;
}

.meta-stars {
  display: inline-flex;
  align-items: center;
  gap: 1px;
}

.meta-sep {
  color: #d0d0d0;
}

.meta-orig-price {
  color: #999;
  text-decoration: line-through;
}

.meta-price {
  color: #fe4041;
  font-weight: 500;
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

.text-add-btn {
  background: none;
  border: none;
  color: #1876ff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  font-family: inherit;
  transition: opacity 0.15s;
  white-space: nowrap;
}

.text-add-btn:hover {
  opacity: 0.7;
}

.text-add-btn--added {
  color: var(--text-sub);
  cursor: default;
  pointer-events: none;
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

/* When a product spans 2 rows, suppress the inner border between them */
.product-table .dual-row--first td:not(.col-product) {
  border-bottom: none;
}

.product-table .dual-row--second td {
  border-bottom: 1px solid #f1f5f9;
  padding-top: 6px;
}

.product-table .dual-row--first .col-product {
  vertical-align: middle;
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
  border: 1px solid var(--border);
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
  border: 1px solid var(--border);
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

/* ── Empty states ── */
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
  font-weight: 500;
  color: var(--text-main);
}

.empty-hint {
  margin: 4px 0 0;
  font-size: 13px;
  color: var(--text-sub);
  text-align: center;
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

.added-product__info {
  min-width: 0;
  flex: 1;
}

.added-thumb {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 4px;
  overflow: hidden;
  background: #f3f5f8;
  display: flex;
  align-items: center;
  justify-content: center;
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
}
</style>
