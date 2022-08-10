import { app } from '@/main'
import { App, Component, createApp, inject } from 'vue'

export type DialogProps = Record<string, unknown>
export type DialogHandler = (dialog: {
  payload?: unknown | null
  kill: DialogKiller
}) => void
export type DialogHandlers = Record<string, DialogHandler | undefined>
export type DialogKiller = (result?: unknown | null) => void
export type DialogPayloadHandler = (payload?: unknown | null) => void

class Dialogs {
  private _dialogContainer: HTMLElement | null = null

  init(container: HTMLElement) {
    this._dialogContainer = container
  }

  show(
    component: Component,
    handlers: DialogHandlers = {},
    { props }: { props?: DialogProps } = {},
  ): Promise<unknown | null> {
    if (!this._dialogContainer) {
      throw new ReferenceError('Dialogs not initialized!')
    }

    return new Promise<unknown | null>(resolve => {
      const dialog = createApp(component, props)
      dialog.config.globalProperties = {
        ...dialog.config.globalProperties,
        ...app.config.globalProperties,
      }
      this._provideHandlers(
        dialog,
        this._addDefaultHandlers(handlers),
        this._makeKiller(resolve, dialog),
      )
      dialog.mount(this._dialogContainer as HTMLElement)
    })
  }

  getHandler(name: string): DialogPayloadHandler {
    return inject(
      name,
      () =>
        inject('onClose', () =>
          console.warn(`Missing ${name} and no onClose handler`),
        ),
      true,
    )
  }

  private _makeKiller(
    resolve: (value: unknown) => void,
    dialog: App<Element>,
  ): DialogKiller {
    return (result?: unknown | null) => {
      resolve(result ?? null)
      dialog.unmount()
    }
  }

  private _addDefaultHandlers(callbacks: DialogHandlers) {
    const newCbs = { ...callbacks }
    if (!newCbs.onClose) {
      newCbs.onClose = d => d.kill(null)
    }
    return newCbs
  }

  private _provideHandlers(
    dialog: App<Element>,
    handlers: DialogHandlers,
    kill: DialogKiller,
  ) {
    for (const [cbName, cb] of Object.entries(handlers)) {
      if (!cbName || !cb) continue
      const handler: DialogPayloadHandler = payload => cb({ payload, kill })
      dialog.provide(cbName, handler)
    }
  }
}

export const dialogs = new Dialogs()
