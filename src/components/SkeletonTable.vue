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
      <span class="skeleton-table__title app-table__title">{{
        item.title
      }}</span>
      <skeleton-loader
        :height="skeletonHeight"
        :rounded="true"
        :width="-1"
        :radius="skeletonRadius"
        animation="wave"
        color="rgb(225, 229, 233)"
        class="skeleton-table__loader"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { duplicateArrayNCount } from '@/helpers/helpers'
export default defineComponent({
  props: {
    headerTitles: { type: Array, required: true },
    classString: { type: String },
    tableSize: { type: Number, default: 5 },
    skeletonHeight: { type: Number, default: 24 },
    skeletonRadius: { type: Number, default: 32 },
  },
  setup(props) {
    const skeletonLoaderArray = duplicateArrayNCount(
      props.headerTitles,
      props.tableSize
    )
    return { skeletonLoaderArray }
  },
})
</script>
<style scoped>
.skeleton-table__loader {
  width: 100%;
}
</style>
