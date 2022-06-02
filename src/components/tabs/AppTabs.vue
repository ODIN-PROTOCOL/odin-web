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

<script lang="ts">
import { defineComponent, ref, provide, computed, watch } from 'vue'

export default defineComponent({
  name: 'AppTabs',
  emits: ['changeTab'],
  setup: function (props, { slots, emit }) {
    const tabTitles = computed(() =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (slots as any)
        .default()
        .map((tab: { props: { title: never } }) => tab.props.title)
    )
    const selectedTitle = ref(tabTitles.value[0])

    watch([tabTitles], () => {
      selectedTitle.value = tabTitles.value[0]
    })
    const clickHandler = (title: string) => {
      selectedTitle.value = title
      emit('changeTab', title)
    }

    provide('selectedTitle', selectedTitle)

    return {
      selectedTitle,
      tabTitles,
      clickHandler,
    }
  },
})
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
  box-shadow: inset 0 -0.2rem 0 var(--clr__table-head);
  cursor: pointer;

  &.selected {
    font-weight: 600;
    box-shadow: inset 0px -2px 0px var(--clr__action);
  }
}
</style>
