<script setup>
import { inject } from 'vue'

const dialog = inject('dialog')
</script>
<template>
  <span @click="dialog && $emit('click', $event)" style="display:contents">
    <slot />
  </span>
</template>
