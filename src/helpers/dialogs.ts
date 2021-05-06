import { Component, createApp } from 'vue'

export type DialogProps = Record<string, unknown>
export type DialogCallback = (dialog: {
  payload?: unknown | null
  kill: DialogKillFunction
}) => void
export type DialogKillFunction = (result?: unknown | null) => void
export type DialogEventHandler = (payload?: unknown | null) => void

let _dialogContainer: HTMLElement

export function initDialogs(container: HTMLElement): void {
  _dialogContainer = container
}

export function makeDialog(
  modalComponent: Component,
  callbacks: Record<string, DialogCallback | undefined> = {},
  { props }: { props?: DialogProps } = {}
): Promise<unknown | null> {
  if (!_dialogContainer) {
    throw new ReferenceError('Dialogs not initialized!')
  }

  return new Promise<unknown | null>((resolve) => {
    const dialog = createApp(modalComponent, props)

    const kill: DialogKillFunction = (result?: unknown | null) => {
      resolve(result ?? null)
      dialog.unmount()
    }

    if (!callbacks.onClose) {
      callbacks.onClose = (d) => d.kill(null)
    }
    for (const [cbName, cb] of Object.entries(callbacks)) {
      if (!cbName || !cb) continue
      const handler: DialogEventHandler = (payload) => cb({ payload, kill })
      dialog.provide(cbName, handler)
    }

    dialog.mount(_dialogContainer)
  })
}
