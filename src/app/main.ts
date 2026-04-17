import { createApp } from 'vue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { createPinia } from 'pinia'
import App from './App.vue'
import { router } from './router'
import { i18n } from './i18n'
import './styles/variables.css'
import './styles/reset.css'

createApp(App)
  .use(VueQueryPlugin)
  .use(createPinia())
  .use(router)
  .use(i18n)
  .mount('#app')
