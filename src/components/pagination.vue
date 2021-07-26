<template>
  <div class="pagination">pagination</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    props: { type: String },
  },
  setup() {
    const data = {}
    return { data }
  },
})
</script>

<style scoped lang="scss">
.pagination {
  margin-top: 4rem;
}
</style>
