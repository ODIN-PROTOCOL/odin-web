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
        <div class="app-table__head ibc__table-head">
          <span>Connection</span>
          <span>Counterparty Chain ID</span>
          <span>Client ID</span>
          <span>Counterparty Client ID</span>
        </div>
        <div class="app-table__body">
          <div
            class="app-table__row ibc__table-row"
            :class="{ 'ibc__table-row-active': connection.show }"
          >
            <div class="app-table__cell">
              <span class="app-table__title">Connection</span>
              <span>{{ connection.id }}</span>
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Counterparty Chain ID</span>
              <span>{{ chainIdData[index].chainId || '-' }}</span>
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Client ID</span>
              <span> {{ connection.clientId || '-' }} </span>
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Counterparty Client ID</span>
              <span> {{ connection.counterparty.clientId || '-' }} </span>
            </div>
            <div class="app-table__cell ibc__details">
              <button
                @click="connection.show = !connection.show"
                class="ibc__button"
              >
                {{ connection.show ? 'Hidden channels' : 'Show channels' }}
                <ArrowIcon
                  :class="{
                    'nav__dropdown-wrapper-arrow_active': connection.show,
                  }"
                />
              </button>
            </div>
          </div>
        </div>
        <ChannelDetail
          v-if="connection.show"
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
    <template v-if="connectionsCount > ITEMS_PER_PAGE">
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
    const connectionsCount = ref(0)
    const chainIdData = ref()
    const connectionsData = ref<IdentifiedConnection[] | undefined>()
    const channelData = ref<IdentifiedChannel[] | undefined>()
    const filteredConnections = ref()

    const loadDataSources = async () => {
      lockLoading()
      try {
        const { connections } = await callers.getConnections()
        const clientState = await Promise.all(
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
        connectionsCount.value = connections.length
        totalPages.value = Math.ceil(connectionsCount.value / ITEMS_PER_PAGE)
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
    }
    const paginationHandler = (num: number) => {
      filterConnections(num)
    }
    onMounted(async () => {
      await loadDataSources()
    })

    return {
      isLoading,
      ITEMS_PER_PAGE,
      currentPage,
      totalPages,
      connectionsCount,
      paginationHandler,

      connectionsData,
      channelData,
      chainIdData,
      filteredConnections,
    }
  },
})
</script>

<style lang="scss">
.nav__dropdown-wrapper-arrow {
  fill: #007bff;
  transform: translate(3px, 0px) rotate(270deg);
  &_active {
    transform: translate(-10px, 15px) rotate(90deg);
    fill: var(--clr__action);
  }
}
.channel {
  border-top: 1px solid var(--clr__table-border);
  padding-top: 2.5rem;
}
.ibc {
  &__table {
    border: 0.1rem solid #007bff;
    border-radius: 0.8rem;
    padding: 3rem 0rem 3rem 2rem;
    margin-bottom: 2.4rem;
  }
  &__details {
    justify-content: center;
  }
  &__button {
    color: #007bff;
    text-align: center;
  }
  &__count-info {
    margin-bottom: 3.2rem;
  }

  &__sort-wrapper {
    display: flex;
    justify-content: flex-end;
  }

  &__sort {
    display: flex;
    gap: 2.4rem;
  }

  &__sort-item-title {
    font-size: 1.4rem;
    font-weight: 300;
    margin-right: 0.4rem;
  }

  &__table-head,
  &__table-row {
    grid:
      auto /
      minmax(2rem, 0.75fr)
      minmax(2rem, 1fr)
      minmax(2rem, 1fr)
      minmax(2rem, 1fr)
      minmax(6rem, 0.75fr);
  }
  &__table-row {
    margin-bottom: 1rem;
    padding: 1rem 0 0;
    border-bottom: none;
  }
  &__table-row-active {
    margin-bottom: 2.6rem;
  }
  &__table-activities {
    width: 100%;

    & > *:not(:last-child) {
      margin-bottom: 2.4rem;
    }
  }

  &__table-activities-item {
    display: flex;
    justify-content: flex-end;
    gap: 2.4rem;
  }
  &__table-cell {
    &_center {
      justify-content: center;
    }
    &_end {
      justify-content: flex-end;
    }
  }
}
@include respond-to(1024px) {
  .ibc {
    &__table-head,
    &__table-row {
      grid:
        auto /
        minmax(2rem, 0.6fr)
        minmax(2rem, 0.75fr)
        minmax(2rem, 0.6fr)
        minmax(2rem, 0.75fr)
        minmax(3rem, 0.7fr);
    }
  }
}
@include respond-to(tablet) {
  .ibc {
    &__table-activities {
      width: 100%;
    }

    &__table-activities-item {
      & > * {
        flex: 1;
      }
    }
    &__table-cell {
      &_center {
        justify-content: flex-start;
      }
      &_end {
        justify-content: flex-start;
      }
    }
    padding-bottom: 10rem;
    &__title-btn {
      display: none;
    }

    &__count-info {
      margin-bottom: 0;
    }

    &__sort {
      width: 100%;
      flex-direction: column;
      gap: 1.6rem;
    }

    &__sort-item {
      display: flex;
      flex-direction: column;
    }

    &__sort-item-title {
      margin: 0 0 0.4rem;
    }

    &__vue-picker {
      width: 100%;
    }

    &__table-row {
      grid: none;
    }
  }
}
</style>
