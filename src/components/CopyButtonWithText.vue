<template>
  <div class="copy-btn-with-text__wrapper">
    <button
      class="copy-btn-with-text app-btn_small w-min150"
      type="button"
      @click.prevent="copy()"
    >
      <img
        class="copy-btn-with-text__img"
        src="@/assets/icons/copy.svg"
        alt="copy"
      />
      <span class="copy-btn-with-text__text">{{ text }}</span>
    </button>
    <div v-show="isCopiedShown" class="copy-btn-with-text__message">
      Copied!
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { copyValue } from '@/helpers/helpers'

export default defineComponent({
  props: {
    value: { type: String, required: true },
    text: { type: String, required: true },
  },
  setup: function (props) {
    const isCopiedShown = ref(false)

    const copy = () => {
      copyValue(props.value)
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
.copy-btn-with-text {
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: var(--clr__main-bg);
  color: var(--clr__action);
  border: 1px solid var(--clr__btn-normal);

  &__wrapper {
    display: flex;
    align-items: flex-end;
    flex-direction: column;
    margin-bottom: 2rem;
    position: relative;
  }

  &__message {
    position: absolute;
    bottom: 120%;
    right: -5%;
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
  .copy-btn-with-text {
    justify-content: center;
    &__img {
      margin-right: 1rem;
    }
    &__wrapper {
      flex: 1;
      align-items: stretch;
    }
    &__message {
      transform: translateX(-100%);
      &:before {
        transform: translateX(-90%) rotate(45deg);
      }
    }
  }
}
</style>
