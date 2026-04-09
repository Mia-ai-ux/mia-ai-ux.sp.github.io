<template>
  <section id="section-manual-targeting" class="card">
    <!-- Header with illustration -->
    <div class="card-header">
      <div class="illus">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <rect width="40" height="40" rx="10" fill="#EBF3FF" />
          <path d="M20 12a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm0 10c4.4 0 8 2 8 4.5V28H12v-1.5C12 24 15.6 22 20 22z" fill="#1876FF" opacity=".7" />
        </svg>
      </div>
      <div class="title-col">
        <div class="title-row">
          <h2>Manual Targeting</h2>
        </div>
        <p>Targeting uses keywords and products to help your ads appear in search and detail pages.</p>
      </div>
    </div>

    <hr />

    <p class="section-label">Choose keyword or product targeting</p>

    <RadioCard v-model="form.manualTargetType" value="keyword">
      <p class="option-title">Keyword targeting</p>
      <p class="option-desc">Choose keywords to help your products appear in shopper searches.</p>
    </RadioCard>

    <RadioCard v-model="form.manualTargetType" value="product">
      <p class="option-title">Product targeting</p>
      <p class="option-desc">Choose specific products, categories, brands, or other product features to target your ads.</p>
    </RadioCard>
  </section>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useCampaignStore } from '@/stores/campaign'
import RadioCard from '@/components/base/RadioCard.vue'

const { form } = storeToRefs(useCampaignStore())
</script>

<style scoped>
.card {
  background: var(--bg-card);
  border-radius: var(--radius-card);
  padding: 32px;
}

.card-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding-bottom: 8px;
}

.illus {
  flex-shrink: 0;
}

.title-col {
  flex: 1;
  min-width: 0;
}

.title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 4px;
}

h2 {
  margin: 0;
  font-size: 28px;
  font-weight: 600;
  color: var(--text-main);
}

.tips-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: var(--chip-bg);
  border: none;
  border-radius: 3px;
  padding: 6px 8px;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
}

.title-col p {
  margin: 0;
  font-size: 17px;
  color: var(--text-sub);
  line-height: 1.4;
}

hr {
  border: 0;
  border-top: 1px solid #efefef;
  margin: 16px 0 20px;
}

.section-label {
  font-size: 19px;
  font-weight: 600;
  margin-bottom: 12px;
}

.option-title {
  margin: 0;
  font-size: 19px;
  font-weight: 600;
  color: var(--text-main);
}

.option-desc {
  margin: 4px 0 0;
  font-size: 17px;
  color: var(--text-sub);
  line-height: 1.45;
}
</style>
