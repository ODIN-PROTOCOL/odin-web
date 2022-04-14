<template>
  <div class="app-table channel">
    <div class="app-table__head ibc__table-head">
      <span>Port &#10141; Counterparty Port</span>
      <span>Channel &#10141; Counterparty Channel</span>
      <span>State</span>
      <span>Order</span>
    </div>
    <div
      v-for="channel in getChannel(connection)"
      :key="channel"
      class="app-table__body"
    >
      <div class="app-table__row ibc__table-row">
        <div class="app-table__cell channel-detail__row">
          <span class="app-table__title">Port &#10141; Counterparty Port</span>
          <span class="app-table__cell-row">
            {{ channel.portId }} &#10141;
          </span>
          <span class="app-table__cell-row">
            {{ channel.counterparty.portId }}</span
          >
        </div>
        <div class="app-table__cell">
          <span class="app-table__title"
            >Channel &#10141; Counterparty Channel</span
          >
          <span class="app-table__cell-row">
            {{ channel.channelId }} &#10141;
          </span>
          <span class="app-table__cell-row">
            {{ channel.counterparty.channelId }}</span
          >
        </div>
        <div class="app-table__cell">
          <span class="app-table__title">State</span>
          <StatusIcon :status="channel?.state === 3 ? 'success' : 'error'" />
        </div>
        <div class="app-table__cell">
          <span class="app-table__title">Order</span>
          <span>{{ getOrder(channel.ordering) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import StatusIcon from '@/components/StatusIcon.vue'
import { IdentifiedChannel } from 'cosmjs-types/ibc/core/channel/v1/channel'
import { IdentifiedConnection } from 'cosmjs-types/ibc/core/connection/v1/connection'

export default defineComponent({
  components: { StatusIcon },
  props: {
    connection: {
      type: Object as PropType<IdentifiedConnection>,
      required: true,
    },
    channelData: {
      type: Array as PropType<Array<IdentifiedChannel>>,
      required: true,
    },
  },
  setup(props) {
    const getChannel = (connection: IdentifiedConnection) => {
      return props?.channelData?.filter(
        (channel: IdentifiedChannel) =>
          channel?.connectionHops[0] === connection?.id
      )
    }
    const getOrder = (item: number) => {
      if (item === -1) {
        return 'Unrecognized'
      } else if (item === 0) {
        return 'None Unspecified'
      } else if (item === 1) {
        return 'Unordered'
      } else if (item === 2) {
        return 'Ordered'
      }
    }
    return { getChannel, getOrder }
  },
})
</script>

<style scoped lang="scss">
.channel-detail__row {
  display: flex;
}
</style>
