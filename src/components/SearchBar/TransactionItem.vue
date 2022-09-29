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
