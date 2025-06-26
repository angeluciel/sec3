<template>
  <div class="flex h-dvh w-dvw md:gap-24 lg:gap-32 justify-end items-center p-4 bg-login-bg">
    <section class="flex flex-col gap-20 w-full md:w-fit max-w-[660px] h-full py-24">
      <!-- l o g o -->
      <div class="flex gap-3">
        <Icon icon="ri:chat-private-fill" width="24" height="24" class="text-primary-color" />
        <h1 class="text-[1rem] font-nunito font-extrabold text-text-white">NeiReports</h1>
      </div>
      <!-- t i t l e -->
      <div class="flex flex-col gap-2">
        <h1
          class="font-nunito font-extrabold text-[2rem] md:text-[2.5rem] xl:text-[3rem] text-text-white w-fit"
        >
          Envie relatórios com<br />Privacidade
        </h1>
        <p class="font-nunito font-extrabold text-[1rem] text-gray-600 w-fit">
          Mas antes, vamos entrar na sua conta
        </p>
      </div>
      <!-- forms -->
      <form class="flex flex-col gap-3" @submit.prevent="handleLogin">
        <login-input label="email" type="email" class="relative z-5" v-model="email" />
        <login-input label="password" type="password" class="relative z-4" v-model="password" />
        <div class="flex flex-col gap-20 justify-start items-start">
          <span class="font-nunito font-semibold text-[1rem] text-gray-500">Esqueceu a senha?</span>
          <fieldset class="flex gap-6 w-full">
            <button
              type="submit"
              class="login-btn__base text-login-bg bg-primary-color hover:bg-blue-400 hover:translate-y-1 transition-all duration-300 active:text-white active:bg-blue-800 active:translate-y-0"
              :disabled="loading"
            >
              {{ loading ? 'Entrando...' : 'Entrar' }}
            </button>
            <button
              class="login-btn__base border-2 border-primary-color text-primary-color hover:text-blue-400 hover:border-blue-400 hover:bg-blue-300/20 hover:translate-y-1 transition-all duration-300"
            >
              Criar conta
            </button>
          </fieldset>
        </div>
      </form>
    </section>
    <!-- I M A G E -->
    <section class="hidden md:flex w-3/5 max-w-[660px] h-full relative justify-end">
      <div class="flex h-full w-full bg-[#353638] items-center rounded-3xl">
        <img src="/images/loginIMG.svg" alt="Login" class="w-full object-cover" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { login } from '../services/authService'
import { useAuthStore } from '../stores/authStore'
import { useToast } from 'primevue'

const email = ref('')
const password = ref('')
const loading = ref(false)

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const toast = useToast()

async function handleLogin() {
  loading.value = true
  try {
    const session = await login(email.value, password.value)

    auth.setSession(session)
    const redirect = route.query.redirect
    if (typeof redirect === 'string') {
      router.push(redirect)
    } else {
      router.push({ name: 'Dashboard' })
    }
    toast.add({
      severity: 'success',
      summary: 'Bem vindo!',
      detail: `Olá, ${session.user.name}! É bom tê-lo de volta!`,
      life: 3000,
    })
  } catch (err: any) {
    toast.add({ severity: 'error', summary: 'Falha no login.', detail: err.message, life: 3000 })
  } finally {
    loading.value = false
  }
}
</script>
