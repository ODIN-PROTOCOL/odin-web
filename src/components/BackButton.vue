<template>
  <div class="back-btn__wrapper">
    <button class="back-btn" @click.prevent="routerBack()">
      <img :src="settings && settings.theme === 'dark' ? require('@/assets/icons/white-arrow.svg') : require('@/assets/icons/back-arrow.svg')" alt="back" />
    </button>
    <button class="back-btn__mobile" @click.prevent="routerBack()">
      <img :src="settings && settings.theme === 'dark' ? require('@/assets/icons/white-arrow-small.svg') : require('@/assets/icons/back-arrow-small.svg')" alt="back" />
      <span>{{ text }}</span>
    </button>
  </div>
</template>

<script lang="ts">
import { Settings, SettingsStateSymbol } from '@/ThemeProvider';
import { defineComponent, inject } from 'vue'
import { Router, useRouter } from 'vue-router'

export default defineComponent({
  props: {
    text: { type: String, required: true },
  },
  setup: function () {
    const router: Router = useRouter()
    const settings: Settings | undefined = inject(SettingsStateSymbol);

    const routerBack = (): void => {
      router.back()
    }

    return { settings, routerBack }
  },
})
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
