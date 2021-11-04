<template>
  <div class="copy-btn__wrapper">
    <button class="copy-btn" @click.prevent="copy()">
      <img src="@/assets/icons/copy.svg" alt="copy" />
    </button>
    <div v-show="isCopiedShown" class="copy-btn__message">Copied!</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { copyValue } from '@/helpers/helpers'

export default defineComponent({
  props: {
    text: { type: String, required: true },
  },
  setup: function (props) {
    const isCopiedShown = ref(false)

    const copy = () => {
      copyValue(props.text)
      isCopiedShown.value = true
      setTimeout(() => {
        isCopiedShown.value = false
      }, 1300)
    }

    return { copy, isCopiedShown }
  },
})
</script>

<style lang="scss" scoped>
.copy-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 50%;

  &__wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  &__message {
    position: absolute;
    bottom: 130%;
    left: 50%;
    transform: translateX(-50%);
    padding: 1.2rem 2.4rem;
    background: var(--clr__tooltip-bg);
    border-radius: 8px;
    color: var(--clr__tooltip-text);

    &:before {
      content: '';
      display: block;
      width: 0.6rem;
      height: 0.6rem;
      position: absolute;
      bottom: -0.3rem;
      left: 50%;
      transform: translateX(-50%) rotate(45deg);
      background: var(--clr__tooltip-bg);
    }
  }

  &:hover {
    background: var(--clr__action-disabled);
  }
}

@media screen and (max-width: 768px) {
  .copy-btn {
    &__message {
      left: 100%;
      transform: translateX(-100%);

      &:before {
        left: 90%;
        transform: translateX(-90%) rotate(45deg);
      }
    }
  }
}
</style>
