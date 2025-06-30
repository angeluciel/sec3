<template>
  <div class="flex flex-col h-screen overflow-hidden bg-main-bg">
    <HeaderApp />
    <div class="flex overflow-hidden">
      <AsideApp />
      <main class="flex overflow-y-auto w-full">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import HeaderApp from '../components/base/Header.vue'
import AsideApp from '../components/base/AsideApp.vue'
</script>
