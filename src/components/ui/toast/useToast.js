import { ref } from 'vue'

const toasts = ref([])
let counter = 0

export function useToast() {
  function toast({ title, description, variant = 'default', duration = 4000 }) {
    const id = ++counter
    toasts.value.push({ id, title, description, variant })

    if (duration > 0) {
      setTimeout(() => dismiss(id), duration)
    }
    return id
  }

  function dismiss(id) {
    const idx = toasts.value.findIndex((t) => t.id === id)
    if (idx !== -1) toasts.value.splice(idx, 1)
  }

  return { toast, dismiss, toasts }
}
