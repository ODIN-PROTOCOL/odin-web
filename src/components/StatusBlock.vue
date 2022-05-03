<template>
  <div class="status-block" :class="`status-block--${status}`">
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
  padding: 0.4rem 0.8rem;
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 1.6rem;
  border-radius: 3.2rem;
  width: 10rem;
  background: var(--clr__status-default);
  color: var(--clr__text-on-action);
  text-align: center;
}
.status-block--success {
  background: var(--clr__status-success);
}
.status-block--pending {
  background: var(--clr__status-pending);
}
.status-block--error {
  background: var(--clr__status-error);
}
.status-block--progress {
  background: var(--clr__status-progress);
}
</style>
