<template>
  <section id="section-sb-ad-group-name" class="card">
    <h2>Ad group name <span class="required">*</span></h2>
    <div id="field-sb-ad-group-name" class="input-wrap" :class="{ 'has-error': error }">
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
import { ref, watch, onMounted, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useSbStore } from '@/stores/sb'
import UiInput from '@/components/ui/input/Input.vue'

const { form } = storeToRefs(useSbStore())
const error = ref('')

function adGroupNameFromCampaignFirstTwoFields(campaignName) {
  const s = String(campaignName ?? '').trim()
  if (!s) return ''
  const parts = s.split('+').map((p) => p.trim()).filter(Boolean)
  if (!parts.length) return ''
  if (parts.length === 1) return parts[0]
  return `${parts[0]}+${parts[1]}`
}

onMounted(() => {
  if (!form.value.adGroupName?.trim()) {
    const derived = adGroupNameFromCampaignFirstTwoFields(form.value.campaignName)
    form.value.adGroupName = derived || 'Ad Group 1'
  }
})

watch(() => form.value.adGroupName, (val) => {
  if (error.value && val?.trim()) error.value = ''
})

function validate() {
  const errorItems = []

  if (!form.value.adGroupName?.trim()) {
    error.value = 'Ad group name is required.'
    errorItems.push({ subItem: 'Ad group name', label: 'Ad group name', anchorId: 'field-sb-ad-group-name' })
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
