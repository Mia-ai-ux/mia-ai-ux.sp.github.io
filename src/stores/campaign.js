import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCampaignStore = defineStore('campaign', () => {
  const now = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  const dateStr = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
  const todayDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`

  const form = ref({
    // ── Step 1: Campaign ──────────────────────────
    siteType: 'amazon_and_beyond',
    campaignName: '',
    dailyBudget: 20.0,
    scheduleType: 'continuous',
    startTime: todayDate,
    endTime: '',
    portfolio: '',
    bidMode: 'down_only',
    bidTop: 0,
    bidRest: 0,
    bidProduct: 0,
    audienceMode: 'don_t_increase',  // 'increase_amazon_built' | 'increase_amc_custom' | 'don_t_increase'
    audienceId:   '',
    audiencePct:  0,
    targeting: 'auto',

    // ── Step 2: Ad Group ──────────────────────────
    adGroupName: '',
    adGroupBid: 7.5,

    // Ad group products: { id, asin, title, image, rating, reviews, originalPrice, price, inStock }
    products: [],

    // Automatic targeting bid mode
    autoBidMode: 'targeting_group',   // 'targeting_group' | 'default_bid'

    // Automatic targeting – per group + default (default uses adGroupBid, same as Bid adjustment base)
    autoGroups: {
      closeMatch:   { enabled: true,  bid: 0 },
      looseMatch:   { enabled: true,  bid: 0 },
      substitutes:  { enabled: true,  bid: 0 },
      complements:  { enabled: true,  bid: 0 }
    },

    // Manual targeting
    manualTargetType: 'keyword',   // 'keyword' | 'product'

    // Keyword targeting step (UI state)
    keywordTargetTab: 'enter',  // 'enter' | 'amazon' | 'campaigns'
    keywordTargetingDefaultBid: 0.07,
    keywordTargetingMatchTypes: { exact: true, broad: false, phrase: false },
    keywordSelectedCampaignId: '',
    keywordSelectedAdGroupId: '',

    // Negative targeting
    negativeKeywords: [],    // [{ id, keyword, matchType: 'Negative Exact' | 'Negative Phrase' }]
    excludedProducts: [],    // [{ id, image, title, rating, reviews, originalPrice, price, asin }]
    excludedBrands: [],      // [{ id, name }]

    // Keyword targeting — added keywords (right panel)
    // { id, text, subtitle?, matchType, is?, ir?, suggestBid, suggestRange, bid, manual?: boolean }
    keywords: [],

    // Pool for targeting library tab (mock)
    libraryKeywords: [
      { id: 'lib-1', text: 'ceramic space heater', subtitle: 'Ceramic heater', is: '12.1%', ir: 3, matchType: 'Exact', suggestBid: '$1.04', suggestRange: '$0.80–$1.35' },
      { id: 'lib-2', text: 'portable electric heater', subtitle: 'Portable heater', is: '11.4%', ir: 4, matchType: 'Exact', suggestBid: '$0.92', suggestRange: '$0.70–$1.12' }
    ],

    // Product targeting step
    productTargetMode: 'category',           // 'category' | 'product'
    productCategoryTab: 'suggested',         // 'suggested' | 'search'
    productProductTab: 'enter',              // 'enter' | 'campaigns' | 'suggested'
    productTargetingDefaultBid: 0.02,
    productDeliveryType: { exact: true, expanded: false },
    productAsinTheme: 'similar',
    productSelectedCampaignId: '',
    productSelectedAdGroupId: '',
    // Added targets (right panel): { id, kind, title, subtitle?, path?, asin?, image?, deliveryType, suggestBid, suggestRange, bid, checked }
    productTargets: [],
  })

  function reset() {
    form.value.siteType = 'amazon_and_beyond'
    form.value.bidMode = 'down_only'
    form.value.targeting = 'auto'
    form.value.scheduleType = 'continuous'
    form.value.manualTargetType = 'keyword'
  }

  return { form, reset }
})
