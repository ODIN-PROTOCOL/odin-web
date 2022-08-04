<template>
  <div class="back-btn__wrapper">
    <button class="back-btn" @click.prevent="routerBack()">
      <img src="@/assets/icons/back-arrow.svg" alt="back" />
    </button>
    <button class="back-btn__mobile" @click.prevent="routerBack()">
      <img src="@/assets/icons/back-arrow-small.svg" alt="back" />
      <span>{{ text }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { Router, useRouter } from 'vue-router'
import { ROUTE_NAMES } from '@/enums'

withDefaults(
  defineProps<{
    text?: string
  }>(),
  { text: '' },
)

const router: Router = useRouter()

const routerBack = (): void => {
  if (router.options.history.state.back) {
    router.back()
  } else {
    router.push({ name: ROUTE_NAMES.app })
  }
}
</script>

<style lang="scss" scoped>
.back-btn {
  &__wrapper {
    display: flex;
    align-items: center;
    min-width: 1.6rem;
  }

  @media screen and (max-width: 768px) {
    display: none;
  }

  &__mobile {
    display: none;
    color: var(--clr__action);

    @media screen and (max-width: 768px) {
      display: flex;
      align-items: center;
    }
  }
}
</style>
