<template>
  <div style="padding: 40px; font-family: inherit; background: #f9fafb; min-height: 100vh;">
    <h2 style="margin: 0 0 32px; font-size: 18px; font-weight: 600; color: #111;">Button 对比</h2>

    <!-- Current: scoped CSS -->
    <section style="margin-bottom: 48px;">
      <p style="font-size: 13px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: .05em; margin: 0 0 16px;">
        当前实现（scoped CSS · border-radius: 3px）
      </p>
      <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
        <CurrentButton variant="default">Default</CurrentButton>
        <CurrentButton variant="outline">Outline</CurrentButton>
        <CurrentButton variant="ghost">Ghost</CurrentButton>
        <CurrentButton variant="link">Link</CurrentButton>
        <CurrentButton variant="destructive">Destructive</CurrentButton>
        <CurrentButton variant="default" :disabled="true">Disabled</CurrentButton>
      </div>
      <div style="display: flex; align-items: center; gap: 12px; margin-top: 12px;">
        <CurrentButton variant="default" size="sm">Small</CurrentButton>
        <CurrentButton variant="default" size="default">Default</CurrentButton>
        <CurrentButton variant="default" size="lg">Large</CurrentButton>
      </div>
    </section>

    <!-- shadcn-vue style: Tailwind + CVA -->
    <section>
      <p style="font-size: 13px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: .05em; margin: 0 0 16px;">
        shadcn-vue 风格（Tailwind · border-radius: 6px · ring focus）
      </p>
      <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
        <ShadcnButton variant="default">Default</ShadcnButton>
        <ShadcnButton variant="outline">Outline</ShadcnButton>
        <ShadcnButton variant="ghost">Ghost</ShadcnButton>
        <ShadcnButton variant="link">Link</ShadcnButton>
        <ShadcnButton variant="destructive">Destructive</ShadcnButton>
        <ShadcnButton variant="default" disabled>Disabled</ShadcnButton>
      </div>
      <div style="display: flex; align-items: center; gap: 12px; margin-top: 12px;">
        <ShadcnButton variant="default" size="sm">Small</ShadcnButton>
        <ShadcnButton variant="default" size="default">Default</ShadcnButton>
        <ShadcnButton variant="default" size="lg">Large</ShadcnButton>
      </div>
    </section>
  </div>
</template>

<script setup>
import CurrentButton from '@/components/ui/button/Button.vue'
import ShadcnButton  from '@/components/ui/button/ShadcnButton.vue'
</script>
