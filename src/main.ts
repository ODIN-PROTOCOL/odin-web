import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { tryRestoreSession } from './composables/useAuthorization'
import { cropAddress } from './helpers/strings'

async function main() {
  await tryRestoreSession()

  const app = createApp(App)
  app.config.globalProperties.$cropAddress = cropAddress
  app.use(router)
  app.mount('#app')
}

main()
