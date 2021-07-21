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
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"
        />
      </svg>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import Input from '@/components/inputs/Input.vue'

type Data = {
  isOpen: boolean
  searchValue: null | string
}

export default defineComponent({
  components: { Input },
  setup() {
    const data = reactive<Data>({
      isOpen: false,
      searchValue: null,
    })
    // TODO: close search field?
    const searchClick = (value: string | null) => console.log(value)

    const openAndSearch = (event: Event | MouseEvent) => {
      event.preventDefault()
      if (!data.isOpen) data.isOpen = true
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
    z-index: 1;
  }
  &__button {
    position: relative;
    z-index: 2;
    width: 48px;
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid var(--clr__action);
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.5s ease;
    svg {
      fill: var(--clr__action);
    }
    &:hover,
    &--open {
      background: var(--clr__action);
      border-radius: 0 4px 4px 0;
      svg {
        fill: white;
      }
    }
  }
}
</style>
