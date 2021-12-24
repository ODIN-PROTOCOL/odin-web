import { App, createApp } from 'vue'
import router from './router'
import {
  cropAddress,
  formatCoin,
  formatDate,
  preciseAsPercents,
  preciseAsFormatedCoin,
  getPrecisePercents,
  preciseFormatOdinCoin,
  preciseFormatCoin,
  getPercentOutOfNumber,
} from './helpers/formatters'
import Notifications from '@kyvg/vue3-notification'
import { api } from './api/api'
import { bigMath } from './helpers/bigMath'
import {
  translateBondStatus,
  translateProposalStatus,
  translateProposalStatusDated,
  translateRequestStatus,
  translateTally,
  translateTallyShort,
  translateVote,
} from './helpers/translators'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { VuePicker, VuePickerOption } from '@invisiburu/vue-picker'

async function _main() {
  try {
    await api.init()
  } catch (error) {
    _renderInitError('Initialization failed!')
    console.error(error)
    return null
  }

  // Session should be restored before first router guard executed
  const authModule = await import(
    /* webpackChunkName: "use-auth" */ './composables/useAuthorization'
  )
  await authModule.tryRestoreSession()

  const appModule = await import(
    /* webpackChunkName: "app-entry" */ './App.vue'
  )
  const app = createApp(appModule.default)
  app.config.performance = true
  app.config.globalProperties.$cropAddress = cropAddress
  app.config.globalProperties.$fCoin = formatCoin
  app.config.globalProperties.$preciseAsPercents = preciseAsPercents
  app.config.globalProperties.$preciseAsFormatedCoin = preciseAsFormatedCoin
  app.config.globalProperties.$fNum = bigMath.format
  app.config.globalProperties.$fDate = formatDate
  app.config.globalProperties.$tRequestStatus = translateRequestStatus
  app.config.globalProperties.$tProposalStatus = translateProposalStatus
  app.config.globalProperties.$tProposalStatusDated =
    translateProposalStatusDated
  app.config.globalProperties.$tTally = translateTally
  app.config.globalProperties.$tTallyShort = translateTallyShort
  app.config.globalProperties.$tVote = translateVote
  app.config.globalProperties.$tBondStatus = translateBondStatus
  app.config.globalProperties.$preciseFormatOdinCoin = preciseFormatOdinCoin
  app.config.globalProperties.$getPrecisePercents = getPrecisePercents
  app.config.globalProperties.$preciseFormatCoin = preciseFormatCoin
  app.config.globalProperties.$getPercentOutOfNumber = getPercentOutOfNumber
  app.use(router)
  app.use(Notifications)
  app.component('VuePicker', VuePicker)
  app.component('VuePickerOption', VuePickerOption)
  app.mount('#app')
  return app
}

function _renderInitError(msg: string) {
  const appNode = document.querySelector('#app')
  if (!appNode) return

  const cont = document.createElement('div')
  cont.classList.add('error-cont')

  const p = document.createElement('p')
  p.classList.add('error-msg')
  p.innerText = msg
  cont.appendChild(p)

  while (appNode.firstChild) {
    appNode.removeChild(appNode.firstChild)
  }
  appNode.appendChild(cont)
}

let app: App<Element>
_main().then((_app) => {
  if (_app) app = _app
})

export { app }
