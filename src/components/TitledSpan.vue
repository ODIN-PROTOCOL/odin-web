<template>
  <span :title="displayTitle">
    {{ displayText }}
  </span>
</template>

<script lang="ts">
import { NumLike, NumLikeTypes, toString } from '@/helpers/casts'
import { computed, defineComponent } from 'vue'

export default defineComponent({
  props: {
    text: {
      type: NumLikeTypes,
      required: true,
    },
    title: {
      type: NumLikeTypes,
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
