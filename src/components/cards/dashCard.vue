<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

const cardDate = ref('19/05/2025')
const cardTime = ref('00:00:00')
const cardTitle = ref('Relatorio X')
const cardSharedBy = ref('Claudinei')
</script>

<template>
  <div
    class="flex flex-col justify-between rounded-2xl bg-login-bg border-2 border-gray-border items-start h-56 p-3"
  >
    <!-- top -->
    <div class="flex flex-col items-start w-full">
      <!--title + pic-->
      <div class="flex flex-col w-full items-start">
        <div class="flex items-center justify-between w-full">
          <Icon icon="ri:account-circle-fill" width="40" height="40" class="text-gray-border" />
          <Icon icon="ri:more-fill" width="24" height="24" class="text-text-white" />
        </div>
        <h2 class="font-nunito font-extrabold text-2xl text-primary-color">{{ cardTitle }}</h2>
      </div>
      <span class="font-nunito text-[1rem] text-text-white font-semibold"
        >{{ cardDate }} {{ cardTime }}</span
      >
    </div>
    <!-- bottom -->
    <div class="flex items-center gap-20">
      <!-- button -->
      <button
        class="p-2 rounded-lg bg-primary-color font-nunito text-xl font-semibold text-login-bg transition-all duration-200 shadow-md hover:shadow-primary-color/20 hover:scale-105 focus:shadow-primary-color/70 active:scale-95"
      >
        Detalhes
      </button>
      <div class="flex flex-col items-end">
        <span class="font-nunito text-[1rem] text-text-white/25 text-end">compartilhado por</span>
        <h3 class="font-nunito font-semibold text-xl text-text-white">{{ cardSharedBy }}</h3>
      </div>
    </div>
  </div>
</template>
