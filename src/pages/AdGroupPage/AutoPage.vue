<template>
  <div class="page-layout">
    <div class="page-center">
      <Stepper :steps="steps" :current-step="getStepNumber('/ad-group/auto')" :active-sub-item="activeSubItem" />

      <div class="content-wrapper">
        <h2 class="page-title">Ad Group</h2>
        <main class="main-content">
          <AdGroupNameSection />
          <ProductSection />
          <AdGroupBidSection />
          <AutoTargetingSection />
        </main>
      </div>
    </div>
  </div>

  <BottomBar show-back @cancel="onCancel" @back="onBack" @next="onNext" />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCampaignStore } from '@/stores/campaign'
import Stepper from '@/components/Stepper.vue'
import BottomBar from '@/components/BottomBar.vue'
import AdGroupNameSection from './sections/AdGroupNameSection.vue'
import ProductSection from './sections/ProductSection.vue'
import AdGroupBidSection from './sections/AdGroupBidSection.vue'
import AutoTargetingSection from './sections/AutoTargetingSection.vue'
import { useFlowSteps } from '@/composables/useFlowSteps'

const router = useRouter()
const store = useCampaignStore()
const { steps, getStepNumber, getNextPath, getBackPath } = useFlowSteps()

const subItems = [
  { label: 'Ad group name',  anchorId: 'section-ad-group-name' },
  { label: 'Product',        anchorId: 'section-product' },
  { label: 'Ad group bid',   anchorId: 'section-ad-group-bid' },
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
function onNext()   { router.push(getNextPath('/ad-group/auto')) }
</script>

<style scoped>
.page-layout {
  display: flex;
  justify-content: center;
  min-height: calc(100vh - 60px);
  width: 100%;
}

.page-center {
  display: flex;
  align-items: flex-start;
  gap: 40px;
  width: 70vw;
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
  font-size: 2em;
  font-weight: 700;
  color: #111;
  margin: 0 0 20px;
  padding: 0;
}

.main-content {
  flex: 1;
  min-width: 0;
  margin: 0;
  padding-bottom: 72px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
