<template>
  <div class="sort-line">
    <div class="sort-line__search">
      <div class="sort-line__search-input-wrapper">
        <InputField
          v-model="searchValue"
          placeholder="Search by name"
          class="sort-line__search-input"
          @keydown.enter="inputChange()"
        />
        <template v-if="searchValue">
          <button @click="clearText()" class="sort-line__clear">
            <CancelIcon />
          </button>
        </template>
      </div>
      <button class="sort-line__search-button" @click="inputChange()">
        <SearchIcon />
      </button>
    </div>
    <div class="sort-line__selection">
      <div class="sort-line__selection-item">
        <span class="sort-line__selection-item-title">Sort By</span>
        <VuePicker
          class="sort-line__vue-picker _vue-picker"
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
      <div v-if="!wallet.isEmpty" class="sort-line__selection-item">
        <span class="sort-line__selection-item-title">{{ title }}</span>
        <VuePicker
          class="sort-line__vue-picker _vue-picker"
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

<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  sortingActivities,
  getSortingOwners,
  ACTIVITIES_SORT,
  OWNERS_SORT,
} from '@/helpers/sortingHelpers'
import { wallet } from '@/api/wallet'
import InputField from '@/components/fields/InputField.vue'
import { SearchIcon, CancelIcon } from '@/components/icons'

enum EVENTS {
  updateSortingOwnersValue = 'update:sortingOwnersValue',
  updateSortingActivitiesValue = 'update:sortingActivitiesValue',
  updateOracleScriptsName = 'update:oracleScriptsName',
}

defineProps<{
  oracleScriptsName: string
  sortingOwnersValue: string
  sortingActivitiesValue: string
  title: string
  isLoading: boolean
}>()

const emit = defineEmits<{
  (e: EVENTS.updateSortingOwnersValue, payload: string | undefined): void
  (e: EVENTS.updateSortingActivitiesValue, payload: string | undefined): void
  (e: EVENTS.updateOracleScriptsName, payload: string | undefined): void
}>()

const sortByActivites = ref(ACTIVITIES_SORT.latest)
const sortByOwners = ref(OWNERS_SORT.all)
const searchValue = ref('')
const walletAddress = wallet.isEmpty ? '' : wallet.account.address
const sortingOwners = ref(getSortingOwners(wallet.isEmpty, walletAddress))

const inputChange = () => {
  emit(EVENTS.updateOracleScriptsName, searchValue.value)
}

const updateSortingActivitiesValue = () => {
  emit(EVENTS.updateSortingActivitiesValue, sortByActivites.value)
}

const updateSortingOwnersValue = () => {
  emit(EVENTS.updateSortingOwnersValue, sortByOwners.value)
}

const clearText = (): void => {
  searchValue.value = ''
}

watch([sortByActivites], () => {
  updateSortingActivitiesValue()
})

watch([sortByOwners], () => {
  updateSortingOwnersValue()
})
</script>

<style scoped lang="scss">
.sort-line {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2.4rem;
}
.sort-line__selection {
  display: flex;
  gap: 2.4rem;
}
.sort-line__selection-item-title {
  font-size: 1.4rem;
  font-weight: 300;
  margin-right: 0.4rem;
}
.sort-line__search {
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
.sort-line__search-input-wrapper {
  position: relative;
  z-index: 0;
}
.sort-line__search-button {
  position: relative;
  width: 4.8rem;
  height: 4.8rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.sort-line__clear {
  overflow: visible;
  position: absolute;
  right: 0;
  top: 1.3rem;
}
.sort-line__search-input {
  padding-right: 2rem;
}
@include respond-to(tablet) {
  .sort-line {
    margin-bottom: 0;
    flex-direction: column;
  }
  .sort-line__search {
    margin-bottom: 1.6rem;
  }
  .sort-line__search-input-wrapper {
    width: 100%;
  }
  .sort-line__search-input {
    width: 100%;
  }
  .sort-line__selection {
    width: 100%;
    flex-direction: column;
    gap: 1.6rem;
  }

  .sort-line__selection-item {
    display: flex;
    flex-direction: column;
  }

  .sort-line__selection-item-title {
    margin: 0 0 0.4rem;
  }

  .sort-line__vue-picker {
    width: 100%;
  }
}
body.dark .sort-line__search {
  &:hover,
  &:active,
  &:focus,
  &:focus-within {
    color: var(--d-clr__text);
    border-color: var(--d-clr__text);
    svg {
      fill: var(--d-clr__text);
    }
  }
}
</style>
