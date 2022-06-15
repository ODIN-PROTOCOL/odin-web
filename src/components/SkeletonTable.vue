<template>
  <div
    v-for="(arr, index) in skeletonLoaderArray"
    :key="index"
    class="app-table__row"
    :class="classString"
  >
    <div v-for="item in arr" :key="item.title" class="app-table__cell">
      <span class="app-table__title">{{ item.title }}</span>
      <skeleton-loader
        :height="24"
        :rounded="true"
        animation="fade"
        color="rgb(225, 229, 233)"
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
