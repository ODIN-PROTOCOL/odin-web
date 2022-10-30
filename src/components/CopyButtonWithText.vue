<template>
  <div class="copy-button-with-text__wrapper" :class="modalBaseScheme">
    <button
      class="copy-button-with-text app-btn--medium"
      type="button"
      @click.prevent="copy()"
    >
      <CopyIcon class="copy-button-with-text__copy-icon" />
      <span class="copy-button-with-text__text">{{ text }}</span>
    </button>
    <div v-show="isCopiedShown" class="copy-button-with-text__message">
      Copied!
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { copyValue } from '@/helpers/helpers'
import { CopyIcon } from '@/components/icons'

enum SCHEMES {
  noBorder = 'no-border',
}
const props = withDefaults(
  defineProps<{
    scheme?: string
    text: string
    value: string
  }>(),
  { scheme: '' },
)

const isCopiedShown = ref(false)

const copy = () => {
  copyValue(props.value)
  isCopiedShown.value = true
  setTimeout(() => {
    isCopiedShown.value = false
  }, 1300)
}

const modalBaseScheme = computed(() => {
  const scheme = props.scheme as SCHEMES
  if (!Object.values(SCHEMES).includes(scheme)) return ''
  return scheme ? `copy-button-with-text__wrapper--${scheme}` : ''
})
</script>

<style lang="scss" scoped>
.copy-button-with-text {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--clr__main-bg);
  color: var(--clr__action);
  border: 1px solid var(--clr__btn-normal);
  border-radius: 0.4rem;
  &:hover {
    color: var(--clr__action-disabled);
    .copy-button-with-text__copy-icon {
      fill: var(--clr__action-disabled);
    }
    border-color: var(--clr__action-disabled);
  }
}
.copy-button-with-text__wrapper {
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  margin-bottom: 2rem;
  position: relative;
  &--no-border {
    margin-bottom: 0;
    .copy-button-with-text {
      border: none;
    }
    .copy-button-with-text__message {
      right: -25%;
      font-size: 1.6rem;
      line-height: 2.4rem;
      padding: 1.2rem;
    }
  }
}
.copy-button-with-text__copy-icon {
  margin-right: 1rem;
}
.copy-button-with-text__message {
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

@media screen and (max-width: 768px) {
  .copy-button-with-text {
    width: 100%;
    padding: 0 2rem;
  }
  .copy-button-with-text__copy-icon {
    margin-right: 1rem;
  }
  .copy-button-with-text__message {
    &:before {
      transform: translateX(-90%) rotate(45deg);
    }
  }
}
</style>
