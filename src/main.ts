import { createApp } from 'vue'
import router from './router'
import { abbreviateNumber, cropAddress, formatCoin } from './helpers/formatters'
import Notifications from '@kyvg/vue3-notification'
import { api } from './api/api'

async function main() {
  await api.init()

  // Session should be restored before first router guard executed
  const authModule = await import(
    /* webpackChunkName: "use-auth" */ './composables/useAuthorization'
  )
  await authModule.tryRestoreSession()

  const appModule = await import(
    /* webpackChunkName: "app-entry" */ './App.vue'
  )
  const app = createApp(appModule.default)
  app.config.globalProperties.$cropAddress = cropAddress
  app.config.globalProperties.$abbreviateNumber = abbreviateNumber
  app.config.globalProperties.$formatCoin = formatCoin
  app.use(router)
  app.use(Notifications)
  app.mount('#app')
}

main()
