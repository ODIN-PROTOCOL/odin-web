<template>
  <div class="copy-text">
    <span class="copy-text__value" :title="displayTitle">
      {{ displayValue }}
    </span>
    <div class="copy-text__btn-wrp mg-l8">
      <button
        class="copy-text__btn app-ico-btn"
        type="button"
        @click="toClipboard()"
      >
        <img src="~@/assets/icons/clipboard.svg" alt="Copy" />
      </button>
      <div v-show="isCopiedShown" class="copy-text__btn-copied-tip">
        Copied!
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NumLike, toStr } from '@/helpers/casts'
import { computed, ref, toRef } from 'vue'
import { textToClipboard } from '@/helpers/clipboard'
const props = defineProps<{
  text: NumLike
  displayText?: NumLike
  title?: NumLike
}>()

const _text = toRef(props, 'text')
const _displayText = toRef(props, 'displayText')
const _title = toRef(props, 'title')

const displayValue = computed(() =>
  toStr((_displayText.value as NumLike) ?? _text.value),
)
const displayTitle = computed(() =>
  _title.value ? toStr(_title.value as NumLike) : null,
)

const isCopiedShown = ref(false)
const toClipboard = async () => {
  if (!_text.value) return
  try {
    await textToClipboard(String(_text.value))
    isCopiedShown.value = true
    setTimeout(() => {
      isCopiedShown.value = false
    }, 2000)
  } catch (error) {
    // noop
  }
}
</script>

<style scoped lang="scss">
.copy-text__btn-wrp {
  display: inline-block;
  position: relative;
  line-height: 1;
}

.copy-text__btn {
  height: 1.6rem;
  width: 1.6rem;
  vertical-align: text-bottom;
}

.copy-text__btn-copied-tip {
  position: absolute;
  bottom: calc(100% + 1rem);
  left: 50%;
  transform: translateX(-50%);
  padding: 0.4rem 0.8rem;
  border-radius: 0.8rem;
  background: var(--clr__tooltip-bg);
  color: var(--clr__tooltip-text);
  line-height: 1.25;

  &:before {
    content: '';
    display: block;
    width: 0.8rem;
    height: 0.8rem;
    position: absolute;
    bottom: -0.4rem;
    left: 50%;
    transform: translateX(-50%) rotate(45deg);
    background: var(--clr__tooltip-bg);
  }
}
body.dark {
  .copy-text__btn-copied-tip {
    background: var(--d-clr__tooltip-bg);
    color: var(--d-clr__tooltip-text);
    &:before {
      background: var(--d-clr__tooltip-bg);
    }
  }
}
</style>
