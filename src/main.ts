import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import login__input from './components/login/login__input.vue'

const app = createApp(App)

app.component('login-input', login__input)
app.use(createPinia())
app.use(router)

app.mount('#app')
