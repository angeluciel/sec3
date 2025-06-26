<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useToast } from 'primevue'
const toast = useToast()
</script>

<template>
  <Toast />
  <RouterView />
</template>

<style scoped></style>
