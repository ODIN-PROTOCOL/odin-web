<template>
  <span :title="displayTitle">
    {{ displayText }}
  </span>
</template>

<script lang="ts">
import { NumLike, toString } from '@/helpers/casts'
import BigNumber from 'bignumber.js'
import Long from 'long'
import { computed, defineComponent } from 'vue'

export default defineComponent({
  props: {
    text: {
      type: [String, Number, Long, BigNumber],
      required: true,
    },
    title: {
      type: [String, Number, Long, BigNumber],
      required: false,
    },
  },
  setup: (props) => {
    const displayText = computed(() =>
      toString((props.text as unknown) as NumLike)
    )
    const displayTitle = computed(() => {
      return props.title
        ? toString((props.title as unknown) as NumLike)
        : displayText.value
    })
    return {
      displayTitle,
      displayText,
    }
  },
})
</script>

<style scoped></style>
