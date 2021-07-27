<template>
  <button
    class="pagination__button"
    @click="clickHandler"
    :class="{ 'pagination__button--disabled': disabled }"
    :disabled="disabled"
  >
    {{ number }}
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    number: { type: [String, Number] },
    disabled: { type: Boolean, default: false },
  },
  setup(props, { emit }) {
    const clickHandler = (event: Event | MouseEvent) => {
      event.preventDefault()
      emit('paginationButtonClick', { number: props.number })
    }

    return { clickHandler }
  },
})
</script>
