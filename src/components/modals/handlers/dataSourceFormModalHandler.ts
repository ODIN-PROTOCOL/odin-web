import { DialogHandler, dialogs } from '@/helpers/dialogs'

import DataSourceFormModal from '@/components/modals/DataSourceFormModal.vue'

export function showDataSourceFormModal(
  callbacks: {
    onSubmit?: DialogHandler
    onClose?: DialogHandler
  },
  props?: { dataSourceId?: string }
): Promise<unknown | null> {
  return dialogs.show(DataSourceFormModal, callbacks, { props })
}
