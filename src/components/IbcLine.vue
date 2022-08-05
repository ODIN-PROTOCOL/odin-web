<template>
  <div class="app-table__body ibc-line">
    <div class="app-table__row ibc-line__row">
      <div class="app-table__cell ibc-line__cell">
        <span class="app-table__title ibc-line__title">Connection</span>
        <span class="app-table__cell-txt">{{ connection.id }}</span>
      </div>
      <div class="app-table__cell ibc-line__cell">
        <span class="app-table__title ibc-line__title"
          >Counterparty Chain ID</span
        >
        <span class="app-table__cell-txt">{{
          chainIdData.chainId || '-'
        }}</span>
      </div>
      <div class="app-table__cell ibc-line__cell">
        <span class="app-table__title ibc-line__title">Client ID</span>
        <span class="app-table__cell-txt">
          {{ connection.clientId || '-' }}
        </span>
      </div>
      <div class="app-table__cell ibc-line__cell">
        <span class="app-table__title ibc-line__title"
          >Counterparty Client ID</span
        >
        <span class="app-table__cell-txt">
          {{ connection.counterparty.clientId || '-' }}
        </span>
      </div>
    </div>
    <div class="ibc-line__show">
      <button
        type="button"
        class="ibc-line__show-button"
        @click="isShowChannelDetail = !isShowChannelDetail"
      >
        {{ isShowChannelDetail ? 'Hidden channels' : 'Show channels' }}
        <ArrowIcon
          class="ibc-line__arrow-icon"
          :class="{
            ['ibc-line__arrow-icon--active']: isShowChannelDetail,
          }"
        />
      </button>
    </div>
  </div>
  <channel-detail
    v-if="isShowChannelDetail"
    :channel-data="channelData"
    :connection="connection"
  />
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { ArrowIcon } from '@/components/icons'
import { IdentifiedChannel } from 'cosmjs-types/ibc/core/channel/v1/channel'
import { IdentifiedConnection } from 'cosmjs-types/ibc/core/connection/v1/connection'
import { ClientState } from 'cosmjs-types/ibc/lightclients/tendermint/v1/tendermint'
import ChannelDetail from '@/components/ChannelDetail.vue'

defineProps<{
  connection?: IdentifiedConnection
  chainIdData?: ClientState
  channelData?: IdentifiedChannel
}>()
const isShowChannelDetail = ref(false)
</script>

<style lang="scss">
.ibc-line__table {
  border: 0.1rem solid var(--clr__action);
  border-radius: 0.8rem;
  padding: 3rem 2rem;
  margin-bottom: 2.4rem;
}
.ibc-line__cell {
  flex-direction: column;
}
.ibc-line__title {
  display: block;
  margin-bottom: 0.8rem;
  font-weight: 300;
  min-width: 13rem;
}
.ibc-line {
  display: grid;
  align-items: center;
  grid:
    auto /
    minmax(2rem, 0.85fr)
    minmax(6rem, 0.15fr);
}
.ibc-line__row {
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
.ibc-line__show {
  text-align: center;
  white-space: nowrap;
}
.ibc-line__show-button {
  color: var(--clr__btn-normal);
  text-align: center;
}
.ibc-line__arrow-icon {
  fill: var(--clr__btn-normal);
  transform: translate(0rem, 0.7rem) rotate(0deg);
}
.ibc-line__arrow-icon--active {
  transform: translate(0rem, 0.7rem) rotate(180deg);
  fill: var(--clr__action);
}

@include respond-to(medium) {
  .ibc-line {
    grid:
      auto /
      minmax(2rem, 0.75fr)
      minmax(6rem, 0.25fr);
  }
}
@include respond-to(tablet) {
  .ibc-line {
    display: block;
  }
  .ibc-line__cell {
    flex-direction: row;
  }
  .ibc-line__row {
    grid: none;
  }
}
</style>
