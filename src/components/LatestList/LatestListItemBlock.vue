<template>
  <div class="latest-list-item">
    <div class="latest-list-item__left">
      <div class="latest-list-item__label">Bk</div>
      <div class="latest-list-item__name">
        <TitledLink
          :name="{
            name: $routes.blockDetails,
            params: { id: block.header.height },
          }"
          class="app-table__cell-txt"
          :text="block.header.height"
        />
      </div>
      <div class="latest-list-item__time">
        <div class="info-value">
          {{ diffDays(toDay, getDay(block.header.time)) }}
        </div>
      </div>
    </div>
    <div class="latest-list-item__center">
      <div class="latest-list-item__validator">
        <span>Validator:</span>
        <TitledLink
          :name="{
            name: $routes.validatorDetails,
            params: { address: block.validator },
          }"
          :text="`${block.validator}`"
          class="app-table__cell-txt app-table__link"
        />
      </div>
      <div class="latest-list-item__transactions">
        <span>{{ block.txs }} transactions</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { diffDays, getDay } from '@/helpers/formatters'
import { TransformedBlocks } from '@/helpers/Types'
import TitledLink from '@/components/TitledLink.vue'

defineProps<{
  block: TransformedBlocks
}>()

const toDay = new Date()
</script>

<style scoped lang="scss">
.latest-list-item {
  padding-bottom: 2.4rem;
  display: grid;
  grid: auto/ minmax(12rem, 0.5fr) minmax(7rem, 1fr);
  align-items: center;
  gap: 2.4rem;
  border-bottom: 0.1px solid var(--clr__card-border);

  &:last-child {
    padding-bottom: 0;
    border-bottom: none;
  }
}

.latest-list-item__left {
  display: grid;
  grid-template-columns: 4.2rem auto;
  align-items: center;
  gap: 0 0.8rem;
}

.latest-list-item__name {
  min-width: 1.4rem;
  max-width: 9rem;
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
  background: var(--clr__card-label-block-bg);
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
}

.latest-list-item__validator,
.latest-list-item__to {
  width: 100%;
  display: flex;
  gap: 0.8rem;
  color: var(--clr__text-muted);
  font-size: 1.2rem;
}

.latest-list-item__transactions {
  color: var(--clr__text-muted);
  font-size: 1.2rem;
}

.latest-list-item__right {
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--clr__text);
  font-size: 1.4rem;
  font-weight: 600;
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
