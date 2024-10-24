<template>
  <template v-if="result">
    <router-link
      class="search__dropdown--item"
      :to="{
        name: $routes.nft_detail,
        params: { id: result.id },
      }"
    >
      <div class="search__dropdown--item-left">
        <div class="search__dropdown--item-height">
          <img :src="result.details?.preview" />
        </div>
        <div class="search__dropdown--item-time"></div>
      </div>
      <div class="search__dropdown--item-left">
        <div class="search__dropdown--item-nft"></div>
        <div class="search__dropdown--item-nft">
          {{ result.details?.prompt.slice(0, 100) }}...
        </div>
      </div>
    </router-link>
  </template>
</template>

<script setup lang="ts">
import TitledLink from '@/components/TitledLink.vue'
import { NFTInfo } from '@/graphql/types'

const props = defineProps<{
  result: NFTInfo
}>()
</script>

<style lang="scss" scoped>
.address-link {
  max-width: 14rem;
}

.search__dropdown--item {
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  color: var(--clr__text);
  text-decoration: none;
  cursor: pointer;
}

.search__dropdown--item-left {
  display: grid;
  grid-template-columns: 4.2rem 1fr;
  align-items: center;
  gap: 0 1rem;
}

.search__dropdown--item-right {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1rem;
  font-size: 1.3rem;
}

.search__dropdown--item-nft {
  display: flex;
  align-items: center;
  gap: 0 1rem;
  color: var(--clr__main-text);

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
