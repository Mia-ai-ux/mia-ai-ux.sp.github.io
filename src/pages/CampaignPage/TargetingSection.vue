<template>
  <section id="section-targeting" class="card">
    <div class="card-header">
      <h2>Targeting</h2>
    </div>

    <div class="options">
      <RadioCard v-model="form.targeting" value="auto">
        <p class="option-title">Automatic targeting</p>
        <p class="option-desc">
          Amazon will target keywords and products that are similar to the product in your ad.
        </p>
      </RadioCard>

      <RadioCard v-model="form.targeting" value="manual">
        <p class="option-title">Manual targeting</p>
        <p class="option-desc">
          Choose keywords or products to target shopper searches and set custom bids.
        </p>
      </RadioCard>
    </div>
  </section>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useCampaignStore } from '@/stores/campaign'
import RadioCard from '@/components/base/RadioCard.vue'
import UiButton from '@/components/ui/button/Button.vue'
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
</style>
