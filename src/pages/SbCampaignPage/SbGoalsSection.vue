<template>
  <section id="section-sb-goals" class="card">
    <div class="card-header">
      <div class="title-group">
        <h2>
          Campaign goals
          <span class="tooltip-wrap">
            <img :src="iconHelpCircle" alt="" width="16" height="16" class="help-icon-trigger" />
            <span class="tooltip-bubble">
              Choose your campaign goal. This affects the landing page options available for your ads.
            </span>
          </span>
        </h2>
        <p class="title-hint">
          Choose your campaign goal. This affects the landing page options available for your ads.
        </p>
      </div>
    </div>

    <hr />

    <div id="field-goals" class="field">
      <div class="goals-options">
        <RadioCard v-model="form.goals" value="drive_page_visits">
          <p class="option-title">Drive page visits</p>
          <p class="option-desc">Drive traffic to your landing page and detail page.</p>
          <p class="option-meta">Success metric: Clicks</p>
          <p class="option-meta">Cost type: Cost per click (CPC)</p>
        </RadioCard>
        <RadioCard v-model="form.goals" value="brand_impression_share">
          <p class="option-title">Grow brand impression share</p>
          <p class="option-desc">
            Show your ads in the top-of-search placement to shoppers who search for
            your brand or within your brand categories.
          </p>
          <p class="option-meta">Success metric: Top-of-search impression share (IS)</p>
          <p class="option-meta">Cost type: Cost per 1,000 viewable impressions (VCPM)</p>
        </RadioCard>
      </div>
    </div>
  </section>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useSbStore } from '@/stores/sb'
import RadioCard from '@/components/base/RadioCard.vue'
import iconHelpCircle from '@/assets/icon-help-circle.svg'

const { form } = storeToRefs(useSbStore())
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
  display: flex;
  align-items: center;
  gap: 6px;
}

.title-hint {
  margin: 4px 0 0;
  font-size: var(--text-base, 14px);
  color: var(--text-sub);
  line-height: 1.45;
}

hr {
  border: 0;
  border-top: 1px solid var(--border);
  margin: 0 0 20px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tooltip-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.help-icon-trigger {
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.15s;
}

.help-icon-trigger:hover {
  opacity: 1;
}

.tooltip-bubble {
  display: none;
  position: absolute;
  left: 24px;
  top: 50%;
  transform: translateY(-50%);
  width: 260px;
  background: #333;
  color: #fff;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.5;
  padding: 8px 12px;
  border-radius: 6px;
  z-index: 10;
  white-space: normal;
  pointer-events: none;
}

.tooltip-wrap:hover .tooltip-bubble {
  display: block;
}

.goals-options {
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
  margin: 2px 0 0;
  font-size: var(--text-base, 14px);
  color: var(--text-sub);
  line-height: 1.55;
}

.option-meta {
  margin: 3px 0 0;
  font-size: var(--text-sm, 13px);
  color: var(--text-hint);
  line-height: 1.5;
}
</style>
