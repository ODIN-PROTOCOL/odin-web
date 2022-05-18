<template>
  <div class="code-table">
    <div v-if="code">
      <CopyButtonWithText text="Copy code" :value="code" />
      <highlightjs class="code-table__script" autodetect :code="code" />
    </div>
    <div v-else class="app-table__empty-stub">
      <span class="empty mg-t32">Code not found</span>
    </div>
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
.code-table__script {
  margin-bottom: 2rem;
  white-space: pre;
}
</style>
