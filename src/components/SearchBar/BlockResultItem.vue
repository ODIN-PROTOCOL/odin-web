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
              params: {
                address: result.validator.validator_info.operator_address,
              },
            }"
            class="app-table__cell-txt app-table__link"
            :text="cropText(result.validator.validator_info.operator_address)"
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
.search__dropdown--item {
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--clr__text);
  text-decoration: none;
  cursor: pointer;
}

.search__dropdown--item-left {
  display: grid;
  align-items: center;
  grid-template-columns: 4.2rem 1fr;
  gap: 0 1rem;
}

.search__dropdown--item-right {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1rem;
}

.search__dropdown--item-validator {
  display: flex;
  align-items: center;
  gap: 0 1rem;

  @include respond-to(small) {
    flex-direction: column;
    align-items: flex-start;
  }
}

.search__dropdown--item-label {
  width: 4.2rem;
  height: 4.2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  grid-row-start: 1;
  grid-row-end: 3;
  background: var(--clr__input-border);
  border-radius: 0.4rem;
  font-size: 2rem;
  line-height: 2.3rem;
}

.search__dropdown--item-time {
  display: flex;
  align-items: center;
  grid-row-start: 2;
  grid-row-end: 3;
  gap: 0.5rem;
}

.search__dropdown--item-transactions,
.search__dropdown--item-time {
  color: var(--clr__text-muted);
  font-size: 1.4rem;
}

.search__dropdown--item:hover {
  background: rgba(#ced4da, 0.3);
}
</style>
