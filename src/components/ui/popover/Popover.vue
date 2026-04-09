<script setup>
import { ref } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps({
  side: { type: String, default: 'bottom' }, // top | bottom | left | right
  align: { type: String, default: 'start' },  // start | center | end
  class: String,
  contentClass: String,
})

const open = ref(false)

const positionClasses = {
  top: 'bottom-full mb-2',
  bottom: 'top-full mt-2',
  left: 'right-full mr-2 top-0',
  right: 'left-full ml-2 top-0',
}

const alignClasses = {
  start: 'left-0',
  center: 'left-1/2 -translate-x-1/2',
  end: 'right-0',
}

function toggle() { open.value = !open.value }
function close() { open.value = false }
</script>

<template>
  <div :class="cn('relative inline-block', props.class)" v-click-outside="close">
    <div @click="toggle">
      <slot name="trigger" />
    </div>
    <Transition
      enter-active-class="transition-all duration-150"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition-all duration-100"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="open"
        :class="cn(
          'absolute z-50 min-w-[200px] rounded-md border bg-popover text-popover-foreground shadow-md outline-none',
          positionClasses[side],
          alignClasses[align],
          props.contentClass
        )"
      >
        <slot name="content" :close="close" />
      </div>
    </Transition>
  </div>
</template>
