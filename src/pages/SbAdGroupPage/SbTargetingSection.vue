<template>
  <section id="section-sb-collection-type" class="card">
    <div class="card-header">
      <div class="title-group">
        <h2>Collection type</h2>
        <p>Choose an automatic or manual collection type. You won't be able to change the collection type once your ad group is created.</p>
      </div>
    </div>

    <hr />

    <div class="options">
      <RadioCard :model-value="targetingValue" value="auto" @update:model-value="onSelect">
        <p class="option-title">Automatic</p>
        <p class="option-desc">
          We'll create the most relevant collections of products from your catalog, based on your keyword targets and shopper queries.
        </p>
      </RadioCard>

      <RadioCard :model-value="targetingValue" value="manual" @update:model-value="onSelect">
        <p class="option-title">Manual</p>
        <p class="option-desc">Choose related products to feature in your collection.</p>
      </RadioCard>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useSbStore } from '@/stores/sb'
import { storeToRefs } from 'pinia'
import RadioCard from '@/components/base/RadioCard.vue'

const { form } = storeToRefs(useSbStore())

const targetingValue = computed(() => form.value.targetingAuto ? 'auto' : 'manual')

function onSelect(val) {
  form.value.targetingAuto = val === 'auto'
}
</script>

<style scoped>
.card {
  background: var(--bg-card);
  border-radius: var(--radius-card);
  padding: 28px 32px;
}

.card-header {
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
