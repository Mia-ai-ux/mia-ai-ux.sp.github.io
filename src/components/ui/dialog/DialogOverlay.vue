<script setup>
import { inject } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps({ class: String })
const dialog = inject('dialog')
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="dialog?.open.value"
        :class="cn('fixed inset-0 z-50 bg-black/50', props.class)"
        @click="dialog?.close()"
      />
    </Transition>
  </Teleport>
</template>
