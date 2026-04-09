<template>
  <section id="section-auto-targeting" class="card">
    <!-- Header -->
    <div class="card-header">
      <div class="title-col">
        <h2>Set bid pricing</h2>
        <p>Automatic targeting</p>
      </div>
    </div>

    <hr />

    <p class="section-label">Set bid pricing</p>

    <!-- Option A: by targeting group -->
    <label
      class="radio-card"
      :class="{ selected: form.autoTargetBidMode === 'by_group' }"
      @click="form.autoTargetBidMode = 'by_group'"
    >
      <span class="radio-dot" :class="{ checked: form.autoTargetBidMode === 'by_group' }">
        <span v-if="form.autoTargetBidMode === 'by_group'" class="radio-dot-inner"></span>
      </span>
      <div class="radio-body">
        <p class="option-title">Set bids by targeting group</p>
        <p class="option-desc">
          Targeting groups use multiple strategies to match your ads to shoppers looking for your products.
        </p>

        <Transition name="slide">
          <div v-if="form.autoTargetBidMode === 'by_group'" class="groups">
            <div v-for="g in groups" :key="g.key" class="group-row">
              <!-- Toggle switch -->
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
                    <img :src="iconHelpCircle" alt="" width="20" height="20" />
                  </span>
                  <InlineNumberInput
                    :model-value="form.autoGroups[g.key].bid"
                    @update:model-value="onBidInput(g.key, $event)"
                    :step="0.01"
                    suffix="USD"
                    size="lg"
                    style="max-width: 240px"
                  />
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </label>

    <!-- Option B: default bid -->
    <label
      class="radio-card"
      :class="{ selected: form.autoTargetBidMode === 'default' }"
      @click="form.autoTargetBidMode = 'default'"
    >
      <span class="radio-dot" :class="{ checked: form.autoTargetBidMode === 'default' }">
        <span v-if="form.autoTargetBidMode === 'default'" class="radio-dot-inner"></span>
      </span>
      <div class="radio-body">
        <p class="option-title">Set default bid</p>
        <p class="option-desc">Default bid applies to all clicks unless you set a different bid for a keyword.</p>
        <Transition name="slide">
          <div v-if="form.autoTargetBidMode === 'default'" class="default-bid-wrap">
            <InlineNumberInput v-model="form.autoDefaultBid" :step="0.01" suffix="USD" style="max-width: 240px; margin-top: 12px" />
          </div>
        </Transition>
      </div>
    </label>
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
  padding: 32px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  padding-bottom: 8px;
}

.title-col h2 {
  margin: 0;
  font-size: 28px;
  font-weight: 600;
  color: var(--text-main);
}

.title-col p {
  margin: 4px 0 0;
  font-size: 17px;
  color: var(--text-sub);
}

.tips-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: var(--chip-bg);
  border: none;
  border-radius: 3px;
  padding: 6px 8px;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
}

hr {
  border: 0;
  border-top: 1px solid #efefef;
  margin: 0 0 20px;
}

.section-label {
  font-size: 19px;
  font-weight: 600;
  margin-bottom: 12px;
}

.radio-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: var(--chip-bg);
  border-radius: 4px;
  padding: 16px;
  border: 1px solid transparent;
  cursor: pointer;
  width: 100%;
  margin-bottom: 12px;
  transition: border-color 0.15s, background 0.15s;
}

.radio-card.selected {
  background: #fff;
  border-color: var(--selected-border);
}

.radio-dot {
  flex-shrink: 0;
  margin-top: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid rgba(28, 31, 35, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, border-color 0.15s;
}

.radio-dot.checked {
  background: #0064fa;
  border-color: #0064fa;
}

.radio-dot-inner {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #fff;
}

.radio-body {
  flex: 1;
  min-width: 0;
}

.option-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--text-main);
}

.option-desc {
  margin: 4px 0 0;
  font-size: 17px;
  color: var(--text-sub);
  line-height: 1.5;
}

/* ── Groups ── */
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
  background: #d0d0d0;
  border: none;
  position: relative;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 3px;
}

.toggle.on {
  background: #111;
}

.knob {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 1px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.15);
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
  font-size: 20px;
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
  font-size: 20px;
  font-weight: 600;
  color: #1c1f23;
}

.help-icon {
  color: var(--text-sub);
}

.default-bid-wrap {
  margin-top: 12px;
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
