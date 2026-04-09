<template>
  <div class="page-layout">
    <div class="page-center">
      <Stepper :steps="steps" :current-step="getStepNumber('/ad')" />

      <div class="content-wrapper">
        <h2 class="page-title">Targeting</h2>
        <main class="main-content">
          <div class="placeholder-card">
            <p>此页面尚待开发。</p>
          </div>
        </main>
      </div>
    </div>
  </div>
  <BottomBar next-label="提交" show-back
    @cancel="router.push('/')"
    @back="router.push(getBackPath('/ad'))"
    @next="onSubmit"
  />
</template>

<script setup>
import { useRouter } from 'vue-router'
import Stepper from '@/components/Stepper.vue'
import BottomBar from '@/components/BottomBar.vue'
import { useFlowSteps } from '@/composables/useFlowSteps'

const router = useRouter()
const { steps, getStepNumber, getBackPath } = useFlowSteps()

function onSubmit() {
  alert('广告创建成功！')
  router.push('/campaign')
}
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

.placeholder-card {
  background: #fff;
  border-radius: 12px;
  padding: 40px 32px;
  color: #94a3b8;
  font-size: 16px;
}
</style>
