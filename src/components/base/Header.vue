<template>
  <header
    class="flex justify-between items-center w-full py-5 pl-8 pr-12 border-b border-gray-500 sticky top-0 h-16"
  >
    <!-- logo -->
    <div class="flex gap-6 items-center">
      <Icon icon="ri:chat-private-fill" width="32" height="32" class="text-primary-color" />
      <span class="font-nunito font-extrabold text-gray-500">/</span>
      <h1 class="font-nunito font-extrabold text-[1rem] text-text-white">NeiReports</h1>
    </div>
    <!-- options -->
    <div class="flex gap-6 text-gray-500 items-center">
      <Icon icon="ri:logout-box-line" width="24" height="24" @click="handleLogout" />
      <Icon icon="ri:notification-3-fill" width="24" height="24" />
      <Icon icon="ri:account-circle-line" width="32" height="32" />
    </div>
  </header>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useAuthStore } from '../../stores/authStore'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const handleLogout = async () => {
  await auth.logout()
  router.push('/login')
}
</script>

<style scoped></style>
