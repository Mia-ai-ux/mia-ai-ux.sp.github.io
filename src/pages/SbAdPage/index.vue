<template>
  <div class="page-layout">
    <div class="page-center">
      <Stepper
        :steps="steps"
        :current-step="getStepNumber('/sb/ad')"
        :active-sub-item="activeSubItem"
        :error-sub-items="errorSubItems"
      />

      <div class="content-wrapper">
        <h2 class="page-title">Ad</h2>
        <main class="main-content">
          <CollectionsContent
            v-if="form.adFormat === 'collections'"
            ref="contentRef"
          />
          <VideoContent
            v-else-if="form.adFormat === 'video'"
            ref="contentRef"
          />
          <StoreSpotlightContent
            v-else-if="form.adFormat === 'store_spotlight'"
            ref="contentRef"
          />
        </main>
      </div>
    </div>
  </div>

  <BottomBar show-back @cancel="onCancel" @back="onBack" @next="onNext" />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useSbStore } from '@/stores/sb'
import { storeToRefs } from 'pinia'
import Stepper from '@/components/Stepper.vue'
import BottomBar from '@/components/BottomBar.vue'
import CollectionsContent from './collections/CollectionsContent.vue'
import VideoContent from './video/VideoContent.vue'
import StoreSpotlightContent from './storeSpotlight/StoreSpotlightContent.vue'
import { useSbFlowSteps } from '@/composables/useSbFlowSteps'

const router = useRouter()
const store = useSbStore()
const { form } = storeToRefs(store)
const { steps, getStepNumber, getNextPath, getBackPath } = useSbFlowSteps()

const contentRef = ref(null)
const hasTriedToSubmit = ref(false)
const activeSubItem = ref('')
const errorSubItems = ref([])

const subItemsMap = {
  collections: [
    { label: 'Ad name',      anchorId: 'section-sb-ad-name' },
    { label: 'Landing page', anchorId: 'section-sb-landing-page' },
    { label: 'Targeting',    anchorId: 'section-sb-ad-targeting' }
  ],
  store_spotlight: [
    { label: 'Ad name',            anchorId: 'section-sb-ss-ad-name' },
    { label: 'Headline',           anchorId: 'section-sb-ss-headline' },
    { label: 'Brand store pages',  anchorId: 'section-sb-ss-store-pages' },
    { label: 'Brand assets',       anchorId: 'section-sb-ss-brand-assets' }
  ]
}

const videoSubItems = computed(() => {
  if (form.value.videoLandingType === 'store') {
    return [
      { label: 'Ad name', anchorId: 'section-sb-ss-ad-name' },
      { label: 'Headline', anchorId: 'section-sb-ss-headline' },
      { label: 'Brand store pages', anchorId: 'section-sb-ss-store-pages' },
      { label: 'Brand assets', anchorId: 'section-sb-ss-brand-assets' },
      { label: 'Video', anchorId: 'section-sb-video' }
    ]
  }
  return [{ label: 'Products', anchorId: 'section-sb-products' }]
})

const currentSubItems = computed(() => {
  if (form.value.adFormat === 'video') return videoSubItems.value
  return subItemsMap[form.value.adFormat] || []
})

let observer = null

function setupObserver() {
  observer?.disconnect()

  const sectionEls = currentSubItems.value
    .map(s => ({ label: s.label, el: document.getElementById(s.anchorId) }))
    .filter(s => s.el)

  if (sectionEls.length === 0) return

  activeSubItem.value = sectionEls[0]?.label || ''

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
}

onMounted(() => {
  setTimeout(setupObserver, 100)
})

watch(() => form.value.adFormat, () => {
  setTimeout(setupObserver, 100)
})

watch(() => form.value.videoLandingType, () => {
  if (form.value.adFormat === 'video') {
    setTimeout(setupObserver, 100)
  }
})

onUnmounted(() => {
  observer?.disconnect()
})

function onCancel() { router.push('/') }
function onBack()   { router.push(getBackPath('/sb/ad')) }

function onNext() {
  const result = contentRef.value?.validate?.() ?? { ok: true, errorItems: [] }

  if (!result.ok) {
    hasTriedToSubmit.value = true
    errorSubItems.value = result.errorItems.map(e => e.subItem)
    return
  }

  hasTriedToSubmit.value = false
  errorSubItems.value = []
  router.push(getNextPath('/sb/ad'))
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
