<template>
  <div class="page-layout">
    <div class="page-center">
      <Stepper
        :steps="steps"
        :current-step="getStepNumber('/ad-group/auto')"
        :active-sub-item="activeSubItem"
        :error-sub-items="errorSubItems"
      />

      <div class="content-wrapper">
        <h2 class="page-title">Ad Group</h2>
        <main class="main-content">
          <AdGroupNameSection ref="adGroupNameRef" />
          <ProductSection ref="productRef" />
          <AutoTargetingSection />
        </main>
      </div>
    </div>
  </div>

  <BottomBar show-back @cancel="onCancel" @back="onBack" @next="onNext" />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCampaignStore } from '@/stores/campaign'
import { storeToRefs } from 'pinia'
import Stepper from '@/components/Stepper.vue'
import BottomBar from '@/components/BottomBar.vue'
import AdGroupNameSection from './sections/AdGroupNameSection.vue'
import ProductSection from './sections/ProductSection.vue'
import AutoTargetingSection from './sections/AutoTargetingSection.vue'
import { useFlowSteps } from '@/composables/useFlowSteps'
import { useToast } from '@/components/ui/toast/useToast'

const router = useRouter()
const store = useCampaignStore()
const { form } = storeToRefs(store)
const { steps, getStepNumber, getNextPath, getBackPath } = useFlowSteps()
const { toast } = useToast()

const adGroupNameRef = ref(null)
const productRef = ref(null)
const hasTriedToSubmit = ref(false)

const adGroupHasError = computed(() => !form.value.adGroupName?.trim())
const productHasError = computed(() => form.value.products.length === 0)

const errorSubItems = computed(() => {
  if (!hasTriedToSubmit.value) return []
  const errs = []
  if (adGroupHasError.value) errs.push('Ad group name')
  if (productHasError.value) errs.push('Product')
  return errs
})

const subItems = [
  { label: 'Ad group name',   anchorId: 'section-ad-group-name' },
  { label: 'Product',         anchorId: 'section-product' },
  { label: 'Set bid pricing', anchorId: 'section-auto-targeting' }
]

const activeSubItem = ref('Ad group name')

let observer = null
onMounted(() => {
  store.form.targeting = 'auto'
  const sectionEls = subItems
    .map(s => ({ label: s.label, el: document.getElementById(s.anchorId) }))
    .filter(s => s.el)

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const matched = sectionEls.find(s => s.el === entry.target)
          if (matched) activeSubItem.value = matched.label
        }
      }
    },
    { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
  )
  sectionEls.forEach(s => observer.observe(s.el))
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})

function onCancel() { router.push('/') }
function onBack()   { router.push(getBackPath('/ad-group/auto')) }

function onNext() {
  const r1 = adGroupNameRef.value?.validate() ?? { ok: true, errorItems: [] }
  const r2 = productRef.value?.validate()     ?? { ok: true, errorItems: [] }

  const allErrors = [...r1.errorItems, ...r2.errorItems]

  if (allErrors.length > 0) {
    hasTriedToSubmit.value = true

    // Scroll to first error (the validate() calls already scroll independently;
    // here we ensure the earliest one wins)
    const firstId = allErrors[0].anchorId
    const el = document.getElementById(firstId)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })

    return
  }

  hasTriedToSubmit.value = false
  router.push(getNextPath('/ad-group/auto'))
}
</script>

<style scoped>
.page-layout {
  display: flex;
  justify-content: center;
  min-height: calc(100vh - var(--nav-height, 60px));
  width: 100%;
}

.page-center {
  display: flex;
  align-items: flex-start;
  gap: var(--sidebar-gap, 40px);
  width: var(--content-width, 80vw);
  max-width: 100%;
  box-sizing: border-box;
  padding: 40px 0 0;
}

.content-wrapper {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.page-title {
  font-size: var(--text-3xl, 28px);
  font-weight: 700;
  color: var(--text-main);
  margin: 0 0 20px;
  padding: 0;
}

.main-content {
  flex: 1;
  min-width: 0;
  margin: 0;
  padding-bottom: 80px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
