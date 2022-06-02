<template>
  <div
    class="view-main ibc-view load-fog"
    :class="{
      'load-fog_show': isLoading,
    }"
  >
    <div class="view-main__title-wrapper">
      <h2 class="view-main__title">IBCs</h2>
    </div>
    <template v-if="connectionsData?.length">
      <div
        class="app-table ibc-view__table"
        v-for="(connection, index) in filteredConnections"
        :key="connection?.id"
      >
        <div class="app-table__body ibc-view__body">
          <div class="app-table__row ibc-view__table-row">
            <div class="app-table__cell ibc-view__table-cell">
              <span class="app-table__title ibc-view__table-title"
                >Connection</span
              >
              <span class="app-table__cell-txt">{{ connection.id }}</span>
            </div>
            <div class="app-table__cell ibc-view__table-cell">
              <span class="app-table__title ibc-view__table-title"
                >Counterparty Chain ID</span
              >
              <span class="app-table__cell-txt">{{
                chainIdData[index].chainId || '-'
              }}</span>
            </div>
            <div class="app-table__cell ibc-view__table-cell">
              <span class="app-table__title ibc-view__table-title"
                >Client ID</span
              >
              <span class="app-table__cell-txt">
                {{ connection.clientId || '-' }}
              </span>
            </div>
            <div class="app-table__cell ibc-view__table-cell">
              <span class="app-table__title ibc-view__table-title"
                >Counterparty Client ID</span
              >
              <span class="app-table__cell-txt">
                {{ connection.counterparty.clientId || '-' }}
              </span>
            </div>
          </div>
          <div class="ibc-view__show">
            <button
              @click="isShow[index] = !isShow[index]"
              type="button"
              class="ibc-view__show-button"
            >
              {{ isShow[index] ? 'Hidden channels' : 'Show channels' }}
              <ArrowIcon
                class="ibc-view__arrow-icon"
                :class="{
                  ['ibc-view__arrow-icon--active']: isShow[index],
                }"
              />
            </button>
          </div>
        </div>
        <ChannelDetail
          v-if="isShow[index]"
          :channelData="channelData"
          :connection="connection"
        />
      </div>
    </template>

    <template v-else>
      <div class="app-table__empty-stub">
        <p v-if="isLoading" class="empty mg-t32">Loading…</p>
        <p v-else class="empty mg-t32">No items yet</p>
      </div>
    </template>
    <template v-if="connectionsData?.length > ITEMS_PER_PAGE">
      <AppPagination
        class="mg-t32 mg-b32"
        v-model="currentPage"
        :pages="totalPages"
        @update:modelValue="paginationHandler"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { callers } from '@/api/callers'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import { IdentifiedChannel } from 'cosmjs-types/ibc/core/channel/v1/channel'
import { IdentifiedConnection } from 'cosmjs-types/ibc/core/connection/v1/connection'
import AppPagination from '@/components/AppPagination/AppPagination.vue'
import ChannelDetail from '@/components/ChannelDetail.vue'
import ArrowIcon from '@/components/icons/ArrowIcon.vue'
import { ClientState } from 'cosmjs-types/ibc/lightclients/tendermint/v1/tendermint'
import { QueryClientStateResponse } from 'cosmjs-types/ibc/core/client/v1/query'

export default defineComponent({
  components: {
    AppPagination,
    ArrowIcon,
    ChannelDetail,
  },
  setup: function () {
    const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
    const ITEMS_PER_PAGE = 4
    const currentPage = ref(1)
    const totalPages = ref()
    const chainIdData = ref()
    const connectionsData = ref<IdentifiedConnection[] | undefined>()
    const channelData = ref<IdentifiedChannel[] | undefined>()
    const filteredConnections = ref()
    const isShow = ref([])

    const loadIbc = async () => {
      lockLoading()
      try {
        const { connections } = await callers.getConnections()
        const clientState: QueryClientStateResponse[] = await Promise.all(
          connections?.map((item: IdentifiedConnection) =>
            callers.getClientState(item.clientId)
          )
        )
        chainIdData.value = clientState?.map((item: QueryClientStateResponse) =>
          ClientState.decode(item.clientState?.value as Uint8Array)
        )
        const { channels } = await callers.getChannel()
        channelData.value = channels
        connectionsData.value = connections
        totalPages.value = Math.ceil(connections.length / ITEMS_PER_PAGE)
        filterConnections(currentPage.value)
      } catch (error) {
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
          (newPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
        )
      }
      currentPage.value = newPage
      isShow.value = []
    }

    const paginationHandler = (num: number) => {
      filterConnections(num)
    }

    onMounted(async () => {
      await loadIbc()
    })

    return {
      isLoading,
      ITEMS_PER_PAGE,
      currentPage,
      totalPages,
      paginationHandler,
      connectionsData,
      channelData,
      chainIdData,
      filteredConnections,
      isShow,
    }
  },
})
</script>

<style lang="scss">
.ibc-view__table {
  border: 0.1rem solid var(--clr__action);
  border-radius: 0.8rem;
  padding: 3rem 2rem;
  margin-bottom: 2.4rem;
}
.ibc-view__table-cell {
  flex-direction: column;
}
.ibc-view__table-title {
  display: block;
  margin-bottom: 0.8rem;
  font-weight: 300;
  min-width: 13rem;
}
.ibc-view__body {
  display: grid;
  align-items: center;
  grid:
    auto /
    minmax(2rem, 0.85fr)
    minmax(6rem, 0.15fr);
}
.ibc-view__table-row {
  grid:
    auto /
    minmax(2rem, 1fr)
    minmax(2rem, 1fr)
    minmax(2rem, 1fr)
    minmax(2rem, 1fr);
  margin-bottom: 1rem;
  padding: 1rem 0 0;
  border-bottom: none;
}
.ibc-view__show {
  text-align: center;
  white-space: nowrap;
}
.ibc-view__show-button {
  color: var(--clr__btn-normal);
  text-align: center;
}
.ibc-view__arrow-icon {
  fill: var(--clr__btn-normal);
  transform: translate(0.3rem, 0) rotate(270deg);
}
.ibc-view__arrow-icon--active {
  transform: translate(-1rem, 1.5rem) rotate(90deg);
  fill: var(--clr__action);
}

@include respond-to(medium) {
  .ibc-view__body {
    grid:
      auto /
      minmax(2rem, 0.75fr)
      minmax(6rem, 0.25fr);
  }
}
@include respond-to(tablet) {
  .ibc-view {
    padding-bottom: 10rem;
  }
  .ibc-view__body {
    display: block;
  }
  .ibc-view__table-cell {
    flex-direction: row;
  }
  .ibc-view__table-row {
    grid: none;
  }
}
</style>
