<template>
  <div>
    <Header />
    <main class="flex">
      <AsideApp />
      <div class="flex flex-col items-center justify-center h-screen">
        <h1 class="text-3xl font-bold mb-4">Dashboard</h1>
        <p>Bem-vindo ao seu painel de controle!</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import Header from '../components/base/Header.vue'
import AsideApp from '../components/base/AsideApp.vue'
</script>

<style scoped></style>
