<script setup>
import { computed } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps({
  open: Boolean,
  title: { type: String, default: '确认操作' },
  description: String,
  confirmText: { type: String, default: '确认' },
  cancelText: { type: String, default: '取消' },
  variant: { type: String, default: 'default' }, // default | destructive
})

const emit = defineEmits(['update:open', 'confirm', 'cancel'])

function handleConfirm() {
  emit('confirm')
  emit('update:open', false)
}

function handleCancel() {
  emit('cancel')
  emit('update:open', false)
}
</script>

<template>
  <Teleport to="body">
    <Transition enter-active-class="transition-opacity duration-150" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition-opacity duration-150" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="open" class="fixed inset-0 z-50 bg-black/50" @click="handleCancel" />
    </Transition>
    <Transition enter-active-class="transition-all duration-150" enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100" leave-active-class="transition-all duration-150" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
      <div
        v-if="open"
        class="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-md rounded-lg border bg-background p-6 shadow-lg"
        role="alertdialog"
      >
        <slot>
          <h2 class="text-lg font-semibold">{{ title }}</h2>
          <p v-if="description" class="mt-2 text-sm text-muted-foreground">{{ description }}</p>
        </slot>
        <div class="mt-5 flex justify-end gap-2">
          <button
            class="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            @click="handleCancel"
          >
            {{ cancelText }}
          </button>
          <button
            :class="cn(
              'inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium',
              variant === 'destructive'
                ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
            )"
            @click="handleConfirm"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
