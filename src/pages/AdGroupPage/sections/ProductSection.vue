<template>
  <section id="section-product" class="card">
    <div class="title-group">
      <h2>Product</h2>
      <p>Select the products you want to advertise for this ad group</p>
    </div>

    <div class="product-list" v-if="form.products.length > 0">
      <div class="product-item" v-for="(p, i) in form.products" :key="i">
        <span>{{ p }}</span>
        <button class="remove-btn" @click="removeProduct(i)" title="移除">✕</button>
      </div>
    </div>

    <button class="add-btn" type="button" @click="addProduct">
      <span class="add-icon">
        <svg width="14" height="14" viewBox="0 0 10 10" fill="none">
          <path d="M5 1v8M1 5h8" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
      </span>
      Add
    </button>
  </section>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useCampaignStore } from '@/stores/campaign'

const { form } = storeToRefs(useCampaignStore())

function addProduct() {
  const name = prompt('输入 ASIN 或商品名称')
  if (name && name.trim()) form.value.products.push(name.trim())
}

function removeProduct(i) {
  form.value.products.splice(i, 1)
}
</script>

<style scoped>
.card {
  background: var(--bg-card);
  border-radius: var(--radius-card);
  padding: 28px 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
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

.product-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.product-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--control-bg);
  border-radius: 3px;
  padding: 8px 12px;
  font-size: var(--text-base, 14px);
}

.remove-btn {
  background: none;
  border: none;
  color: #737d8c;
  cursor: pointer;
  font-size: 16px;
  padding: 2px 4px;
}

.remove-btn:hover {
  color: #e53e3e;
}

.add-btn {
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  gap: 10px;
  background: #e8e8e8;
  border: none;
  border-radius: 44px;
  height: 44px;
  padding: 0 20px 0 7px;
  font-size: var(--text-base, 14px);
  font-weight: 500;
  color: #424244;
  cursor: pointer;
  transition: background 0.15s;
  font-family: inherit;
}

.add-btn:hover {
  background: #d8d8d8;
}

.add-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #424244;
  flex-shrink: 0;
}
</style>
