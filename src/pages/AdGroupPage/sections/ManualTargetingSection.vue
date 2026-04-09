<template>
  <section id="section-manual-targeting" class="card">
    <div class="card-header">
      <div class="illus" aria-hidden="true">
        <svg class="illus-svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
          <rect width="40" height="40" rx="10" fill="currentColor" class="illus-bg" />
          <path
            d="M20 12a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm0 10c4.4 0 8 2 8 4.5V28H12v-1.5C12 24 15.6 22 20 22z"
            fill="currentColor"
            class="illus-fg"
          />
        </svg>
      </div>
      <div class="title-group">
        <h2>Manual Targeting</h2>
        <p>Targeting uses keywords and products to help your ads appear in search and detail pages.</p>
      </div>
    </div>

    <hr />

    <p class="section-label">Choose keyword or product targeting</p>

    <div class="options">
      <RadioCard v-model="form.manualTargetType" value="keyword">
        <p class="option-title">Keyword targeting</p>
        <p class="option-desc">Choose keywords to help your products appear in shopper searches.</p>
      </RadioCard>

      <RadioCard v-model="form.manualTargetType" value="product">
        <p class="option-title">Product targeting</p>
        <p class="option-desc">Choose specific products, categories, brands, or other product features to target your ads.</p>
      </RadioCard>
    </div>
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
  padding: 28px 32px;
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

.illus-svg {
  display: block;
  color: var(--primary);
}

.illus-bg {
  opacity: 0.12;
}

.illus-fg {
  opacity: 0.75;
}

.title-group {
  flex: 1;
  min-width: 0;
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
  line-height: 1.4;
}

hr {
  border: 0;
  border-top: 1px solid var(--border);
  margin: 0 0 20px;
}

.section-label {
  margin: 0 0 12px;
  font-size: var(--text-base, 14px);
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
</style>
