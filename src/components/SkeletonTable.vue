<template>
  <div
    v-for="(arr, index) in skeletonLoaderArray"
    :key="index"
    class="skeleton-table__row app-table__row"
    :class="classString"
  >
    <div
      v-for="item in arr"
      :key="item.title"
      class="skeleton-table__cell app-table__cell"
    >
      <span v-if="item.title" class="skeleton-table__title app-table__title">
        {{ item.title }}
      </span>
      <skeleton-loader
        v-else
        pill
        shimmer
        :height="skeletonHeight"
        width="100%"
        class="skeleton-table__loader"
      />
      <skeleton-loader
        pill
        shimmer
        :height="skeletonHeight"
        width="100%"
        class="skeleton-table__loader"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = withDefaults(
  defineProps<{
    headerTitles: string[]
    classString?: string
    tableSize?: number | string
    skeletonHeight?: number | string
    skeletonRadius?: number | string
  }>(),
  {
    classString: '',
    tableSize: '5',
    skeletonHeight: 24,
    skeletonRadius: 32,
  },
)

const skeletonLoaderArray = computed(() =>
  Array(Number(props.tableSize)).fill(props.headerTitles),
)
</script>

<style lang="scss" scoped>
.skeleton-table__loader {
  width: 100%;
}
.skeleton-table__cell {
  gap: 1.6rem;
}

@include respond-to(tablet) {
  .skeleton-table__title {
    display: inline-block;
    min-width: 15rem;
    margin-right: 2.4rem;
    font-weight: 300;
  }

  .skeleton-table__row {
    grid: none;
    padding: 3.4rem 0 1.6rem;
  }
}

@include respond-to(medium) {
  .data-sources__table-row.skeleton-table__row,
  .accounts-item__table-row.skeleton-table__row,
  .accounts-line.skeleton-table__row {
    grid: none;
    padding: 3.4rem 0 1.6rem;
  }

  .data-sources__table-row .skeleton-table__title,
  .accounts-item__table-row .skeleton-table__title,
  .accounts-line .skeleton-table__title {
    display: inline-block;
    min-width: 15rem;
    margin-right: 2.4rem;
    font-weight: 300;
  }
}
</style>
