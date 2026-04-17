<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  modelValue: { type: String, default: '' },
  /** 字符串列表，或 { value, label }[]（可接 API） */
  options: { type: Array, default: () => [] },
  placeholder: String,
  size: { type: String, default: 'lg' },
  disabled: Boolean,
})

const emit = defineEmits(['update:modelValue'])

const open = ref(false)
/** 仅用于下拉内过滤：展开时置空以显示全部候选，避免用整段已选 Campaign name 去子串匹配导致列表被滤没 */
const listQuery = ref('')

const normalizedOptions = computed(() =>
  props.options.map((o) =>
    typeof o === 'string' ? { value: o, label: o } : { value: o.value, label: o.label ?? String(o.value) }
  )
)

/** 下拉列表由 listQuery 过滤（展开时先清空，输入时再跟手收窄） */
const filteredOptions = computed(() => {
  const q = listQuery.value.trim().toLowerCase()
  if (!q) return normalizedOptions.value
  return normalizedOptions.value.filter(
    (o) =>
      String(o.label).toLowerCase().includes(q) || String(o.value).toLowerCase().includes(q)
  )
})

function openPanel() {
  if (props.disabled) return
  listQuery.value = ''
  open.value = true
}

function closePanel() {
  open.value = false
}

function onInput(e) {
  const v = e.target.value
  emit('update:modelValue', v)
  listQuery.value = v
}

function pick(value) {
  emit('update:modelValue', value)
  closePanel()
}

onBeforeUnmount(() => {
  open.value = false
})
</script>

<template>
  <div class="ui-combobox" :class="{ 'is-open': open, 'is-disabled': disabled }">
    <input
      class="ui-combobox__input ui-input"
      :class="`ui-input--${size}`"
      type="text"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      autocomplete="off"
      v-bind="$attrs"
      @input="onInput"
      @focus="openPanel"
      @keydown.escape="closePanel"
    />

    <div v-if="open" class="ui-combobox-backdrop" @mousedown.prevent="closePanel" />

    <Transition name="ui-combobox-fade">
      <div v-if="open" class="ui-combobox-panel" @mousedown.prevent>
        <div class="ui-combobox-list">
          <template v-if="filteredOptions.length">
            <button
              v-for="opt in filteredOptions"
              :key="opt.value"
              type="button"
              class="ui-combobox-option"
              :class="{ 'is-selected': opt.value === modelValue }"
              @mousedown.prevent="pick(opt.value)"
            >
              <span class="ui-combobox-option-label">{{ opt.label }}</span>
            </button>
          </template>
          <div v-else class="ui-combobox-empty">No results</div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.ui-combobox {
  position: relative;
  width: 100%;
}

.ui-input {
  display: block;
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 3px;
  background: #fff;
  color: #111;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  box-sizing: border-box;
  font-family: inherit;
}
.ui-input::placeholder {
  color: #9ca3af;
}
.ui-input:hover {
  border-color: #9ca3af;
}
.ui-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}
.is-disabled .ui-input {
  opacity: 0.5;
  cursor: not-allowed;
  background: #f9fafb;
}

.ui-input--sm {
  height: 28px;
  padding: 0 8px;
  font-size: 12px;
}
.ui-input--default {
  height: 36px;
  padding: 0 10px;
  font-size: 14px;
}
.ui-input--lg {
  height: 44px;
  padding: 0 14px;
  font-size: 16px;
}

.ui-combobox-backdrop {
  position: fixed;
  inset: 0;
  z-index: 40;
}

.ui-combobox-panel {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  z-index: 50;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  padding: 4px;
  box-sizing: border-box;
  max-height: min(360px, 70vh);
  display: flex;
  flex-direction: column;
}

.ui-combobox-list {
  overflow-y: auto;
  min-height: 0;
}

.ui-combobox-option {
  display: block;
  width: 100%;
  padding: 8px 10px;
  margin: 0;
  border: none;
  background: none;
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
  color: #111;
  text-align: left;
  cursor: pointer;
  transition: background 0.1s;
  white-space: normal;
  word-break: break-word;
}
.ui-combobox-option:hover {
  background: #f3f4f6;
}
.ui-combobox-option.is-selected {
  font-weight: 600;
  color: #111;
  background: #f3f4f6;
}

.ui-combobox-empty {
  padding: 10px 12px;
  font-size: 14px;
  color: #6b7280;
  text-align: center;
}

.ui-combobox-fade-enter-active {
  transition: opacity 0.12s ease, transform 0.12s ease;
}
.ui-combobox-fade-leave-active {
  transition: opacity 0.08s ease, transform 0.08s ease;
}
.ui-combobox-fade-enter-from {
  opacity: 0;
  transform: translateY(-4px) scale(0.97);
}
.ui-combobox-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.97);
}
</style>
