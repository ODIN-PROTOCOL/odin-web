<template>
  <template v-if="result">
    <router-link
      class="search__dropdown--item"
      :to="{
        name: $routes.transactionDetails,
        params: { hash: result.hash },
      }"
    >
      <div class="search__dropdown--item-left">
        <div class="search__dropdown--item-label">Tx</div>
        <div class="search__dropdown--item-height">
          <TitledLink
            :name="{
              name: $routes.transactionDetails,
              params: { hash: result.hash },
            }"
            :text="result.hash ? cropText(`0x${result.hash}`) : 'No info'"
            class="app-table__cell-txt app-table__link"
          />
        </div>

        <div class="search__dropdown--item-time">
          {{ diffDays(today, getDay(timestamp)) }}
        </div>
      </div>
      <div class="search__dropdown--item-right">
        <div class="search__dropdown--item-validator">
          From:
          <TitledLink
            v-if="result.sender"
            class="app-table__cell-txt app-table__link"
            :name="{
              name: $routes.accountDetails,
              params: { hash: result.sender },
            }"
            :text="cropText(`${result.sender}`)"
          />
          <span v-else>No info</span>
        </div>
        <div class="search__dropdown--item-validator">
          <span> To: </span>
          <TitledLink
            v-if="result.receiver"
            class="app-table__cell-txt app-table__link"
            :name="{
              name: $routes.accountDetails,
              params: { hash: result.receiver },
            }"
            :text="cropText(`${result.receiver}`)"
          />
          <span v-else>No info</span>
        </div>
      </div>
    </router-link>
  </template>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { diffDays, cropText, getDay } from '@/helpers/formatters'
import { DecodedTxData } from '@/helpers/Types'
import TitledLink from '@/components/TitledLink.vue'

const props = defineProps<{
  result: DecodedTxData
}>()
const today = new Date()
const timestamp = computed(() => Date.parse(String(props.result.time)))
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
