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

<script lang="ts">
import { defineComponent } from 'vue'
import { Router, useRouter } from 'vue-router'

export default defineComponent({
  props: {
    text: { type: String, required: true },
  },
  setup: function () {
    const router: Router = useRouter()

    const routerBack = (): void => {
      router.back()
    }

    return { routerBack }
  },
})
</script>

<style lang="scss" scoped>
.back-btn {
  &__wrapper {
    display: flex;
    align-items: center;
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
