<template>
  <div class="copy-button__wrapper">
    <button class="copy-button" @click.prevent="copy()">
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10.6667 0.666667H2.66667C1.93333 0.666667 1.33333 1.26667 1.33333 2V11.3333H2.66667V2H10.6667V0.666667ZM12.6667 3.33333H5.33333C4.6 3.33333 4 3.93333 4 4.66667V14C4 14.7333 4.6 15.3333 5.33333 15.3333H12.6667C13.4 15.3333 14 14.7333 14 14V4.66667C14 3.93333 13.4 3.33333 12.6667 3.33333ZM12.6667 14H5.33333V4.66667H12.6667V14Z"
          fill="#6274ff"
        />
      </svg>
    </button>
    <div v-show="isCopiedShown" class="copy-button__message">Copied!</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { copyValue } from '@/helpers/helpers'

const props = defineProps<{
  text: string
}>()

const isCopiedShown = ref(false)

const copy = () => {
  copyValue(props.text)
  isCopiedShown.value = true
  setTimeout(() => {
    isCopiedShown.value = false
  }, 1300)
}
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
    background: var(--clr__azureish-white);
  }
}

.copy-button__wrapper {
  position: relative;
  display: flex;
  align-items: center;
  padding-left: 0.4rem;
}

.copy-button__message {
  position: absolute;
  bottom: 130%;
  left: 50%;
  transform: translateX(-50%);
  padding: 1.2rem 2.4rem;
  background: var(--clr__secondary);
  border-radius: 0.8rem;
  color: var(--clr__white);
  font-size: 1.6rem;

  &:before {
    content: '';
    display: block;
    width: 0.6rem;
    height: 0.6rem;
    position: absolute;
    bottom: -0.3rem;
    left: 50%;
    transform: translateX(-50%) rotate(45deg);
    background: var(--clr__secondary);
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
