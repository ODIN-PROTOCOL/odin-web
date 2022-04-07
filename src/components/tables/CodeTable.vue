<template>
  <div class="code-table">
    <div v-if="code">
      <CopyButtonWithText text="Copy code" :value="code" />
      <highlightjs class="code-table__script" autodetect :code="code" />
    </div>
    <div class="code-table__empty-msg" v-else>Code not found</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import CopyButtonWithText from '@/components/CopyButtonWithText.vue'

export default defineComponent({
  components: { CopyButtonWithText },
  props: {
    code: { type: String, required: true },
  },
})
</script>

<style lang="scss" scoped>
.code-table {
  &__script {
    margin-bottom: 2rem;
    white-space: pre;
  }
  &__empty-msg {
    text-align: center;
    font-size: 2.5rem;
  }
}
</style>
