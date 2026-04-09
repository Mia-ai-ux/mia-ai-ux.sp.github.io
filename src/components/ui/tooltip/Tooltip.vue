<script setup>
import { ref } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps({
  content: String,
  side: { type: String, default: 'top' }, // top | bottom | left | right
  class: String,
  contentClass: String,
})

const visible = ref(false)

const positionClasses = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
}
</script>

<template>
  <span
    :class="cn('relative inline-flex', props.class)"
    @mouseenter="visible = true"
    @mouseleave="visible = false"
    @focusin="visible = true"
    @focusout="visible = false"
  >
    <slot />
    <Transition
      enter-active-class="transition-opacity duration-150"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <span
        v-if="visible && content"
        :class="cn(
          'absolute z-50 w-max max-w-[200px] rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground shadow-md pointer-events-none',
          positionClasses[side],
          props.contentClass
        )"
        role="tooltip"
      >
        {{ content }}
      </span>
    </Transition>
  </span>
</template>
