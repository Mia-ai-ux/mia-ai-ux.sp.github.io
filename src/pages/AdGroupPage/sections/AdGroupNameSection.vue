<template>
  <section id="section-ad-group-name" class="card">
    <h2>Ad group name <span class="required">*</span></h2>
    <div id="field-ad-group-name" class="input-wrap" :class="{ 'has-error': error }">
      <UiInput
        size="lg"
        v-model="form.adGroupName"
        :class="{ 'input-error': error }"
        @input="error = ''"
      />
    </div>
    <p v-if="error" class="error-msg">{{ error }}</p>
  </section>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useCampaignStore } from '@/stores/campaign'
import UiInput from '@/components/ui/input/Input.vue'

const { form } = storeToRefs(useCampaignStore())
const error = ref('')

/** 取 Campaign name 按「+」分割后的前两段（与命名规范 ASIN+Model+… 对齐） */
function adGroupNameFromCampaignFirstTwoFields(campaignName) {
  const s = String(campaignName ?? '').trim()
  if (!s) return ''
  const parts = s.split('+').map((p) => p.trim()).filter(Boolean)
  if (!parts.length) return ''
  if (parts.length === 1) return parts[0]
  return `${parts[0]}+${parts[1]}`
}

watch(
  () => form.value.campaignName,
  (cn) => {
    form.value.adGroupName = adGroupNameFromCampaignFirstTwoFields(cn)
  },
  { immediate: true }
)

// Reactively clear error once the field becomes valid
watch(() => form.value.adGroupName, (val) => {
  if (error.value && val?.trim()) error.value = ''
})

function validate() {
  const errorItems = []

  if (!form.value.adGroupName?.trim()) {
    error.value = 'Ad group name is required.'
    errorItems.push({ subItem: 'Ad group name', label: 'Ad group name', anchorId: 'field-ad-group-name' })
  } else {
    error.value = ''
  }

  const ok = errorItems.length === 0
  if (!ok) {
    nextTick(() => {
      const el = document.getElementById(errorItems[0].anchorId)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
  }
  return { ok, errorItems }
}

defineExpose({ validate })
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
  margin: 0 0 16px;
  font-size: var(--text-2xl, 22px);
  font-weight: 600;
  color: var(--text-main);
}

.required {
  color: var(--color-danger);
  font-size: var(--text-sm, 13px);
}

.input-wrap {
  max-width: 400px;
  width: 100%;
}

.has-error :deep(input) {
  border-color: var(--color-danger) !important;
}

.error-msg {
  margin: 6px 0 0;
  font-size: var(--text-sm, 13px);
  color: var(--color-danger);
  line-height: 1.4;
}
</style>
