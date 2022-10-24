<template>
  <div class="app-table__body ibc-line">
    <div class="app-table__head ibc-line__head">
      <span>Connection</span>
      <span>Counterparty Chain ID</span>
      <span>Client ID</span>
      <span>Counterparty Client ID</span>
      <span>
        <button
          class="ibc-line__show-button"
          type="button"
          @click="isShowChannelDetail = !isShowChannelDetail"
        >
          {{ isShowChannelDetail ? 'Hide channels' : 'Show channels' }}
        </button>
      </span>
    </div>
    <div>
      <div class="app-table__row ibc-line__row">
        <div class="app-table__cell">
          <span class="app-table__title ibc-line__title">Connection</span>
          <span class="app-table__cell-txt">{{ connection.id }}</span>
        </div>
        <div class="app-table__cell">
          <span class="app-table__title ibc-line__title">
            Counterparty Chain ID
          </span>
          <span class="app-table__cell-txt">
            {{ chainIdData.chainId || '-' }}
          </span>
        </div>
        <div class="app-table__cell">
          <span class="app-table__title ibc-line__title">Client ID</span>
          <span class="app-table__cell-txt">
            {{ connection.clientId || '-' }}
          </span>
        </div>
        <div class="app-table__cell">
          <span class="app-table__title ibc-line__title">
            Counterparty Client ID
          </span>
          <span class="app-table__cell-txt">
            {{ connection.counterparty?.clientId || '-' }}
          </span>
        </div>
        <div class="app-table__cell">
          <span class="app-table__title ibc-line__title">
            <button
              class="ibc-line__show-button"
              type="button"
              @click="isShowChannelDetail = !isShowChannelDetail"
            >
              {{ isShowChannelDetail ? 'Hide channels' : 'Show channels' }}
            </button>
          </span>
        </div>
      </div>
    </div>
    <channel-detail
      v-if="isShowChannelDetail"
      :channel-data="channelData"
      :connection="connection"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ClientState } from 'cosmjs-types/ibc/lightclients/tendermint/v1/tendermint'
import { IdentifiedChannel } from 'cosmjs-types/ibc/core/channel/v1/channel'
import { IdentifiedConnection } from 'cosmjs-types/ibc/core/connection/v1/connection'
import ChannelDetail from '@/components/ChannelDetail.vue'

defineProps<{
  connection: IdentifiedConnection
  chainIdData: ClientState
  channelData: IdentifiedChannel
}>()

const isShowChannelDetail = ref(false)
</script>

<style scoped lang="scss">
.ibc-line__head,
.ibc-line__row {
  grid:
    auto /
    minmax(2rem, 1fr)
    minmax(2rem, 1fr)
    minmax(2rem, 1fr)
    minmax(2rem, 1fr)
    minmax(1.5rem, 0.75fr);
}

.ibc-line__show-button {
  color: var(--clr__btn-normal);
  font-weight: 600;
}

@include respond-to(tablet) {
  .ibc-line {
    display: block;
  }

  .ibc-line__head {
    display: none;
  }

  .ibc-line__row {
    grid: none;
  }

  .ibc-line__title {
    margin-right: 2.4rem;
    min-width: 15rem;
    display: inline-block;
    font-weight: 300;
  }
}
</style>
