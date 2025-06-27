<template>
  <aside
    class="flex flex-col h-[calc(100vh-4rem)] py-9 items-center justify-top sticky top-16 w-24 border-r border-gray-500"
  >
    <nav class="flex flex-col gap-3">
      <!-- dashboard -->
      <router-link
        :to="{ name: 'DashboardChild' }"
        class="aside-btn__inactive"
        exact-active-class="bg-primary-color/20"
      >
        <Icon icon="ri:dashboard-fill" width="24" height="24" />
      </router-link>
      <!-- employees -->
      <router-link
        :to="{ name: 'Funcionarios' }"
        class="aside-btn__inactive"
        exact-active-class="bg-primary-color/20"
      >
        <Icon icon="ri:group-line" width="24" height="24" />
      </router-link>
      <!-- import -->
      <router-link
        :to="{ name: 'ImportFiles' }"
        class="aside-btn__inactive"
        exact-active-class="bg-primary-color/20"
      >
        <Icon icon="ri:download-2-fill" width="24" height="24" />
      </router-link>
      <!-- expenses -->
      <router-link
        :to="{ name: 'Expenses' }"
        class="aside-btn__inactive"
        exact-active-class="bg-primary-color/20"
      >
        <Icon icon="ri:newspaper-line" width="24" height="24" />
      </router-link>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<style scoped></style>
