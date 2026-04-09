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
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

h2 {
  margin: 0;
  font-size: 28px;
  font-weight: 600;
  color: #272b36;
}

.input-wrap {
  max-width: 400px;
  width: 100%;
}
</style>
