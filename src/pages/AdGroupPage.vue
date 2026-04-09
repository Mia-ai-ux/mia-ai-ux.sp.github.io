<template>
  <div class="page-layout">
    <Stepper :steps="steps" :current-step="2" />
    <main class="placeholder-content">
      <div class="placeholder-card">
        <h2>Ad Group</h2>
        <p>此页面尚待开发。</p>
      </div>
    </main>
  </div>
  <BottomBar next-label="下一步" @cancel="router.push('/campaign')" @next="router.push('/ad')" />
</template>

<script setup>
import { useRouter } from 'vue-router'
import Stepper from '@/components/Stepper.vue'
import BottomBar from '@/components/BottomBar.vue'

const router = useRouter()

const steps = [
  { step: 1, label: 'Campaign', path: '/campaign' },
  { step: 2, label: 'Ad Group', path: '/ad-group' },
  { step: 3, label: 'Ad', path: '/ad' }
]
</script>

<style scoped>
.page-layout {
  display: flex;
  min-height: calc(100vh - 50px);
}

.placeholder-content {
  flex: 1;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 40px 16px 80px;
}

.placeholder-card {
  background: #fff;
  border-radius: 4px;
  padding: 48px 40px;
  width: 640px;
  text-align: center;
  color: #737d8c;
}

.placeholder-card h2 {
  margin: 0 0 12px;
  font-size: 28px;
  color: #12171f;
}
</style>
