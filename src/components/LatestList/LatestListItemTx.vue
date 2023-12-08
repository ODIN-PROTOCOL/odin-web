<template>
  <div class="latest-list-item">
    <div class="latest-list-item__left">
      <div class="latest-list-item__label">Tx</div>
      <div class="latest-list-item__name">
        <TitledLink
          v-if="tx?.hash"
          class="app-table__cell-txt"
          :name="{
            name: $routes.transactionDetails,
            params: { hash: tx.hash },
          }"
          :title="tx.hash"
          :text="formatTxString(tx.hash)"
        />
        <span v-else>No info</span>
      </div>
      <div class="latest-list-item__time app-table__cell-txt">
        {{ diffDays(toDay, getDay(tx.time)) }}
      </div>
    </div>
    <div class="latest-list-item__center">
      <div class="latest-list-item__validator">
        <span>From:</span>
        <TitledLink
          v-if="tx?.sender"
          :name="{
            name: $routes.accountDetails,
            params: { hash: tx.sender },
          }"
          :title="tx.sender"
          :text="formatTxString(tx.sender)"
          class="app-table__link"
        />
        <span v-else>No info</span>
      </div>
      <div class="latest-list-item__to">
        <span>To:</span>
        <TitledLink
          v-if="tx?.receiver"
          :name="{
            name: $routes.accountDetails,
            params: { hash: tx.receiver },
          }"
          :title="tx.receiver"
          :text="formatTxString(tx.receiver)"
          class="app-table__link"
        />
        <span v-else>No info</span>
      </div>
    </div>
    <div class="latest-list-item__right">
      <div class="latest-list-item__amount">
        <span>{{ tx.amount }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { DecodedTxData } from '@/helpers/Types'
import { diffDays, getDay, formatTxString } from '@/helpers/formatters'
import TitledLink from '@/components/TitledLink.vue'

defineProps<{
  tx: DecodedTxData
}>()

const toDay = new Date()
</script>

<style lang="scss" scoped>
.latest-list-item {
  padding-bottom: 2.4rem;
  display: grid;
  grid: auto/minmax(4rem, 0.6fr) minmax(5rem, 0.9fr) minmax(10rem, 0.5fr);
  align-items: center;
  gap: 1.5rem;
  border-bottom: 0.1px solid var(--clr__card-border);

  &:last-child {
    padding-bottom: 0;
    border-bottom: none;
  }
}

.latest-list-item__left {
  width: 100%;
  min-width: 7rem;
  max-width: 16rem;
  align-items: center;
  display: grid;
  grid-template-columns: 4.2rem auto;
  gap: 0 0.8rem;
  @include ellipsis();
}

.latest-list-item__name {
  width: 100%;
  min-width: 1.4rem;
  max-width: 10rem;
  grid-row-start: 1;
  grid-row-end: 2;

  a {
    color: var(--clr__action);
    font-size: 1.4rem;
    text-decoration: none;
  }
}

.latest-list-item__time {
  min-width: 2rem;
  max-width: 9rem;
  width: 100%;
  display: flex;
  align-items: center;
  grid-row-start: 2;
  grid-row-end: 3;
  gap: 0.5rem;
  color: var(--clr__text-muted);
  font-size: 1.2rem;
}

.latest-list-item__label {
  width: 4.2rem;
  height: 4.2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  grid-row-start: 1;
  grid-row-end: 3;
  background: var(--clr__card-label-tx-bg);
  color: var(--clr__card-label-text);
  border-radius: 0.4rem;
  font-size: 1.8rem;
  line-height: 2.5rem;
}

.latest-list-item__center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.8rem;
  font-size: 1.2rem;
}

.latest-list-item__validator,
.latest-list-item__to {
  width: 100%;
  display: flex;
  gap: 0.8rem;
  font-size: 1.2rem;
  color: var(--clr__text-muted);
}

.latest-list-item__right {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.4rem;
  font-weight: 600;
  @include ellipsis();
}

.latest-list-item__amount {
  padding: 0.8rem;
  padding-left: 0;
  min-width: 10rem;
  max-width: 13.6rem;
  width: 100%;
  height: 3.6rem;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: var(--clr__frame-bg);
  border-radius: 0.4rem;
}

@include respond-to(tablet) {
  .latest-list-item {
    grid: auto/ minmax(9.5rem, 0.5fr) minmax(8rem, 1fr);
    align-items: flex-start;
  }

  .latest-list-item__left {
    grid-template-columns: 1fr;
  }

  .latest-list-item__label {
    display: none;
  }

  .latest-list-item__right {
    justify-content: left;
  }
}
</style>
