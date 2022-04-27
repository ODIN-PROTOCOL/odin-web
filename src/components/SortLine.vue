<template>
  <div class="sort-row">
    <div class="sort-row__search">
      <div class="sort-row__search-input-wrapper">
        <InputField
          v-model="searchValue"
          placeholder="Search"
          class="sort-row__search-input"
          @keydown.enter="inputChange()"
        />
      </div>

      <button class="sort-row__search-button" @click="inputChange()">
        <SearchIcon />
      </button>
    </div>
    <div class="sort-row__selection">
      <div class="sort-row__selection-item">
        <span class="sort-row__selection-item-title">Sort by</span>
        <VuePicker
          class="sort-row__vue-picker _vue-picker"
          name="filter"
          :isDisabled="isLoading"
          v-model="sortByActivites"
        >
          <template #dropdownInner>
            <div class="_vue-picker__dropdown-custom">
              <VuePickerOption
                v-for="{ text, value } in sortingActivities"
                :key="text"
                :value="value"
                :text="text"
              >
                {{ text }}
              </VuePickerOption>
            </div>
          </template>
        </VuePicker>
      </div>
      <div class="sort-row__selection-item">
        <span class="sort-row__selection-item-title">{{ title }}</span>
        <VuePicker
          class="sort-row__vue-picker _vue-picker"
          name="filter"
          :isDisabled="isLoading"
          v-model="sortByOwners"
        >
          <template #dropdownInner>
            <div class="_vue-picker__dropdown-custom">
              <VuePickerOption
                v-for="{ text, value } in sortingOwners"
                :key="text"
                :value="value"
                :text="text"
              >
                {{ text }}
              </VuePickerOption>
            </div>
          </template>
        </VuePicker>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import InputField from '@/components/fields/InputField.vue'
import SearchIcon from '@/components/icons/SearchIcon.vue'
import {
  sortingActivities,
  sortingOwners,
  ACTIVITIES_SORT,
  OWNERS_SORT,
} from '@/helpers/sortingHelpers'

export default defineComponent({
  components: { InputField, SearchIcon },
  props: {
    oracleScriptsName: { type: String, required: true },
    sortingOwnersValue: { type: String, required: true },
    sortingActivitiesValue: { type: String, required: true },
    isLoading: { type: Boolean, required: true },
    title: { type: String, required: true },
  },
  setup(props, { emit }) {
    const sortByActivites = ref(ACTIVITIES_SORT.LATEST)
    const sortByOwners = ref(OWNERS_SORT.ALL)
    const searchValue = ref('')

    const inputChange = () => {
      emit('update:oracleScriptsName', searchValue.value)
    }
    const updateSortingActivitiesValue = () => {
      emit('update:sortingActivitiesValue', sortByActivites.value)
    }
    const updateSortingOwnersValue = () => {
      emit('update:sortingOwnersValue', sortByOwners.value)
    }

    watch([sortByActivites], () => {
      updateSortingActivitiesValue()
    })
    watch([sortByOwners], () => {
      updateSortingOwnersValue()
    })

    return {
      inputChange,
      updateSortingOwnersValue,
      updateSortingActivitiesValue,
      sortingActivities,
      sortingOwners,
      sortByActivites,
      sortByOwners,
      searchValue,
    }
  },
})
</script>

<style scoped lang="scss">
.sort-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2.4rem;
  &__selection {
    display: flex;
    gap: 2.4rem;
  }
  &__selection-item-title {
    font-size: 1.4rem;
    font-weight: 300;
    margin-right: 0.4rem;
  }
  &__search {
    display: flex;
    align-items: center;
    border-bottom: 0.1rem solid var(--clr__input-border);
    transition: all 0.5s ease;
    color: var(--clr__input-border);
    svg {
      transition: all 0.5s ease;
      fill: var(--clr__input-border);
    }
    &:hover,
    &:active,
    &:focus,
    &:focus-within {
      color: var(--clr__text);
      border-color: var(--clr__text);
      svg {
        fill: var(--clr__text);
      }
    }
    &:disabled {
      border-color: var(--clr__input-border);
      color: var(--clr__input-border);
      svg {
        fill: var(--clr__input-border);
      }
    }
  }
  &__search-input-wrapper {
    position: relative;
    z-index: 0;
  }
  &__search-input {
    border: none;
    &:focus::-webkit-input-placeholder {
      color: transparent;
    }
    &:active,
    &:hover,
    &:focus {
      border: none;
    }
  }
  &__search-button {
    position: relative;
    width: 4.8rem;
    height: 4.8rem;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
}
@include respond-to(tablet) {
  .sort-row {
    margin-bottom: 0;
    flex-direction: column;
    &__search {
      margin-bottom: 1.6rem;
    }
    &__search-input-wrapper {
      width: 100%;
    }
    &__search-input {
      width: 100%;
    }
    &__selection {
      width: 100%;
      flex-direction: column;
      gap: 1.6rem;
    }

    &__selection-item {
      display: flex;
      flex-direction: column;
    }

    &__selection-item-title {
      margin: 0 0 0.4rem;
    }

    &__vue-picker {
      width: 100%;
    }
  }
}
</style>
