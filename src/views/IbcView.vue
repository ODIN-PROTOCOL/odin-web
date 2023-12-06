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
              :chain-id-data="filteredChainIdData[index]"
            />
          </div>
          <!-- IMPORTANT:: Temporary remove pagination -->
          <template v-if="false && connectionsData?.length > ITEMS_PER_PAGE">
            <AppPagination
              class="mg-t32 mg-b32"
              v-model="currentPage"
              :pages="totalPages"
              @update:modelValue="paginationHandler"
            />
          </template>
          <!-- IMPORTANT:: Temporary remove pagination -->
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
const filteredChainIdData = ref<ClientState[]>([])
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
  /**
   * IMPORTANT:: This is temporary fix. This should fix from the API
   */

  // Find connection with id 'connection-9'
  let desiredConnectionId = 'connection-9'

  // Filter connections by id
  let filteredConnection = connectionsData.value.filter(
    item => item.id === desiredConnectionId,
  )

  // Find index of the connection with id 'connection-9'
  let connectionIndex = connectionsData.value.findIndex(
    item => item.id === desiredConnectionId,
  )

  // Extract chain data for the connection at the found index
  let chainDataForConnection = chainIdData.value.filter(
    (_, idx) => idx === connectionIndex,
  )

  if (newPage === 1) {
    filteredConnections.value = filteredConnection?.slice(
      0,
      newPage * ITEMS_PER_PAGE,
    )
    filteredChainIdData.value = chainDataForConnection?.slice(
      0,
      newPage * ITEMS_PER_PAGE,
    )
  } else {
    filteredConnections.value = filteredConnection?.slice(
      (newPage - 1) * ITEMS_PER_PAGE,
      (newPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE,
    )
    filteredChainIdData.value = chainDataForConnection?.slice(
      (newPage - 1) * ITEMS_PER_PAGE,
      (newPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE,
    )
  }
  currentPage.value = newPage

  /**
   * IMPORTANT:: This is temporary fix. This should fix from the API
   */
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
