<template>
  <div class="copy-text">
    <span class="copy-text__value" :title="displayTitle">
      {{ displayValue }}
    </span>
    <button
      class="copy-text__btn app-ico-btn mg-l8"
      type="button"
      @click="toClipboard()"
    >
      <img src="~@/assets/icons/clipboard.svg" alt="Copy" />
    </button>
  </div>
</template>

<script lang="ts">
import { NumLike, NumLikeTypes, toStr } from '@/helpers/casts'
import { computed, defineComponent, PropType, toRef } from 'vue'

export default defineComponent({
  props: {
    text: { type: NumLikeTypes as PropType<NumLike>, required: true },
    displayText: { type: NumLikeTypes as PropType<NumLike>, required: false },
    title: { type: NumLikeTypes as PropType<NumLike>, required: false },
  },
  setup(props) {
    const _text = toRef(props, 'text')
    const _displayText = toRef(props, 'displayText')
    const _title = toRef(props, 'title')

    const displayValue = computed(() =>
      toStr((_displayText.value as NumLike) ?? _text.value)
    )
    const displayTitle = computed(() =>
      _title.value ? toStr(_title.value as NumLike) : null
    )

    const toClipboard = () => {
      alert('TODO: to clipboard')
    }

    return { displayValue, displayTitle, toClipboard }
  },
})
</script>

<style scoped>
.copy-text__btn {
  height: 1.6rem;
  width: 1.6rem;
  vertical-align: text-bottom;
}
</style>
