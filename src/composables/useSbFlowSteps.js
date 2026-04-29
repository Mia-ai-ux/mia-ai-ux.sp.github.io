import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useSbStore } from '@/stores/sb'

const campaignSubItems = [
  { label: 'Settings',        anchorId: 'section-sb-settings' },
  { label: 'Goals',           anchorId: 'section-sb-goals' },
  { label: 'Sites',           anchorId: 'section-sb-sites' },
  { label: 'Placements',      anchorId: 'section-sb-placements' },
  { label: 'Bid adjustment',  anchorId: 'section-sb-bid-adjustment' }
]

const adGroupSubItems = [
  { label: 'Ad group name',  anchorId: 'section-sb-ad-group-name' },
  { label: 'Ad format',      anchorId: 'section-sb-ad-format' },
  { label: 'Targeting',      anchorId: 'section-sb-targeting' }
]

const collectionsAdSubItems = [
  { label: 'Ad name',        anchorId: 'section-sb-ad-name' },
  { label: 'Landing page',   anchorId: 'section-sb-landing-page' },
  { label: 'Targeting',      anchorId: 'section-sb-ad-targeting' }
]

const videoAdSubItems = [
  { label: 'Landing page',   anchorId: 'section-sb-landing-page' },
  { label: 'Products',       anchorId: 'section-sb-products' },
  { label: 'Video',          anchorId: 'section-sb-video' }
]

const storeSpotlightAdSubItems = [
  { label: 'Store',          anchorId: 'section-sb-store' },
  { label: 'Store pages',    anchorId: 'section-sb-store-pages' }
]

const negativeSubItems = [
  { label: 'Negative keyword', anchorId: 'section-negative-keyword' },
  { label: 'Exclude products', anchorId: 'section-negative-product' },
  { label: 'Exclude brands',   anchorId: 'section-negative-brand' }
]

export function useSbFlowSteps() {
  const store = useSbStore()
  const { form } = storeToRefs(store)

  const steps = computed(() => {
    const adFormat = form.value.adFormat

    // Determine Ad step subItems based on ad format
    let adSubItems
    switch (adFormat) {
      case 'video':
        adSubItems = videoAdSubItems
        break
      case 'store_spotlight':
        adSubItems = storeSpotlightAdSubItems
        break
      case 'collections':
      default:
        adSubItems = collectionsAdSubItems
    }

    // SB always has 5 steps (step numbers don't change, but Step 3 content changes)
    return [
      { step: 1, label: 'Campaign Plan',       path: '/sb/campaign',   subItems: campaignSubItems },
      { step: 2, label: 'Ad Group',            path: '/sb/ad-group',   subItems: adGroupSubItems },
      { step: 3, label: 'Ad',                  path: '/sb/ad',         subItems: adSubItems },
      { step: 4, label: 'Negative（optional）', path: '/sb/negative',   subItems: negativeSubItems },
      { step: 5, label: 'Launch campaign',     path: '/sb/launch' }
    ]
  })

  function getStepNumber(path) {
    const found = steps.value.find(s => s.path === path)
    return found ? found.step : 1
  }

  function getNextPath(currentPath) {
    const idx = steps.value.findIndex(s => s.path === currentPath)
    if (idx >= 0 && idx < steps.value.length - 1) {
      return steps.value[idx + 1].path
    }
    return currentPath
  }

  function getBackPath(currentPath) {
    const list = steps.value
    const idx = list.findIndex(s => s.path === currentPath)
    if (idx > 0) {
      return list[idx - 1].path
    }
    return currentPath
  }

  return { steps, getStepNumber, getNextPath, getBackPath }
}
