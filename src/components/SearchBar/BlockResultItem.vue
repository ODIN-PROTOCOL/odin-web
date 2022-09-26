<template>
  <template v-if="result">
    <router-link
      class="search__dropdown--item"
      :to="{
        name: $routes.blockDetails,
        params: { id: result.header?.height },
      }"
    >
      <div class="search__dropdown--item-left">
        <div class="search__dropdown--item-label">Bk</div>
        <div class="search__dropdown--item-height">
          <TitledLink
            class="app-table__cell-txt app-table__link"
            :text="result?.header?.height"
            :name="{
              name: $routes.blockDetails,
              params: { id: result.header?.height },
            }"
          />
        </div>
        <div class="search__dropdown--item-time">
          {{ diffDays(today, getDay(result?.header?.time)) }}
        </div>
      </div>
      <div class="search__dropdown--item-right">
        <div class="search__dropdown--item-validator">
          Validator:
          <TitledLink
            :name="{
              name: $routes.validatorDetails,
              params: { address: result.validator },
            }"
            class="app-table__cell-txt app-table__link"
            :text="cropText(result.validator)"
          />
        </div>
        <div class="search__dropdown--item-transactions">
          {{ result.txs }} transactions
        </div>
      </div>
    </router-link>
  </template>
</template>
<script setup lang="ts">
import { diffDays, cropText, getDay } from '@/helpers/formatters'
import { TransformedBlocks } from '@/helpers/Types'
import TitledLink from '@/components/TitledLink.vue'

defineProps<{
  result: TransformedBlocks
}>()
const today = new Date()
</script>
<style lang="scss" scoped>
.search {
  &__dropdown {
    &--item {
      text-decoration: none;
      color: var(--clr__text);
      padding: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      &-left {
        display: grid;
        grid-template-columns: 4.2rem 1fr;
        gap: 0 1rem;
        align-items: center;
      }
      &-right {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-end;
        gap: 1rem;
      }
      &-validator {
        display: flex;
        align-items: center;
        gap: 0 1rem;
        @media (max-width: 480px) {
          flex-direction: column;
          align-items: flex-start;
        }
      }
      &-label {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 4.2rem;
        height: 4.2rem;
        background: var(--clr__input-border);
        border-radius: 0.4rem;
        font-size: 2rem;
        line-height: 2.3rem;
        grid-row-start: 1;
        grid-row-end: 3;
      }
      &-time {
        grid-row-start: 2;
        grid-row-end: 3;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      &-transactions,
      &-time {
        font-size: 1.4rem;
        color: var(--clr__text-muted);
      }
      &:hover {
        background: rgba(#ced4da, 0.3);
      }
    }
    @media (max-width: 480px) {
      width: calc(100% - 19px);
      left: 50%;
      transform: translate(-50%);
    }
  }
}
</style>
