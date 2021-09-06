<template>
  <div class="search">
    <transition name="slide-fade">
      <div class="search__input" v-if="data.isOpen">
        <Input v-model="data.searchValue" placeholder="Search" />
      </div>
    </transition>
    <button
      class="search__button"
      @click="openAndSearch($event)"
      :class="{ 'search__button--open': data.isOpen }"
    >
      <SearchIcon />
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import Input from '@/components/inputs/Input.vue'
import SearchIcon from '@/components/icons/SearchIcon.vue'

type Data = {
  isOpen: boolean
  searchValue: null | string
}

export default defineComponent({
  components: { Input, SearchIcon },
  setup() {
    const data = reactive<Data>({
      isOpen: false,
      searchValue: null,
    })
    // TODO: close search field?
    const searchClick = (value: string | null) => console.log(value)

    const openAndSearch = (event: Event | MouseEvent) => {
      event.preventDefault()
      if (!data.isOpen) {
        data.isOpen = true
        return
      }
      searchClick(data.searchValue)
    }

    return { openAndSearch, data }
  },
})
</script>

<style scoped lang="scss">
.search {
  display: flex;
  align-items: center;
  &__input {
    position: relative;
    z-index: 0;
  }
  &__button {
    position: relative;
    width: 4.8rem;
    height: 4.8rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 0.1rem solid var(--clr__action);
    border-radius: 0.4rem;
    cursor: pointer;
    transition: all 0.5s ease;
    svg {
      fill: var(--clr__action);
    }
    &:hover,
    &--open {
      background: var(--clr__action);
      border-radius: 0 0.4rem 0.4rem 0;
      svg {
        fill: white;
      }
    }
  }
}
@media (max-width: 768px) {
  .search {
    display: none;
  }
}
</style>
