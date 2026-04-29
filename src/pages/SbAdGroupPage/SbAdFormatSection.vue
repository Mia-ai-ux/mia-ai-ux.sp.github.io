<template>
  <section id="section-sb-ad-format" class="card">
    <div class="card-header">
      <div class="title-group">
        <h2>Ad format</h2>
      </div>
    </div>

    <div class="options">
      <RadioCard v-model="form.adFormat" value="collections">
        <p class="option-title">Collections</p>
        <p class="option-desc">Display a collection of products relevant to shopper interests.</p>
      </RadioCard>

      <RadioCard v-model="form.adFormat" value="store_spotlight">
        <p class="option-title">Store spotlight</p>
        <p class="option-desc">Promote your product categories or pages within your Brand Store on Amazon.</p>
      </RadioCard>

      <RadioCard v-model="form.adFormat" value="video">
        <p class="option-title">Video</p>
        <p class="option-desc">Use video to promote your brand and products.</p>
      </RadioCard>
    </div>
  </section>
</template>

<script setup>
import RadioCard from '@/components/base/RadioCard.vue'
import { useSbStore } from '@/stores/sb'
import { storeToRefs } from 'pinia'

const { form } = storeToRefs(useSbStore())
</script>

<style scoped>
.card {
  background: var(--bg-card);
  border-radius: var(--radius-card);
  padding: 28px 32px;
}

.card-header {
  margin-bottom: 20px;
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

.required {
  color: var(--color-danger);
  font-size: var(--text-sm, 13px);
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
  display: flex;
  align-items: center;
  gap: 8px;
}

.badge-new {
  display: inline-flex;
  align-items: center;
  padding: 1px 7px;
  font-size: var(--text-xs, 11px);
  font-weight: 600;
  color: #0070f3;
  background: #e8f1ff;
  border-radius: 999px;
  letter-spacing: 0.02em;
}

.option-desc {
  margin: 4px 0 0;
  font-size: var(--text-base, 14px);
  color: var(--text-sub);
  line-height: 1.55;
}
</style>
