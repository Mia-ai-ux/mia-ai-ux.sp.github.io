<template>
  <section id="section-bidding-strategy" class="card">
    <div class="card-header">
      <h2>Bidding strategy</h2>
    </div>

    <div class="options">
      <RadioCard v-model="form.bidMode" value="up_down">
        <p class="option-title">Dynamic bids - up and down</p>
        <p class="option-desc">
          We'll raise your bids (by a maximum of 100% on all placements) in real time when your ad
          may be more likely to convert to a sale, and lower your bids when less likely to convert
          to a sale.
        </p>
      </RadioCard>

      <RadioCard v-model="form.bidMode" value="down_only">
        <p class="option-title">Dynamic bids - down only</p>
        <p class="option-desc">
          We'll lower your bids in real time when your ad may be less likely to convert to a sale.
        </p>
      </RadioCard>

      <RadioCard v-model="form.bidMode" value="fixed">
        <p class="option-title">Fixed bids</p>
        <p class="option-desc">
          We'll use your exact bid and any manual adjustments you set without making dynamic changes.
        </p>
      </RadioCard>
    </div>

    <!-- 共用详情面板：三种策略共享，避免重复渲染 -->
    <Transition name="slide">
      <div v-if="form.bidMode" class="detail-panel">
        <!-- Placements（始终展开） -->
        <div class="sub-section">
          <div class="sub-label-row">
            <span class="sub-label">Placements</span>
            <img :src="iconHelpCircle" alt="" width="16" height="16" />
          </div>
          <div class="placements-list">
            <div class="placement-field" v-for="p in placements" :key="p.key">
              <label>{{ p.label }}</label>
              <InlineNumberInput v-model="form[p.key]" suffix="%" size="lg" />
            </div>
          </div>
        </div>

        <!-- Audiences（始终展开） -->
        <div class="sub-section">
          <div class="sub-label-row">
            <span class="sub-label">Audiences</span>
            <img :src="iconHelpCircle" alt="" width="16" height="16" />
          </div>
          <div class="audiences-body">
            <UiSelect
              v-model="form.audienceMode"
              size="lg"
              :options="audienceOptions"
            />
          </div>
        </div>
      </div>
    </Transition>
  </section>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useCampaignStore } from '@/stores/campaign'
import RadioCard from '@/components/base/RadioCard.vue'
import InlineNumberInput from '@/components/base/InlineNumberInput.vue'
import UiSelect from '@/components/ui/select/Select.vue'
import iconHelpCircle from '@/assets/icon-help-circle.svg'

const { form } = storeToRefs(useCampaignStore())

const placements = [
  { key: 'bidTop',     label: 'Top of search (first page)' },
  { key: 'bidRest',    label: 'Rest of search' },
  { key: 'bidProduct', label: 'Product pages' }
]

const audienceOptions = [
  { value: 'increase_amazon_built', label: 'Increase bids for audiences built by Amazon' },
  {
    value: 'increase_amc_custom',
    label: 'Increase bids on a custom audience created in Amazon Marketing Cloud (AMC)',
  },
  { value: 'don_t_increase', label: "Don't increase bids for an audience" },
]
</script>

<style scoped>
.card {
  background: var(--bg-card);
  border-radius: var(--radius-card);
  padding: 28px 32px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

h2 {
  margin: 0;
  font-size: var(--text-2xl, 22px);
  font-weight: 600;
  color: var(--text-main);
}

.options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.option-title {
  margin: 0;
  font-size: var(--text-md, 15px);
  font-weight: 600;
  color: var(--text-main);
}

.option-desc {
  margin: 4px 0 0;
  font-size: var(--text-base, 14px);
  color: var(--text-sub);
  line-height: 1.55;
}

/* 共用详情面板，切换策略时不重建 DOM */
.detail-panel {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sub-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sub-label-row {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 6px;
  padding: 0;
  width: 100%;
}

.sub-label {
  font-size: var(--text-base, 14px);
  font-weight: 600;
  color: var(--text-main);
}

.placements-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.placement-field {
  width: 100%;
  max-width: 400px;
}

.placement-field label {
  display: block;
  font-size: var(--text-base, 14px);
  font-weight: 500;
  margin-bottom: 6px;
  color: var(--text-main);
  white-space: nowrap;
}

.audiences-body {
  width: 100%;
  max-width: 400px;
}

.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
