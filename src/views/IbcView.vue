<template>
  <div class="view-main ibc">
    <div class="view-main__title-wrapper">
      <h2 class="view-main__title">IBCs</h2>
    </div>
    <template v-if="connectionsData?.length">
      <div
        class="app-table ibc__table"
        v-for="(connection, index) in filteredConnections"
        :key="connection?.id"
      >
        <div class="app-table__body ibc__body">
          <div class="app-table__row ibc__table-row">
            <div class="app-table__cell">
              <span class="app-table__title ibc__table-title">Connection</span>
              <span class="app-table__cell-txt">{{ connection.id }}</span>
            </div>
            <div class="app-table__cell">
              <span class="app-table__title ibc__table-title"
                >Counterparty Chain ID</span
              >
              <span class="app-table__cell-txt">{{
                chainIdData[index].chainId || '-'
              }}</span>
            </div>
            <div class="app-table__cell">
              <span class="app-table__title ibc__table-title">Client ID</span>
              <span class="app-table__cell-txt">
                {{ connection.clientId || '-' }}
              </span>
            </div>
            <div class="app-table__cell">
              <span class="app-table__title ibc__table-title"
                >Counterparty Client ID</span
              >
              <span class="app-table__cell-txt">
                {{ connection.counterparty.clientId || '-' }}
              </span>
            </div>
          </div>
          <div class="ibc__show">
            <button
              @click="isShow[index] = !isShow[index]"
              type="button"
              class="ibc__show-button"
            >
              {{ isShow[index] ? 'Hidden channels' : 'Show channels' }}
              <ArrowIcon
                class="ibc__arrow-icon"
                :class="{
                  ['ibc__arrow-icon_active']: isShow[index],
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
        <p v-if="isLoading">Loading…</p>
        <p v-else>No items yet</p>
      </div>
    </template>
    <template v-if="connectionsData?.length > ITEMS_PER_PAGE">
      <Pagination
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
import { handleError } from '@/helpers/errors'
import { IdentifiedChannel } from 'cosmjs-types/ibc/core/channel/v1/channel'
import { IdentifiedConnection } from 'cosmjs-types/ibc/core/connection/v1/connection'
import Pagination from '@/components/Pagination/Pagination.vue'
import ChannelDetail from '@/components/ChannelDetail.vue'
import ArrowIcon from '@/components/icons/ArrowIcon.vue'
import { ClientState } from 'cosmjs-types/ibc/lightclients/tendermint/v1/tendermint'
import { QueryClientStateResponse } from 'cosmjs-types/ibc/core/client/v1/query'

export default defineComponent({
  components: {
    Pagination,
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
        handleError(error as Error)
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
.app-table__cell {
  flex-direction: column;
}
.ibc {
  &__table {
    border: 0.1rem solid var(--clr__action);
    border-radius: 0.8rem;
    padding: 3rem 2rem;
    margin-bottom: 2.4rem;
  }
  &__table-title {
    display: block;
    margin-bottom: 0.8rem;
    font-weight: 300;
    min-width: 13rem;
  }
  &__body {
    display: grid;
    align-items: center;
    grid:
      auto /
      minmax(2rem, 0.85fr)
      minmax(6rem, 0.15fr);
  }
  &__table-row {
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
  &__show {
    text-align: center;
    white-space: nowrap;
  }
  &__show-button {
    color: var(--clr__btn-normal);
    text-align: center;
  }
  &__arrow-icon {
    fill: var(--clr__btn-normal);
    transform: translate(0.3rem, 0) rotate(270deg);
    &_active {
      transform: translate(-1rem, 1.5rem) rotate(90deg);
      fill: var(--clr__action);
    }
  }
}
@include respond-to(medium) {
  .ibc {
    &__body {
      grid:
        auto /
        minmax(2rem, 0.75fr)
        minmax(6rem, 0.25fr);
    }
  }
}
@include respond-to(tablet) {
  .app-table__cell {
    flex-direction: row;
  }
  .ibc {
    padding-bottom: 10rem;
    &__body {
      display: block;
    }
    &__table-row {
      grid: none;
    }
  }
}
</style>
