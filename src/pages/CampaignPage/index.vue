<template>
  <div class="page-layout">
    <div class="page-center">
      <Stepper
        :steps="steps"
        :current-step="getStepNumber('/campaign')"
        :active-sub-item="activeSubItem"
        :error-sub-items="errorSubItems"
      />

      <div class="content-wrapper">
        <h2 class="page-title">Campaign Plan</h2>
        <main class="main-content">
          <CampaignSettingsSection ref="settingsRef" />
          <SitesSection />
          <BiddingStrategySection />
          <TargetingSection />
        </main>
      </div>
    </div>
  </div>

  <BottomBar @cancel="onCancel" @next="onNext" />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCampaignStore } from '@/stores/campaign'
import Stepper from '@/components/Stepper.vue'
import BottomBar from '@/components/BottomBar.vue'
import SitesSection from './SitesSection.vue'
import CampaignSettingsSection from './CampaignSettingsSection.vue'
import BiddingStrategySection from './BiddingStrategySection.vue'
import TargetingSection from './TargetingSection.vue'
import { useFlowSteps } from '@/composables/useFlowSteps'
import { useToast } from '@/components/ui/toast/useToast'

const router = useRouter()
const store = useCampaignStore()
const { steps, getStepNumber, getNextPath } = useFlowSteps()
const { toast } = useToast()

const settingsRef = ref(null)
/** Sub-item labels that currently have validation errors (passed to Stepper) */
const errorSubItems = ref([])

const subItems = [
  { label: 'Settings',          anchorId: 'section-campaign-settings' },
  { label: 'Sites',             anchorId: 'section-sites' },
  { label: 'Bidding strategy',  anchorId: 'section-bidding-strategy' },
  { label: 'Targeting',         anchorId: 'section-targeting' }
]

const activeSubItem = ref('Settings')

let observer = null
onMounted(() => {
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
  observer?.disconnect()
})

function onCancel() {
  store.reset()
  router.push('/')
}

function onNext() {
  const result = settingsRef.value?.validate() ?? { ok: true, errorItems: [] }

  if (!result.ok) {
    const { errorItems } = result

    // 1. Stepper sub-item labels → red (deduplicated)
    errorSubItems.value = [...new Set(errorItems.map(e => e.subItem))]

    // 2. Toast: list all unfilled fields
    const fieldNames = errorItems.map(e => e.label).join('、')
    toast({
      title: 'Please complete required fields',
      description: `${fieldNames} cannot be empty or invalid.`,
      variant: 'destructive',
      duration: 5000
    })

    return
  }

  // Clear any previous error highlights
  errorSubItems.value = []
  router.push(getNextPath('/campaign'))
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
  width: var(--content-width, 70vw);
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
