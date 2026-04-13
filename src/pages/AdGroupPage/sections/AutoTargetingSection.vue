<template>
  <section id="section-auto-targeting" class="card">
    <div class="card-header">
      <div class="title-group">
        <h2>Set bid pricing</h2>
        <p>Automatic targeting</p>
      </div>
    </div>

    <hr />

    <div class="blocks">
      <!-- 1. Default bid first（与 Campaign Bid adjustment 中 Assuming a base bid 同源：adGroupBid） -->
      <div class="bid-block">
        <div class="label-row">
          <label>Set default bid</label>
          <div class="tooltip-wrap">
            <img :src="iconHelpCircle" alt="" width="16" height="16" class="help-icon-trigger" />
            <div class="tooltip-bubble">
              Default bid applies to all clicks unless you set a different bid for a keyword.
            </div>
          </div>
        </div>
        <div class="default-bid-wrap">
          <InlineNumberInput
            v-model="form.adGroupBid"
            :step="0.01"
            suffix="USD"
            size="lg"
            class="bid-input"
          />
        </div>
      </div>

      <!-- 2. Targeting groups：始终展开 -->
      <div class="bid-block">
        <div class="label-row">
          <label>Set bids by targeting group</label>
          <div class="tooltip-wrap">
            <img :src="iconHelpCircle" alt="" width="16" height="16" class="help-icon-trigger" />
            <div class="tooltip-bubble">
              Targeting groups use multiple strategies to match your ads to shoppers looking for your products.
            </div>
          </div>
        </div>
        <div class="groups">
          <div v-for="g in groups" :key="g.key" class="group-row">
            <button
              class="toggle"
              :class="{ on: form.autoGroups[g.key].enabled }"
              type="button"
              @click="form.autoGroups[g.key].enabled = !form.autoGroups[g.key].enabled"
            >
              <span class="knob"></span>
            </button>
            <div class="group-fields">
              <p class="group-name">{{ g.label }}</p>
              <div v-if="form.autoGroups[g.key].enabled" class="bid-row">
                <span class="bid-label">Bid</span>
                <InlineNumberInput
                  :model-value="form.autoGroups[g.key].bid"
                  @update:model-value="onBidInput(g.key, $event)"
                  :step="0.01"
                  suffix="USD"
                  size="lg"
                  class="bid-input"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useCampaignStore } from '@/stores/campaign'
import InlineNumberInput from '@/components/base/InlineNumberInput.vue'
import iconHelpCircle from '@/assets/icon-help-circle.svg'

const { form } = storeToRefs(useCampaignStore())

const groups = [
  { key: 'closeMatch', label: 'Close match' },
  { key: 'looseMatch', label: 'Loose match' },
  { key: 'substitutes', label: 'Substitutes' },
  { key: 'complements', label: 'Complements' }
]

const touched = reactive({
  closeMatch: false, looseMatch: false, substitutes: false, complements: false
})

watch(
  () => form.value.adGroupBid,
  (newBid) => {
    for (const g of groups) {
      if (!touched[g.key]) {
        form.value.autoGroups[g.key].bid = newBid
      }
    }
  },
  { immediate: true }
)

function onBidInput(key, val) {
  touched[key] = true
  form.value.autoGroups[key].bid = val
}
</script>

<style scoped>
.card {
  background: var(--bg-card);
  border-radius: var(--radius-card);
  padding: 28px 32px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
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

.blocks {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.bid-block {
  padding: 0;
  border: none;
  background: transparent;
}

/* 与 Campaign Settings · Daily budget 一致：标题 + 问号 + 悬停说明 */
.label-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
  font-size: var(--text-base, 14px);
  font-weight: 600;
  color: var(--text-main);
}

.label-row label {
  margin: 0;
  cursor: default;
}

.help-icon-trigger {
  cursor: pointer;
  flex-shrink: 0;
  display: block;
}

.tooltip-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.tooltip-bubble {
  display: none;
  position: absolute;
  left: 24px;
  top: 50%;
  transform: translateY(-50%);
  background: #1c1f23;
  color: #fff;
  font-size: var(--text-sm, 13px);
  font-weight: 400;
  line-height: 1.6;
  padding: 10px 14px;
  border-radius: var(--radius-md, 6px);
  width: 280px;
  z-index: 999;
  box-shadow: var(--shadow-md);
  pointer-events: none;
}

.tooltip-bubble::before {
  content: '';
  position: absolute;
  left: -6px;
  top: 50%;
  transform: translateY(-50%);
  border-width: 6px 6px 6px 0;
  border-style: solid;
  border-color: transparent #1c1f23 transparent transparent;
}

.tooltip-wrap:hover .tooltip-bubble {
  display: block;
}

.bid-input {
  max-width: 400px;
  width: 100%;
}

.default-bid-wrap {
  margin-top: 0;
}

.groups {
  margin-top: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.group-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.toggle {
  flex-shrink: 0;
  width: 26px;
  height: 16px;
  border-radius: 8px;
  background: var(--border-strong);
  border: none;
  position: relative;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 3px;
}

.toggle.on {
  background: var(--primary);
}

.knob {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.15);
  transition: left 0.2s;
}

.toggle.on .knob {
  left: 12px;
}

.group-fields {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.group-name {
  margin: 0;
  font-size: var(--text-md, 15px);
  font-weight: 600;
  color: var(--text-main);
}

.bid-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.bid-label {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: var(--text-base, 14px);
  font-weight: 600;
  color: var(--text-main);
}
</style>
