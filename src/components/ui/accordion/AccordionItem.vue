<script setup>
import { inject, computed } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps({
  value: String,
  class: String,
})

const accordion = inject('accordion')
const isOpen = computed(() => accordion?.isOpen(props.value))
</script>

<template>
  <div :class="cn('border-b', props.class)">
    <button
      type="button"
      :class="cn(
        'flex w-full items-center justify-between py-4 text-sm font-medium transition-all hover:underline text-left',
        '[&[data-state=open]>svg]:rotate-180'
      )"
      :data-state="isOpen ? 'open' : 'closed'"
      @click="accordion?.toggle(value)"
    >
      <slot name="trigger" />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round"
        :class="cn('shrink-0 text-muted-foreground transition-transform duration-200', isOpen && 'rotate-180')"
      >
        <path d="m6 9 6 6 6-6"/>
      </svg>
    </button>
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 max-h-0"
      enter-to-class="opacity-100 max-h-96"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 max-h-96"
      leave-to-class="opacity-0 max-h-0"
    >
      <div v-if="isOpen" class="overflow-hidden">
        <div class="pb-4 pt-0 text-sm">
          <slot name="content" />
        </div>
      </div>
    </Transition>
  </div>
</template>
