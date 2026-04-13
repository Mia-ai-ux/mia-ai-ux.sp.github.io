import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useCampaignStore } from '@/stores/campaign'

const campaignSubItems = [
  { label: 'Settings',           anchorId: 'section-campaign-settings' },
  { label: 'Sites',              anchorId: 'section-sites' },
  { label: 'Bidding strategy',   anchorId: 'section-bidding-strategy' },
  { label: 'Targeting',          anchorId: 'section-targeting' }
]

const autoAdGroupSubItems = [
  { label: 'Ad group name',   anchorId: 'section-ad-group-name' },
  { label: 'Product',         anchorId: 'section-product' },
  { label: 'Set bid pricing', anchorId: 'section-auto-targeting' }
]

const manualAdGroupSubItems = [
  { label: 'Ad group name',    anchorId: 'section-ad-group-name' },
  { label: 'Product',          anchorId: 'section-product' },
  { label: 'Manual Targeting', anchorId: 'section-manual-targeting' }
]

const negativeSubItems = [
  { label: 'Negative keyword', anchorId: 'section-negative-keyword' },
  { label: 'Exclude products', anchorId: 'section-negative-product' },
  { label: 'Exclude brands',   anchorId: 'section-negative-brand' }
]

export function useFlowSteps() {
  const store = useCampaignStore()
  const { form } = storeToRefs(store)

  const steps = computed(() => {
    const isAuto    = form.value.targeting === 'auto'
    const isKeyword = form.value.manualTargetType === 'keyword'

    if (isAuto) {
      // Automatic targeting → 4 steps
      return [
        { step: 1, label: 'Campaign Plan',      path: '/campaign',            subItems: campaignSubItems },
        { step: 2, label: 'Ad Group',           path: '/ad-group/auto',       subItems: autoAdGroupSubItems },
        { step: 3, label: 'Negative（optional）', path: '/negative-targeting',  subItems: negativeSubItems },
        { step: 4, label: 'Launch campaign',  path: '/ad' }
      ]
    } else if (isKeyword) {
      // Manual + Keyword targeting → 5 steps
      return [
        { step: 1, label: 'Campaign Plan',      path: '/campaign',            subItems: campaignSubItems },
        { step: 2, label: 'Ad Group',           path: '/ad-group/manual',     subItems: manualAdGroupSubItems },
        { step: 3, label: 'Keyword targeting',  path: '/keyword-targeting' },
        { step: 4, label: 'Negative（optional）', path: '/negative-targeting',  subItems: negativeSubItems },
        { step: 5, label: 'Launch campaign',  path: '/ad' }
      ]
    } else {
      // Manual + Product targeting → 5 steps
      return [
        { step: 1, label: 'Campaign Plan',      path: '/campaign',            subItems: campaignSubItems },
        { step: 2, label: 'Ad Group',           path: '/ad-group/manual',     subItems: manualAdGroupSubItems },
        { step: 3, label: 'Product targeting',  path: '/product-targeting' },
        { step: 4, label: 'Negative（optional）', path: '/negative-targeting',  subItems: negativeSubItems },
        { step: 5, label: 'Launch campaign',  path: '/ad' }
      ]
    }
  })

  /** 获取当前路径对应的步骤编号 */
  function getStepNumber(path) {
    const found = steps.value.find(s => s.path === path)
    return found ? found.step : 1
  }

  /** 下一步路径 */
  function getNextPath(currentPath) {
    const idx = steps.value.findIndex(s => s.path === currentPath)
    if (idx >= 0 && idx < steps.value.length - 1) {
      return steps.value[idx + 1].path
    }
    return currentPath
  }

  /** 上一步路径 */
  function getBackPath(currentPath) {
    const list = steps.value
    const idx = list.findIndex(s => s.path === currentPath)
    if (idx > 0) {
      return list[idx - 1].path
    }
    // Current route not in computed flow (e.g. store still default "auto" after refresh / deep link)
    if (idx < 0) {
      if (currentPath === '/keyword-targeting' || currentPath === '/product-targeting') {
        return '/ad-group/manual'
      }
      if (currentPath === '/negative-targeting') {
        if (form.value.targeting === 'auto') return '/ad-group/auto'
        return form.value.manualTargetType === 'keyword' ? '/keyword-targeting' : '/product-targeting'
      }
      if (currentPath === '/ad') {
        return '/negative-targeting'
      }
    }
    return currentPath
  }

  return { steps, getStepNumber, getNextPath, getBackPath }
}
