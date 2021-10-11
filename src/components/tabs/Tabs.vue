<template>
  <div class="tabs">
    <ul class="tabs__header">
      <li
        v-for="title in tabTitles"
        :key="title"
        :class="{ selected: title == selectedTitle }"
        @click="selectedTitle = title"
      >
        {{ title }}
      </li>
    </ul>
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, provide } from 'vue'

export default defineComponent({
  setup: function (props, { slots }) {
    const tabTitles = ref(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (slots as any)
        .default()
        .map((tab: { props: { title: never } }) => tab.props.title)
    )
    const selectedTitle = ref(tabTitles.value[0])

    provide('selectedTitle', selectedTitle)
    return {
      selectedTitle,
      tabTitles,
    }
  }
})
</script>

<style lang="scss" scoped>
.tabs {
  &__header {
    display: flex;
    padding: 0;
    margin: 0 0 2.4rem 0;
    list-style: none;

    li {
      padding: 1.2rem 2.4rem;
      font-size: 2rem;
      box-shadow: inset 0px -2px 0px rgba(0, 123, 255, 0.16);
      cursor: pointer;

      &.selected {
        font-weight: 600;
        box-shadow: inset 0px -2px 0px var(--clr__action);
      }
    }
  }
}
</style>
