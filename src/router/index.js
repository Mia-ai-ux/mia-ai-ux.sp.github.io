import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', redirect: '/campaign' },
  {
    path: '/campaign',
    component: () => import('@/pages/CampaignPage/index.vue'),
    meta: { step: 1, label: 'Campaign Plan' }
  },
  {
    path: '/ad-group/auto',
    component: () => import('@/pages/AdGroupPage/AutoPage.vue'),
    meta: { step: 2, label: 'Ad Group' }
  },
  {
    path: '/ad-group/manual',
    component: () => import('@/pages/AdGroupPage/ManualPage.vue'),
    meta: { step: 2, label: 'Ad Group' }
  },
  {
    path: '/keyword-targeting',
    component: () => import('@/pages/KeywordTargetingPage.vue'),
    meta: { step: 3, label: 'Keyword targeting' }
  },
  {
    path: '/product-targeting',
    component: () => import('@/pages/ProductTargetingPage.vue'),
    meta: { step: 3, label: 'Product targeting' }
  },
  {
    path: '/negative-targeting',
    component: () => import('@/pages/NegativeTargetingPage.vue'),
    meta: { label: 'Negative targeting' }
  },
  {
    path: '/ad',
    component: () => import('@/pages/AdPage.vue'),
    meta: { label: 'Targeting' }
  }
]

export default createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
})
