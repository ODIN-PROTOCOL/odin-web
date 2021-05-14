import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { tryRestoreSession } from './composables/useAuthorization'
import { cropAddress } from './helpers/strings'
import Notifications from '@kyvg/vue3-notification'
import { api } from './api/api'

async function main() {
  await Promise.all([api.init(), tryRestoreSession()])

  const app = createApp(App)
  app.config.globalProperties.$cropAddress = cropAddress
  app.use(router)
  app.use(Notifications)
  app.mount('#app')
}

main()
