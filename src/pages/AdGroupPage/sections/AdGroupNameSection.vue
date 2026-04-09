<template>
  <section id="section-ad-group-name" class="card">
    <h2>Ad group name</h2>
    <div class="input-wrap">
      <UiInput size="lg" v-model="form.adGroupName" />
    </div>
  </section>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useCampaignStore } from '@/stores/campaign'
import UiInput from '@/components/ui/input/Input.vue'

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

.input-wrap {
  max-width: 400px;
  width: 100%;
}
</style>
