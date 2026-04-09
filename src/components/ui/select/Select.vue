<script setup>
import { ref, computed, watch, nextTick } from 'vue'

const props = defineProps({
  modelValue:  [String, Number],
  placeholder: { type: String, default: 'Select…' },
  disabled:    Boolean,
  options: {
    type: Array,
    default: () => [],
    // [{ label: '标签', value: '值' }]
  },
  size: { type: String, default: 'default' }, // 'sm' | 'default' | 'lg'
  /** Show search field at top of dropdown; filters options by label */
  searchable: { type: Boolean, default: false },
  searchPlaceholder: { type: String, default: 'Search…' },
})

const emit = defineEmits(['update:modelValue'])

const open = ref(false)
const searchQuery = ref('')
const searchInputRef = ref(null)

watch(open, (isOpen) => {
  if (!isOpen) searchQuery.value = ''
  else if (props.searchable) {
    nextTick(() => searchInputRef.value?.focus?.())
  }
})

const filteredOptions = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return props.options
  return props.options.filter((o) => String(o.label).toLowerCase().includes(q))
})

function toggle() { if (!props.disabled) open.value = !open.value }
function close() { open.value = false }

function select(value) {
  emit('update:modelValue', value)
  close()
}

const selectedLabel = computed(() => {
  const found = props.options.find(o => o.value === props.modelValue)
  return found ? found.label : ''
})
</script>

<template>
  <div class="ui-select-wrap">
    <!-- Trigger -->
    <button
      type="button"
      class="ui-select-trigger"
      :class="[`ui-select--${size}`, { 'is-placeholder': !modelValue, 'is-disabled': disabled }]"
      :disabled="disabled"
      @click="toggle"
    >
      <span class="ui-select-value">{{ selectedLabel || placeholder }}</span>
      <!-- Chevron -->
      <svg
        class="ui-select-chevron"
        :class="{ open }"
        xmlns="http://www.w3.org/2000/svg"
        width="14" height="14" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round"
      >
        <path d="M6 9l6 6 6-6"/>
      </svg>
    </button>

    <!-- Backdrop -->
    <div v-if="open" class="ui-select-backdrop" @click="close" />

    <!-- Dropdown panel -->
    <Transition name="ui-select-fade">
      <div v-if="open" class="ui-select-panel" :class="{ 'has-search': searchable }">
        <div v-if="searchable" class="ui-select-search-row" @click.stop>
          <svg
            class="ui-select-search-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            ref="searchInputRef"
            v-model="searchQuery"
            type="search"
            class="ui-select-search-input"
            :placeholder="searchPlaceholder"
            autocomplete="off"
            @keydown.escape.prevent="close"
          />
        </div>
        <div v-if="searchable" class="ui-select-search-sep" role="separator" />

        <template v-if="filteredOptions.length">
          <button
            v-for="opt in filteredOptions"
            :key="opt.value"
            type="button"
            class="ui-select-option"
            :class="{ 'is-selected': opt.value === modelValue }"
            @click="select(opt.value)"
          >
            <!-- Checkmark for selected -->
            <svg
              v-if="opt.value === modelValue"
              class="ui-select-check"
              xmlns="http://www.w3.org/2000/svg"
              width="14" height="14" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2.5"
              stroke-linecap="round" stroke-linejoin="round"
            >
              <path d="M20 6 9 17l-5-5"/>
            </svg>
            <span :class="opt.value === modelValue ? '' : 'ui-select-option-indent'">{{ opt.label }}</span>
          </button>
        </template>
        <div v-else class="ui-select-empty">No results</div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.ui-select-wrap {
  position: relative;
  display: inline-block;
  width: 100%;
}

/* ── Trigger ── */
.ui-select-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 3px;
  background: #fff;
  color: #111;
  cursor: pointer;
  box-sizing: border-box;
  font-family: inherit;
  transition: border-color 0.15s, box-shadow 0.15s;
  text-align: left;
}
.ui-select-trigger:hover     { border-color: #9ca3af; }
.ui-select-trigger:focus-visible {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59,130,246,.15);
}
.ui-select-trigger.is-placeholder { color: #9ca3af; }
.ui-select-trigger.is-disabled    { opacity: 0.5; cursor: not-allowed; background: #f9fafb; }

/* ── Sizes ── */
.ui-select--sm      { height: 28px; padding: 0 8px;  font-size: 12px; gap: 4px; }
.ui-select--default { height: 36px; padding: 0 10px; font-size: 14px; gap: 6px; }
.ui-select--lg      { height: 44px; padding: 0 14px; font-size: 16px; gap: 8px; }

.ui-select-value {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ui-select-chevron {
  flex-shrink: 0;
  color: #6b7280;
  transition: transform 0.2s;
}
.ui-select-chevron.open { transform: rotate(180deg); }

/* ── Backdrop ── */
.ui-select-backdrop {
  position: fixed;
  inset: 0;
  z-index: 40;
}

/* ── Panel ── */
.ui-select-panel {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  z-index: 50;
  min-width: 100%;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  box-shadow: 0 4px 16px rgba(0,0,0,.10);
  padding: 4px;
  box-sizing: border-box;
}

.ui-select-panel.has-search {
  padding-top: 6px;
}

.ui-select-search-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 4px 0;
  padding: 6px 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: #fff;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.ui-select-search-row:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.ui-select-search-icon {
  flex-shrink: 0;
  color: #6b7280;
}

.ui-select-search-input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  font-family: inherit;
  color: #111;
}
.ui-select-search-input::placeholder {
  color: #9ca3af;
}

.ui-select-search-sep {
  height: 1px;
  background: #e5e7eb;
  margin: 6px 4px 4px;
}

.ui-select-empty {
  padding: 10px 12px;
  font-size: 14px;
  color: #6b7280;
  text-align: center;
}

/* ── Options ── */
.ui-select-option {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 10px;
  border: none;
  background: none;
  border-radius: 4px;
  font-size: inherit;
  font-family: inherit;
  color: #111;
  text-align: left;
  cursor: pointer;
  transition: background 0.1s;
  white-space: nowrap;
}
.ui-select-option:hover       { background: #f3f4f6; }
.ui-select-option.is-selected { color: #1d4ed8; font-weight: 500; }

.ui-select-check { color: #1d4ed8; flex-shrink: 0; }
.ui-select-option-indent { margin-left: 22px; }

/* ── Transition ── */
.ui-select-fade-enter-active { transition: opacity 0.12s ease, transform 0.12s ease; }
.ui-select-fade-leave-active { transition: opacity 0.08s ease, transform 0.08s ease; }
.ui-select-fade-enter-from   { opacity: 0; transform: translateY(-4px) scale(0.97); }
.ui-select-fade-leave-to     { opacity: 0; transform: translateY(-4px) scale(0.97); }
</style>
