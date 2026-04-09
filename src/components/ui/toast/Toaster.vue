<script setup>
import { useToast } from './useToast'
import Toast from './Toast.vue'

const { toasts, dismiss } = useToast()
</script>

<template>
  <Toast :toasts="toasts" @dismiss="dismiss" />
</template>
