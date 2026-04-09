<script setup>
import { ref } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
    // [{ label, icon?, disabled?, separator?, onClick? }]
  },
  align: { type: String, default: 'start' }, // start | end
  class: String,
  menuClass: String,
})

const open = ref(false)

function toggle() { open.value = !open.value }
function close() { open.value = false }

function handleItem(item) {
  if (item.disabled) return
  item.onClick?.()
  close()
}
</script>

<template>
  <div :class="cn('relative inline-block', props.class)">
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
          'absolute top-full z-50 mt-1 min-w-[160px] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md',
          align === 'end' ? 'right-0' : 'left-0',
          props.menuClass
        )"
        @mouseleave="close"
      >
        <slot name="content">
          <div class="p-1">
            <template v-for="(item, i) in items" :key="i">
              <hr v-if="item.separator" class="my-1 border-border" />
              <button
                v-else
                :disabled="item.disabled"
                :class="cn(
                  'flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none',
                  'hover:bg-accent hover:text-accent-foreground',
                  'disabled:pointer-events-none disabled:opacity-50',
                  item.class
                )"
                @click="handleItem(item)"
              >
                <component :is="item.icon" v-if="item.icon" class="h-4 w-4" />
                {{ item.label }}
              </button>
            </template>
          </div>
        </slot>
      </div>
    </Transition>
    <div v-if="open" class="fixed inset-0 z-40" @click="close" />
  </div>
</template>
