<template>
  <div class="flex flex-col w-full">
    <Breadcrumb :model="items">
      <template #item="{ item, props }">
        <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route">
          <a :href="href" v-bind="props.action" @click="navigate">
            <span class="text-white font-semibold">{{ item.label }}</span>
          </a>
        </router-link>
        <a v-else :href="item.url" :target="item.target" v-bind="props.action">
          <span class="text-gray-500">{{ item.label }}</span>
        </a>
      </template>
      <template #separator>/</template>
    </Breadcrumb>
    <div class="flex flex-col items-start justify-start px-8">
      <!--envios recentes-->
      <div class="flex flex-col justify-start items-start py-5 gap-8 w-full">
        <div class="flex flex-col gap-8 justify-start items-start">
          <!--title-->
          <div class="flex gap-6 items-center">
            <!--envios-->
            <button class="flex gap-3 p-3 items-center bg-primary-color/50 rounded-xl">
              <span class="font-nunito text-2xl text-text-white">Envios Recentes</span>
              <Icon icon="ri:send-plane-fill" width="24" height="24" class="text-primary-color" />
            </button>
          </div>
          <!--more-->
        </div>
        <!--cards container with horizontal scroll only-->
        <div class="w-full overflow-x-auto">
          <div class="flex gap-11 pb-4" style="width: max-content">
            <dashCard />
            <dashCard />
            <dashCard />
            <dashCard />
            <dashCard />
            <dashCard />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import dashCard from '@/components/cards/dashCard.vue'

const items = ref([{ label: 'Dashboard' }])
</script>
