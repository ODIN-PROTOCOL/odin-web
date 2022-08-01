import { DialogHandler, DialogProps, dialogs } from '@/helpers/dialogs'
import { Component } from 'vue'

interface IShowDialogHandler {
  (
    component: Component,
    callbacks?: { onSubmit?: DialogHandler; onClose?: DialogHandler },
    props?: DialogProps,
  ): Promise<unknown | null>
}

export const showDialogHandler: IShowDialogHandler = function (
  component: Component,
  callbacks?: {
    onSubmit?: DialogHandler
    onClose?: DialogHandler
  },
  props?: DialogProps,
): Promise<unknown | null> {
  return dialogs.show(component, callbacks, { ...(props ? { props } : {}) })
}
