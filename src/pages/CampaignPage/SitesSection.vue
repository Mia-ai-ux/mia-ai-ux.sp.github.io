<template>
  <section id="section-sites" class="card">
    <div class="card-header">
      <div class="title-group">
        <h2>Sites</h2>
        <p>Based on your advertising strategy, choose where all ads in your campaign will appear.</p>
      </div>
    </div>

    <hr />

    <p class="section-label">Where ads appear</p>

    <div class="options">
      <RadioCard v-model="form.siteType" value="amazon_and_beyond">
        <p class="option-title">Amazon and beyond</p>
        <p class="option-desc">
          Ads appear on Amazon—including both Amazon retail and Amazon Business—as well as select
          sites and apps off Amazon.
        </p>
      </RadioCard>

      <RadioCard v-model="form.siteType" value="amazon_business">
        <p class="option-title">Amazon Business</p>
        <p class="option-desc">
          Use a B2B strategy to increase sales and exclusively reach business shoppers on Amazon
          Business.
        </p>
      </RadioCard>
    </div>
  </section>
</template>

<script setup>
import RadioCard from '@/components/base/RadioCard.vue'
import UiButton from '@/components/ui/button/Button.vue'
import { useCampaignStore } from '@/stores/campaign'
import { storeToRefs } from 'pinia'
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
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 8px;
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
