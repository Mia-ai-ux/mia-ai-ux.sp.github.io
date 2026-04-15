<template>
  <section id="section-product" class="card">
    <div class="title-group">
      <h2>Product <span class="required">*</span></h2>
      <p>Select the products you want to advertise for this ad group</p>
    </div>

    <button class="add-btn" type="button" @click="pickerOpen = true">
      <span class="add-icon">
        <svg width="12" height="12" viewBox="0 0 10 10" fill="none">
          <path d="M5 1v8M1 5h8" stroke="#fff" stroke-width="1.8" stroke-linecap="round" />
        </svg>
      </span>
      Add
    </button>

    <p v-if="error" class="error-msg">{{ error }}</p>

    <div class="product-list" v-if="form.products.length > 0">
      <div v-for="(p, i) in form.products" :key="p.id" class="ep-added-row">
        <div class="ep-product-card">
          <div class="ep-thumb">
            <div class="ep-thumb-bg" aria-hidden="true" />
            <img v-if="p.image" class="ep-thumb-img" :src="p.image" :alt="p.title" />
          </div>
          <div class="ep-info">
            <p class="ep-title">{{ p.title }}</p>
            <div class="ep-meta">
              <span class="ep-stars">
                <svg
                  v-for="star in 5"
                  :key="star"
                  :width="11"
                  :height="11"
                  viewBox="0 0 12 12"
                  :fill="star <= roundRating(p.rating) ? '#f5a623' : '#e0e0e0'"
                >
                  <path d="M6 1l1.3 2.6 2.9.4-2.1 2 .5 2.9L6 7.5l-2.6 1.4.5-2.9-2.1-2 2.9-.4z" />
                </svg>
              </span>
              <span class="ep-reviews">({{ Number(p.reviews || 0).toLocaleString() }})</span>
              <span class="ep-sep">|</span>
              <span v-if="p.originalPrice" class="ep-orig-price">{{ p.originalPrice }}</span>
              <span class="ep-price">{{ p.price }}</span>
              <span class="ep-sep">|</span>
              <span class="ep-stock">{{ p.inStock ? 'In stock' : 'Out of stock' }}</span>
              <span class="ep-sep">|</span>
              <span class="ep-asin">ASIN：{{ p.asin }}</span>
            </div>
          </div>
        </div>
        <button type="button" class="ep-delete" aria-label="Remove product" @click="removeProduct(i)">
          <Trash2 :size="20" :stroke-width="1.75" aria-hidden="true" />
        </button>
      </div>
    </div>

    <ProductPickerSheet
      v-model:open="pickerOpen"
      :catalog="adGroupProductCatalog"
      :catalog-total="AD_GROUP_PRODUCT_CATALOG_TOTAL"
      :initial-selected-ids="selectedIds"
      @confirm="onPickerConfirm"
    />
  </section>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { Trash2 } from 'lucide-vue-next'
import { useCampaignStore } from '@/stores/campaign'
import ProductPickerSheet from '@/components/product/ProductPickerSheet.vue'
import {
  adGroupProductCatalog,
  AD_GROUP_PRODUCT_CATALOG_TOTAL
} from '@/data/adGroupProductCatalog.js'

const { form } = storeToRefs(useCampaignStore())

const pickerOpen = ref(false)
const error = ref('')

const selectedIds = computed(() => form.value.products.map((p) => p.id))

// Reactively clear error once at least one product is added
watch(() => form.value.products.length, (len) => {
  if (error.value && len > 0) error.value = ''
})

function roundRating(r) {
  return Math.min(5, Math.max(0, Math.round(Number(r) || 0)))
}

function removeProduct(i) {
  form.value.products.splice(i, 1)
}

function onPickerConfirm(list) {
  form.value.products = list
}

function validate() {
  const errorItems = []

  if (form.value.products.length === 0) {
    error.value = 'Please add at least one product.'
    errorItems.push({ subItem: 'Product', label: 'Product', anchorId: 'section-product' })
  } else {
    error.value = ''
  }

  const ok = errorItems.length === 0
  if (!ok) {
    nextTick(() => {
      const el = document.getElementById(errorItems[0].anchorId)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
  }
  return { ok, errorItems }
}

defineExpose({ validate })
</script>

<style scoped>
.card {
  background: var(--bg-card);
  border-radius: var(--radius-card);
  padding: 28px 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.required {
  color: var(--color-danger, #ef4444);
  font-size: var(--text-sm, 13px);
}

.title-group h2 {
  margin: 0;
  font-size: var(--text-2xl, 22px);
  font-weight: 600;
  color: var(--text-main);
}

.title-group p {
  margin: 4px 0 0;
  font-size: var(--text-base, 14px);
  color: var(--text-sub);
  line-height: 1.55;
}

/* Match NegativeTargetingPage .ep-added-list / .ep-added-row / .ep-product-card */
.product-list {
  --ep-list-surface: #f8f8f8;
  display: flex;
  flex-direction: column;
}

.ep-added-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  border-radius: 4px;
  border: 1px solid transparent;
  background: var(--ep-list-surface);
}

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

.ep-reviews {
  color: #1876ff;
}

.ep-sep {
  color: #d0d0d0;
}

.ep-orig-price {
  color: #999;
  text-decoration: line-through;
}

.ep-price {
  color: #fe4041;
  font-weight: 500;
}

.ep-stock,
.ep-asin {
  color: #999;
}

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
  transition: color 0.15s;
}

.ep-delete:hover {
  color: #ef4444;
}

.add-btn {
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  gap: 8px;
  background: #e8e8e8;
  border: none;
  border-radius: 18px;
  height: 36px;
  padding: 0 16px 0 6px;
  font-size: var(--text-base, 14px);
  font-weight: 500;
  color: #424244;
  cursor: pointer;
  transition: background 0.15s;
  font-family: inherit;
  box-sizing: border-box;
}

.add-btn:hover {
  background: #d8d8d8;
}

.add-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #424244;
  flex-shrink: 0;
}

.error-msg {
  margin: 6px 0 0;
  font-size: var(--text-sm, 13px);
  color: var(--color-danger, #ef4444);
  line-height: 1.4;
}
</style>
