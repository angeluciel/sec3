<template>
  <dashLayout>
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
      <div class="flex flex-col items-center justify-center h-screen">
        <h1 class="text-3xl font-bold mb-4">Funcionarios</h1>
      </div>
    </div>
  </dashLayout>
</template>

<script setup lang="ts">
import dashLayout from '../../layouts/layDashboard.vue'
import { ref } from 'vue'

const items = ref([{ label: 'Funcionários' }])
</script>
