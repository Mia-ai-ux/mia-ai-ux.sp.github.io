<template>
  <div class="video-content">
    <!-- Store on Amazon → same as Store Spotlight + Video upload -->
    <template v-if="form.videoLandingType === 'store'">
      <StoreSpotlightContent ref="storeSpotlightRef" />

      <section id="section-sb-video" class="card">
        <div class="title-group">
          <h2>Video <span class="required">*</span></h2>
          <p>Upload a video to showcase your product. Recommended: 6-45 seconds, 1920x1080px.</p>
        </div>

        <div class="video-upload-area" :class="{ 'has-error': errors.video }">
          <div v-if="!form.videoPreviewUrl" class="upload-placeholder">
            <div class="upload-icon">
              <Upload :size="32" />
            </div>
            <p class="upload-text">Drag and drop your video here, or click to browse</p>
            <p class="upload-hint">MP4, MOV supported. Max 500MB.</p>
            <input
              type="file"
              accept="video/mp4,video/quicktime"
              class="upload-input"
              @change="onVideoSelect"
            />
          </div>

          <div v-else class="video-preview">
            <video :src="form.videoPreviewUrl" controls class="preview-video" />
            <button type="button" class="remove-video" @click="removeVideo">
              <X :size="16" />
              Remove
            </button>
          </div>
        </div>
        <p v-if="errors.video" class="error-msg">{{ errors.video }}</p>
      </section>
    </template>

    <!-- Product detail page → same as Collections > Manual (no Video module) -->
    <template v-else>
      <section id="section-sb-products" class="card">
        <h2>Products</h2>
        <p class="section-desc">Add 3-10 products to feature in your ad. Drag cards to change the display order.</p>
        <ProductSelector
          v-model="form.products"
          picker-title="Select products to feature in your ad"
          :min="3"
          :max="10"
          :draggable="true"
          label="Add"
          :error="errors.products"
          @update:model-value="errors.products = ''"
        />
        <p v-if="errors.products" class="error-msg">{{ errors.products }}</p>
      </section>
    </template>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useSbStore } from '@/stores/sb'
import { Upload, X } from 'lucide-vue-next'
import StoreSpotlightContent from '../storeSpotlight/StoreSpotlightContent.vue'
import ProductSelector from '../collections/ProductSelector.vue'

const { form } = storeToRefs(useSbStore())

const storeSpotlightRef = ref(null)

const errors = reactive({
  products: '',
  video: ''
})

function onVideoSelect(e) {
  const file = e.target.files?.[0]
  if (!file) return

  form.value.videoFile = file
  form.value.videoPreviewUrl = URL.createObjectURL(file)
  errors.video = ''
}

function removeVideo() {
  if (form.value.videoPreviewUrl) {
    URL.revokeObjectURL(form.value.videoPreviewUrl)
  }
  form.value.videoFile = null
  form.value.videoPreviewUrl = ''
}

function validate() {
  const errorItems = []

  if (form.value.videoLandingType === 'store') {
    const r = storeSpotlightRef.value?.validate?.() ?? { ok: true, errorItems: [] }
    if (!r.ok) {
      errorItems.push(...r.errorItems)
    }

    if (!form.value.videoFile && !form.value.videoPreviewUrl) {
      errors.video = 'Please upload a video.'
      errorItems.push({ subItem: 'Video', label: 'Video', anchorId: 'section-sb-video' })
    } else {
      errors.video = ''
    }
  } else {
    if (form.value.products.length < 3) {
      errors.products = form.value.products.length === 0
        ? 'Please add at least 3 products.'
        : `Please add ${3 - form.value.products.length} more product${3 - form.value.products.length > 1 ? 's' : ''} (minimum 3 required).`
      errorItems.push({ subItem: 'Products', label: 'Products', anchorId: 'section-sb-products' })
    } else {
      errors.products = ''
    }
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
.video-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.card {
  background: var(--bg-card);
  border-radius: var(--radius-card);
  padding: 28px 32px;
}

.title-group {
  margin-bottom: 20px;
}

.title-group h2 {
  margin: 0;
  font-size: var(--text-2xl, 22px);
  font-weight: 600;
  color: var(--text-main);
}

.title-group p {
  margin: 4px 0 0;
  font-size: var(--text-base, 14px);
  color: var(--text-sub);
}

.required {
  color: var(--color-danger);
  font-size: var(--text-sm, 13px);
}

.section-desc {
  margin: -8px 0 16px;
  font-size: var(--text-sm, 13px);
  color: var(--text-sub);
  line-height: 1.5;
}

.error-msg {
  margin: 6px 0 0;
  font-size: var(--text-sm, 13px);
  color: var(--color-danger);
  line-height: 1.4;
}

.video-upload-area {
  border: 2px dashed var(--border);
  border-radius: var(--radius-md, 8px);
  overflow: hidden;
  transition: border-color 0.15s;
}

.video-upload-area.has-error {
  border-color: var(--color-danger);
}

.upload-placeholder {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
}

.upload-placeholder:hover {
  background: var(--gray-50, #f8fafc);
}

.upload-icon {
  color: var(--text-hint);
  margin-bottom: 12px;
}

.upload-text {
  margin: 0;
  font-size: var(--text-base, 14px);
  color: var(--text-main);
  font-weight: 500;
}

.upload-hint {
  margin: 6px 0 0;
  font-size: var(--text-sm, 13px);
  color: var(--text-hint);
}

.upload-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.video-preview {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.preview-video {
  width: 100%;
  max-width: 480px;
  border-radius: var(--radius-md, 8px);
  background: #000;
}

.remove-video {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  align-self: flex-start;
  padding: 6px 12px;
  background: var(--gray-100, #f1f5f9);
  border: none;
  border-radius: 4px;
  font-size: var(--text-sm, 13px);
  color: var(--text-sub);
  cursor: pointer;
  transition: color 0.15s, background 0.15s;
}

.remove-video:hover {
  color: var(--color-danger);
  background: var(--gray-200, #e2e8f0);
}
</style>
