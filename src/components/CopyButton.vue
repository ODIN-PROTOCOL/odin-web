<template>
  <div class="copy-button__wrapper" :class="modalBaseScheme">
    <button class="copy-button" @click.prevent="copy()">
      <CopyIcon class="copy-button__copy-icon" />
    </button>
    <div v-show="isCopiedShown" class="copy-button__message">Copied!</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { copyValue } from '@/helpers/helpers'
import CopyIcon from '@/components/icons/CopyIcon.vue'

enum SCHEMES {
  black = 'black',
}

const props = withDefaults(
  defineProps<{
    scheme?: string
    text: string
  }>(),
  { scheme: '' },
)

const isCopiedShown = ref(false)

const copy = () => {
  copyValue(props.text)
  isCopiedShown.value = true
  setTimeout(() => {
    isCopiedShown.value = false
  }, 1300)
}

const modalBaseScheme = computed(() => {
  const scheme = props.scheme as SCHEMES
  if (!Object.values(SCHEMES).includes(scheme)) return ''
  return scheme ? `copy-button__wrapper--${scheme}` : ''
})
</script>

<style lang="scss" scoped>
.copy-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 50%;
  &:hover {
    background: var(--clr__action-disabled);
  }
}
.copy-button__wrapper {
  position: relative;
  display: flex;
  align-items: center;
  padding-left: 0.4rem;
  &--black {
    .copy-button__copy-icon {
      fill: var(--clr__text);
    }
  }
}
.copy-button__message {
  position: absolute;
  bottom: 130%;
  left: 50%;
  transform: translateX(-50%);
  padding: 1.2rem 2.4rem;
  background: var(--clr__tooltip-bg);
  border-radius: 0.8rem;
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
  .copy-button__message {
    left: 100%;
    transform: translateX(-100%);
    &:before {
      left: 90%;
      transform: translateX(-90%) rotate(45deg);
    }
  }
}
</style>
