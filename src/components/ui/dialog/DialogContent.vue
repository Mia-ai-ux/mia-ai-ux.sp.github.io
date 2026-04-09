<script setup>
import { inject } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps({ class: String })
const dialog = inject('dialog')
</script>

<template>
  <Teleport to="body">
    <DialogOverlay />
    <Transition
      enter-active-class="transition-all duration-200"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition-all duration-200"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="dialog?.open.value"
        :class="cn(
          'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2',
          'w-full max-w-lg rounded-lg border bg-background p-6 shadow-lg',
          props.class
        )"
        role="dialog"
      >
        <slot />
        <button
          class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring"
          @click="dialog?.close()"
          aria-label="关闭"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<script>
import DialogOverlay from './DialogOverlay.vue'
export default { components: { DialogOverlay } }
</script>
