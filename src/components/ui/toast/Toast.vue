<script setup>
import { cn } from '@/lib/utils'

const props = defineProps({
  toasts: { type: Array, default: () => [] },
  // [{ id, title, description, variant, duration }]
})

const emit = defineEmits(['dismiss'])

const variantClasses = {
  default: 'border bg-background text-foreground',
  destructive: 'destructive border-destructive bg-destructive text-destructive-foreground',
  success: 'border-green-500 bg-green-50 text-green-800',
}
</script>

<template>
  <Teleport to="body">
    <div class="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <TransitionGroup
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 translate-x-8"
        enter-to-class="opacity-100 translate-x-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 translate-x-0"
        leave-to-class="opacity-0 translate-x-8"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="cn(
            'pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-lg p-4 pr-8 shadow-lg',
            variantClasses[toast.variant] ?? variantClasses.default
          )"
        >
          <div class="flex-1 grid gap-1">
            <p v-if="toast.title" class="text-sm font-semibold">{{ toast.title }}</p>
            <p v-if="toast.description" class="text-sm opacity-80">{{ toast.description }}</p>
          </div>
          <button
            class="absolute right-2 top-2 rounded-md p-0.5 opacity-50 hover:opacity-100"
            @click="emit('dismiss', toast.id)"
            aria-label="关闭"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>
