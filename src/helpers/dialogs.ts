import { Component, createApp } from 'vue'

export type DialogProps = Record<string, unknown>
export type DialogCallback<T> = (dialog: {
  payload?: T | null
  kill: DialogKillFunction<T>
}) => void
export type DialogKillFunction<T = null> = (result?: T | null) => void
export type DialogEventHandler<T = null> = (payload?: T | null) => void

let _dialogContainer: HTMLElement

export function initDialogs(container: HTMLElement): void {
  _dialogContainer = container
}

export function makeDialog<R = null>(
  modalComponent: Component,
  callbacks: Record<string, DialogCallback<R>> = {},
  { props }: { props?: DialogProps } = {}
): Promise<R | null> {
  if (!_dialogContainer) {
    throw new ReferenceError('Dialogs not initialized!')
  }

  return new Promise<R | null>((resolve) => {
    const dialog = createApp(modalComponent, props)

    const kill: DialogKillFunction<R> = (result?: R | null) => {
      resolve(result ?? null)
      dialog.unmount()
    }

    if (!callbacks.onClose) {
      callbacks.onClose = (d) => d.kill(null)
    }
    for (const [cbName, cb] of Object.entries(callbacks)) {
      const handler: DialogEventHandler<R> = (payload) => cb({ payload, kill })
      dialog.provide(cbName, handler)
    }

    dialog.mount(_dialogContainer)
  })
}
