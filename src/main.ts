import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// componentes
import login__input from './components/login/login__input.vue'

// bibliotecas
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import { Breadcrumb } from 'primevue'

const app = createApp(App)

app.component('login-input', login__input)
app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
})
app.use(ToastService)

app.component('Toast', Toast)
app.component('Breadcrumb', Breadcrumb)

app.mount('#app')
