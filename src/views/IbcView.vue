<template>
  <div class="app__main-view ibc-view">
    <div class="app__main-view-table-header">
      <h3 class="app__main-view-table-header-info-title">IBCs</h3>
    </div>
    <template v-if="!isLoading">
      <template v-if="isLoadingError">
        <div class="app-table__empty-stub">
          <ui-loading-error-message message="Not Found" title="404" />
        </div>
      </template>
      <template v-else>
        <template v-if="connectionsData?.length">
          <div
            class="app-table ibc-view__table"
            v-for="(connection, index) in filteredConnections"
            :key="connection?.id"
          >
            <ibc-line
              :connection="connection"
              :channel-data="channelData"
              :chain-id-data="chainIdData[index]"
            />
          </div>
          <template v-if="connectionsData?.length > ITEMS_PER_PAGE">
            <AppPagination
              class="mg-t32 mg-b32"
              v-model="currentPage"
              :pages="totalPages"
              @update:modelValue="paginationHandler"
            />
          </template>
        </template>
        <template v-else>
          <div class="app-table__empty-stub">
            <ui-no-data-message />
          </div>
        </template>
      </template>
    </template>

    <template v-else>
      <div class="app-table__empty-stub">
        <ui-loader positionCenter message="Loading" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { callers } from '@/api/callers'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import { IdentifiedChannel } from 'cosmjs-types/ibc/core/channel/v1/channel'
import { IdentifiedConnection } from 'cosmjs-types/ibc/core/connection/v1/connection'
import { ClientState } from 'cosmjs-types/ibc/lightclients/tendermint/v1/tendermint'
import { QueryClientStateResponse } from 'cosmjs-types/ibc/core/client/v1/query'
import {
  UiLoadingErrorMessage,
  UiLoader,
  UiNoDataMessage,
} from '@/components/ui'
import AppPagination from '@/components/AppPagination/AppPagination.vue'
import IbcLine from '@/components/IbcLine.vue'

const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
const ITEMS_PER_PAGE = 4
const currentPage = ref(1)
const totalPages = ref(0)
const chainIdData = ref<ClientState[]>([])
const connectionsData = ref<IdentifiedConnection[]>([])
const channelData = ref<IdentifiedChannel[]>([])
const filteredConnections = ref<IdentifiedConnection[]>([])
const isLoadingError = ref(false)

const loadIbc = async () => {
  lockLoading()
  try {
    const { connections } = await callers.getConnections()
    const clientState: QueryClientStateResponse[] = await Promise.all(
      connections?.map((item: IdentifiedConnection) =>
        callers.getClientState(item.clientId),
      ),
    )
    chainIdData.value = clientState?.map((item: QueryClientStateResponse) =>
      ClientState.decode(item.clientState?.value as Uint8Array),
    )
    const { channels } = await callers.getChannel()
    channelData.value = channels
    connectionsData.value = connections
    totalPages.value = Math.ceil(connections.length / ITEMS_PER_PAGE)
    filterConnections(currentPage.value)
  } catch (error) {
    isLoadingError.value = true
    handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
  }
  releaseLoading()
}

const filterConnections = (newPage: number) => {
  let tempArr = connectionsData.value
  if (newPage === 1) {
    filteredConnections.value = tempArr?.slice(0, newPage * ITEMS_PER_PAGE)
  } else {
    filteredConnections.value = tempArr?.slice(
      (newPage - 1) * ITEMS_PER_PAGE,
      (newPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE,
    )
  }
  currentPage.value = newPage
}

const paginationHandler = (num: number) => {
  filterConnections(num)
}

onMounted(async () => {
  await loadIbc()
})
</script>

<style lang="scss" scoped>
.ibc-view__table {
  margin-bottom: 2.4rem;
  border-radius: 0.8rem;
}

@include respond-to(tablet) {
  .ibc-view {
    padding-bottom: 10rem;
  }
}
</style>
