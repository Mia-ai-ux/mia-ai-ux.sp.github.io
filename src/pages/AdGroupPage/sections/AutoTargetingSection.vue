<template>
  <section id="section-auto-targeting" class="card">
    <div class="card-header">
      <div class="title-group">
        <h2>Set bid pricing</h2>
        <p>Automatic targeting</p>
      </div>
    </div>

    <hr />

    <p class="section-label">Set bid pricing</p>

    <div class="options">
      <RadioCard v-model="form.autoTargetBidMode" value="by_group">
        <p class="option-title">Set bids by targeting group</p>
        <p class="option-desc">
          Targeting groups use multiple strategies to match your ads to shoppers looking for your products.
        </p>

        <Transition name="slide">
          <div v-if="form.autoTargetBidMode === 'by_group'" class="groups">
            <div v-for="g in groups" :key="g.key" class="group-row">
              <button
                class="toggle"
                :class="{ on: form.autoGroups[g.key].enabled }"
                type="button"
                @click.stop="form.autoGroups[g.key].enabled = !form.autoGroups[g.key].enabled"
              >
                <span class="knob"></span>
              </button>
              <div class="group-fields">
                <p class="group-name">{{ g.label }}</p>
                <div v-if="form.autoGroups[g.key].enabled" class="bid-row">
                  <span class="bid-label">
                    Bid
                    <img :src="iconHelpCircle" alt="" width="16" height="16" />
                  </span>
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
        </Transition>
      </RadioCard>

      <RadioCard v-model="form.autoTargetBidMode" value="default">
        <p class="option-title">Set default bid</p>
        <p class="option-desc">Default bid applies to all clicks unless you set a different bid for a keyword.</p>
        <Transition name="slide">
          <div v-if="form.autoTargetBidMode === 'default'" class="default-bid-wrap">
            <InlineNumberInput
              v-model="form.autoDefaultBid"
              :step="0.01"
              suffix="USD"
              size="lg"
              class="bid-input"
            />
          </div>
        </Transition>
      </RadioCard>
    </div>
  </section>
</template>

<script setup>
import { reactive, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useCampaignStore } from '@/stores/campaign'
import RadioCard from '@/components/base/RadioCard.vue'
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

watch(() => form.value.adGroupBid, (newBid) => {
  for (const g of groups) {
    if (!touched[g.key]) {
      form.value.autoGroups[g.key].bid = newBid
    }
  }
}, { immediate: true })

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

.bid-input {
  max-width: 400px;
  width: 100%;
}

.default-bid-wrap .bid-input {
  margin-top: 12px;
}

.groups {
  margin-top: 20px;
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

.default-bid-wrap {
  margin-top: 4px;
}

.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
