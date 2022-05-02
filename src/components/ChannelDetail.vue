<template>
  <div class="app-table channel-detail">
    <template v-if="channels.length">
      <div
        v-for="channel in channels"
        :key="channel?.portId"
        class="app-table__row channel-detail__row"
      >
        <div class="app-table__cell channel-detail__cell">
          <div class="app-table__title channel-detail__cell-txt title">
            <span class="channel-detail__cell-txt-row">Port &#10141;</span>
            <span class="channel-detail__cell-txt-row">Counterparty Port</span>
          </div>
          <div class="app-table__cell-row channel-detail__cell-txt">
            <span class="channel-detail__cell-txt-row"
              >{{ channel.portId }} &#10141;</span
            >
            <span class="channel-detail__cell-txt-row">
              {{ channel.counterparty.portId }}</span
            >
          </div>
        </div>
        <div class="app-table__cell channel-detail__cell">
          <div class="app-table__title channel-detail__cell-txt title">
            <span class="channel-detail__cell-txt-row">Channel &#10141;</span>
            <span class="channel-detail__cell-txt-row"
              >Counterparty Channel</span
            >
          </div>
          <div class="app-table__cell-row channel-detail__cell-txt">
            <span class="channel-detail__cell-txt-row"
              >{{ channel.channelId }} &#10141;</span
            >
            <span class="channel-detail__cell-txt-row">{{
              channel.counterparty.channelId
            }}</span>
          </div>
        </div>
        <div class="app-table__cell channel-detail__cell">
          <span class="app-table__title channel-detail__cell-txt title"
            >State</span
          >
          <StatusIcon :status="channel?.state === 3 ? 'success' : 'error'" />
        </div>
        <div class="app-table__cell channel-detail__cell">
          <span class="app-table__title channel-detail__cell-txt title"
            >Order</span
          >
          <span>{{ getOrder(channel.ordering) }}</span>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="channel-detail__empty">No channels</div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue'
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
    const channels = computed(() => {
      return props.channelData?.filter(
        (channel: IdentifiedChannel) =>
          channel?.connectionHops[0] === props.connection?.id
      )
    })
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
    return { channels, getOrder }
  },
})
</script>

<style scoped lang="scss">
.title {
  display: block;
  margin-bottom: 0.8rem;
  font-weight: 300;
  min-width: 13rem;
}
.channel-detail {
  border-top: 0.1rem solid var(--clr__table-border);
  padding-top: 2.3rem;
  margin-top: 2.3rem;
}
.channel-detail__cell {
  margin-bottom: 0.5rem;
  flex-direction: column;
}
.channel-detail__cell-txt-row {
  padding-right: 0.2rem;
}
.channel-detail__row {
  grid:
    auto /
    minmax(3rem, 1fr)
    minmax(3rem, 1.1fr)
    minmax(3rem, 1fr)
    minmax(3rem, 1fr)
    minmax(2rem, 0.75fr);
  border: none;
  padding: 0;
  margin-bottom: 1rem;
}
.channel-detail__empty {
  text-align: center;
}
@include respond-to(x-medium) {
  .channel-detail__cell-txt {
    display: flex;
    flex-direction: column;
  }
}
@include respond-to(tablet) {
  .channel-detail {
    border-top: none;
    padding-top: 0;
    margin-top: 0;
    & > *:not(:last-child) {
      padding-bottom: 1.5rem;
      border-bottom: 0.1rem solid var(--clr__table-border);
    }
  }
  .channel-detail__row {
    display: block;
    padding-top: 2.5rem;
  }
  .channel-detail__empty {
    margin-top: 2.4rem;
  }
  .channel-detail__cell {
    flex-direction: row;
  }
}
</style>
