<template>
  <div class="app-table channel-detail">
    <template v-if="channels.length">
      <div class="app-table__head channel-detail__head">
        <span>Port - Counterparty Port</span>
        <span>Channel - Counterparty Channel</span>
        <span>State</span>
        <span>Order</span>
        <span></span>
      </div>
      <div
        v-for="channel in channels"
        class="app-table__row channel-detail__row"
        :key="channel?.portId"
      >
        <div class="app-table__cell channel-detail__cell">
          <div class="app-table__title channel-detail__title">
            Port - Counterparty Port
          </div>
          <div class="app-table__cell-txt">
            <span>
              {{ channel.portId + ' - ' + channel.counterparty?.portId }}
            </span>
          </div>
        </div>
        <div class="app-table__cell channel-detail__cell">
          <div class="app-table__title channel-detail__title">
            Channel - Counterparty Channel
          </div>
          <div class="app-table__cell-txt">
            <span>
              {{ channel.channelId + ' - ' + channel.counterparty?.channelId }}
            </span>
          </div>
        </div>
        <div class="app-table__cell channel-detail__cell">
          <div class="app-table__title channel-detail__title">State</div>
          <StatusIcon :status="channel?.state === 3 ? 'success' : 'error'" />
        </div>
        <div class="app-table__cell channel-detail__cell">
          <div class="app-table__title channel-detail__title">Order</div>
          <div class="app-table__cell-txt">
            <span>
              {{ getOrder(channel.ordering) }}
            </span>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="channel-detail__empty">No channels</div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IdentifiedChannel } from 'cosmjs-types/ibc/core/channel/v1/channel'
import { IdentifiedConnection } from 'cosmjs-types/ibc/core/connection/v1/connection'
import { ORDER } from '@/enums'
import StatusIcon from '@/components/StatusIcon.vue'

const props = defineProps<{
  connection: IdentifiedConnection
  channelData: IdentifiedChannel[]
}>()

const channels = computed(() => {
  return props.channelData?.filter(
    (channel: IdentifiedChannel) =>
      channel?.connectionHops[0] === props.connection?.id,
  )
})

const getOrder = (item: number) => {
  if (item === ORDER.unrecognized) {
    return 'Unrecognized'
  } else if (item === ORDER.noneUnspecified) {
    return 'None Unspecified'
  } else if (item === ORDER.unordered) {
    return 'Unordered'
  } else if (item === ORDER.ordered) {
    return 'Ordered'
  }
}
</script>

<style lang="scss" scoped>
.channel-detail {
  border: none;
  border-top: 0.1rem solid var(--clr__table-border);
  border-radius: 0;
}

.channel-detail__head {
  border: none;

  & > span {
    padding: 1.4rem 2rem;
  }
}

.channel-detail__head,
.channel-detail__row {
  grid:
    auto /
    minmax(2rem, 1fr)
    minmax(2rem, 1fr)
    minmax(2rem, 1fr)
    minmax(2rem, 1fr)
    minmax(1.5rem, 0.75fr);
  border: none;
}

.channel-detail__empty {
  text-align: center;
}

@include respond-to(tablet) {
  .channel-detail__head {
    display: none;
  }

  .channel-detail__row {
    grid: none;
  }

  .channel-detail__title {
    margin-right: 2.4rem;
    min-width: 15rem;
    display: inline-block;
    font-weight: 300;
  }
}
</style>
