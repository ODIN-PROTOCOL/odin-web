<template>
  <div class="app-tabs">
    <ul class="app-tabs__header">
      <li
        v-for="title in tabTitles"
        :key="title"
        class="app-tabs__header-item"
        :class="{ selected: title === selectedTitle }"
        @click="clickHandler(title)"
      >
        {{ title }}
      </li>
    </ul>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, provide, computed, watch, useSlots } from 'vue'
const slots = useSlots()
enum EVENTS {
  changeTab = 'change-tab',
}
const emit = defineEmits<{
  (e: EVENTS.changeTab, payload: string): void
}>()
const tabTitles = computed(() =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (slots as any)
    .default()
    .map((tab: { props: { title: never } }) => tab.props.title),
)
const selectedTitle = ref(tabTitles.value[0])

watch([tabTitles], () => {
  selectedTitle.value = tabTitles.value[0]
})

const clickHandler = (title: string) => {
  selectedTitle.value = title
  emit(EVENTS.changeTab, title)
}

provide('selectedTitle', selectedTitle)
</script>

<style lang="scss" scoped>
.app-tabs__header {
  display: flex;
  padding: 0;
  margin: 0 0 2.4rem 0;
  list-style: none;
  overflow: auto;
}
.app-tabs__header-item {
  padding: 1.2rem;
  font-size: 2rem;
  white-space: nowrap;
  border-bottom: 0.2rem solid var(--clr__table-head);
  cursor: pointer;

  &.selected {
    font-weight: 600;
    border-bottom: 0.2rem solid var(--clr__action);
  }
}
body.dark {
  .app-tabs__header-item {
    border-bottom: 0.2rem solid var(--d-clr__table-head);
    &.selected {
      border-bottom: 0.2rem solid var(--d-clr__action);
    }
  }
}
</style>
