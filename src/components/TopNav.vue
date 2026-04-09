<template>
  <header class="top-nav" :class="{ scrolled: isScrolled }">
    <div class="nav-left">
      <div class="brand">
        <img :src="logoUrl" alt="飞轮" class="brand-logo" />
        <div class="brand-text">
          <span class="brand-name">飞轮</span>
          <span class="brand-version">v3.5.1</span>
        </div>
      </div>
      <div class="nav-divider" />
      <span class="nav-page-title">{{ pageTitle }}</span>
    </div>
    <div class="nav-right">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
      <span>{{ userName }}</span>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import logoUrl from '@/assets/logo.png'

defineProps({
  userName: { type: String, default: '' },
  pageTitle: { type: String, default: '' }
})

const isScrolled = ref(false)

function onScroll() {
  isScrolled.value = window.scrollY > 4
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.top-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  height: var(--nav-height, 60px);
  background: var(--bg-card);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  transition: box-shadow 0.2s;
}

.top-nav.scrolled {
  box-shadow: var(--shadow-sm);
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.nav-divider {
  width: 1px;
  height: 20px;
  background: var(--border-strong);
  flex-shrink: 0;
}

.nav-page-title {
  font-size: var(--text-md, 15px);
  font-weight: 500;
  color: var(--text-sub);
  white-space: nowrap;
}

.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.brand-logo {
  width: 28px;
  height: 28px;
  object-fit: contain;
}

/* 品牌名和版本号横排，版本号对齐基线 */
.brand-text {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.brand-name {
  font-size: var(--text-lg, 16px);
  font-weight: 700;
  color: var(--text-main);
}

.brand-version {
  font-size: var(--text-xs, 12px);
  color: var(--text-hint);
  font-weight: 400;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: var(--text-base, 14px);
  color: var(--text-sub);
}
</style>
