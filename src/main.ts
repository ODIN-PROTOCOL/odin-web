import { createApp } from 'vue'
import App from './App.vue'
import { tryRestoreSession } from './composables/useAuthorization'
import router from './router'

async function main() {
  await tryRestoreSession()

  createApp(App).use(router).mount('#app')
}

main()
