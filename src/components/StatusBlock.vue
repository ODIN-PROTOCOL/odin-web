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

    const displayText = computed(() =>
      _text.value
        ? _text.value.split('')[0].toUpperCase() +
          _text.value.slice(1).toLowerCase()
        : 'Default'
    )

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
  border-radius: 4px;
  background: var(--clr__status-default);
  color: var(--clr__text-on-action);

  &_success {
    background: var(--clr__status-success);
  }

  &_pending {
    background: var(--clr__status-pending);
  }

  &_failed {
    background: var(--clr__status-failed);
  }

  &_progress {
    background: var(--clr__status-progress);
  }
}
</style>
