<template>
  <div class="status-block" :class="`status-block_${status}`">
    {{ displayText }}
  </div>
</template>

<script lang="ts">
import { defineComponent, toRef, computed } from 'vue'

export default defineComponent({
  props: {
    status: { type: String, required: true },
    text: { type: String },
  },
  setup: function (props) {
    const _text = toRef(props, 'text')

    const displayText = computed(() => {
      if (!_text.value) return 'Default'
      return _text.value
    })

    return { displayText }
  },
})
</script>

<style lang="scss" scoped>
.status-block {
  padding: 0.4rem 2.8rem;
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 1.6rem;
  border-radius: 3.2rem;
  background: var(--clr__status-default);
  color: var(--clr__text-on-action);
  text-align: center;
  &_success {
    background: var(--clr__status-success);
  }

  &_pending {
    background: var(--clr__status-pending);
  }

  &_error {
    background: var(--clr__status-error);
  }

  &_progress {
    background: var(--clr__status-progress);
  }
}
</style>
