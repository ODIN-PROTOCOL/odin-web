<template>
  <div class="app-tabs">
    <ul class="app-tabs__header">
      <li
        v-for="item in tabTitles"
        :key="item.key"
        class="app-tabs__header-item"
        :class="{ selected: item.key === selectedTitle }"
        @click="clickHandler(item.key)"
      >
        {{ item.title }}
      </li>
    </ul>
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, provide, computed, watch, onMounted } from 'vue'
import { Router, useRouter } from 'vue-router'

export default defineComponent({
  name: 'AppTabs',
  emits: ['changeTab'],
  props: { firstSelectedTitle: { type: String, default: '' } },
  setup(props, { slots, emit }) {
    const router: Router = useRouter()
    const { tab } = router.currentRoute.value.query
    const selectedTitle = ref('')
    const tabTitles = computed(() =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (slots as any).default().map((tab: any) => {
        return { title: tab.props.title, key: tab.props.titleKey }
      })
    )

    const clickHandler = (title: string) => {
      selectedTitle.value = title
      router.push({
        query: { page: 1, tab: title },
      })
      emit('changeTab', title)
    }

    const setSelectedTitle = () => {
      if (
        tab &&
        tabTitles.value.find(
          (item: { key: string }) => item.key === props.firstSelectedTitle
        )
      ) {
        selectedTitle.value = props.firstSelectedTitle
      } else {
        selectedTitle.value = tabTitles.value[0].key
      }
    }
    setSelectedTitle()

    provide('selectedTitle', selectedTitle)

    watch([tabTitles], () => {
      setSelectedTitle()
    })

    onMounted(() => {
      if (
        tab &&
        tabTitles.value.find((item: { key: string }) => item.key === tab)
      ) {
        selectedTitle.value = String(tab)
      } else {
        router.push({
          query: { page: 1, tab: tabTitles.value[0].key },
        })
      }
    })
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
  border-bottom: 0.2rem solid var(--clr__table-head);
  cursor: pointer;

  &.selected {
    font-weight: 600;
    border-bottom: 0.2rem solid var(--clr__action);
  }
}
</style>
