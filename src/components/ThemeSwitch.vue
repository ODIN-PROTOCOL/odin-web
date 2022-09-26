<template>
  <div class="theme-switch">
    <button
      class="theme-switch__btn"
      :class="{ 'theme-switch__btn--active': !isLight }"
      :disabled="!isLight"
      @click="toggleTheme(ThemeMode.Dark)"
    >
      <theme-dark-icon />
    </button>
    <button
      class="theme-switch__btn"
      :class="{ 'theme-switch__btn--active': isLight }"
      :disabled="isLight"
      @click="toggleTheme(ThemeMode.Light)"
    >
      <theme-light-icon />
    </button>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { ThemeDarkIcon, ThemeLightIcon } from '@/components/icons'
import { ThemeMode } from '@/helpers/theme'

const props = defineProps<{ theme: string; toggleTheme }>()

const isLight = computed(() => {
  return props.theme === ThemeMode.Light
})
</script>

<style lang="scss" scoped>
.theme-switch {
  display: flex;
  background-color: var(--clr__theme-switch-bg);
  border-radius: 3.2rem;
}

.theme-switch__btn {
  width: 3.2rem;
  height: 3.2rem;
  margin: 0.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;

  &:first-child {
    margin-right: 0;
  }

  &::v-deep path {
    fill: var(--clr__theme-switch-txt);
  }
}

.theme-switch__btn--active {
  background-color: var(--clr__theme-switch-active-bg);

  &::v-deep path {
    fill: var(--clr__theme-switch-active-txt);
  }
}
</style>
