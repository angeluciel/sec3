<template>
  <dashLayout>
    <router-view></router-view>
  </dashLayout>
</template>

<script setup lang="ts">
import dashLayout from '../layouts/layDashboard.vue'
import { ref } from 'vue'

const items = ref([
  { label: 'Dashboard' },
  /* { label: 'Funcionarios', route: { name: 'Funcionarios' } }, */
])
</script>

<style scoped></style>
