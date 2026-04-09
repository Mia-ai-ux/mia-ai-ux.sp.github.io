<template>
  <section id="section-ad-group-bid" class="card">
    <h2>Ad group bid</h2>
    <InlineNumberInput
      v-model="form.adGroupBid"
      :step="0.01"
      suffix="USD"
      size="lg"
      class="bid-input"
    />
  </section>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useCampaignStore } from '@/stores/campaign'
import InlineNumberInput from '@/components/base/InlineNumberInput.vue'

const { form } = storeToRefs(useCampaignStore())
</script>

<style scoped>
.card {
  background: var(--bg-card);
  border-radius: var(--radius-card);
  padding: 28px 32px;
  display: flex;
  flex-direction: column;
  gap: 0;
}

h2 {
  margin: 0 0 24px;
  font-size: var(--text-2xl, 22px);
  font-weight: 600;
  color: var(--text-main);
}

.bid-input {
  max-width: 400px;
  width: 100%;
}
</style>
