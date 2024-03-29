<template>
  <div class="sort-line">
    <div class="sort-line__search">
      <div class="sort-line__search-input-wrapper">
        <InputField
          class="sort-line__search-input"
          placeholder="Search by name"
          v-model="searchValue"
          @keydown.enter="inputChange()"
        />
        <template v-if="searchValue">
          <button class="sort-line__clear" @click="clearText()">
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
        <span class="sort-line__selection-item-title">Sort by:</span>
        <VuePicker
          class="sort-line__vue-picker sort-line__vue-picker--activites _vue-picker"
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
        <span class="sort-line__selection-item-title">{{ title }}:</span>
        <VuePicker
          class="sort-line__vue-picker sort-line__vue-picker--owners _vue-picker"
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
import { CancelIcon, SearchIcon } from '@/components/icons'

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

const clearText = (): void => {
  searchValue.value = ''
}

const inputChange = () => {
  emit(EVENTS.updateOracleScriptsName, searchValue.value)
}

const updateSortingActivitiesValue = () => {
  emit(EVENTS.updateSortingActivitiesValue, sortByActivites.value)
}

const updateSortingOwnersValue = () => {
  emit(EVENTS.updateSortingOwnersValue, sortByOwners.value)
}

watch([sortByActivites], () => {
  updateSortingActivitiesValue()
})

watch([sortByOwners], () => {
  updateSortingOwnersValue()
})
</script>

<style lang="scss" scoped>
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
  color: var(--clr__search-icon);
  background-color: var(--clr__vue-picker-bg);

  svg > path {
    fill: var(--clr__search-icon);
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

.sort-line__vue-picker {
  margin-left: 1rem;
}

.sort-line__vue-picker--activites {
  width: 16rem;
}

.sort-line__vue-picker--owners {
  width: 7rem;
}

@include respond-to(tablet) {
  .sort-line {
    margin-bottom: 2rem;
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
    margin-left: 0;
  }
}
</style>
