<template>
  <div class="view-main">
    <div class="view-main__title-wrapper">
      <h2 class="view-main__title">Oracle validators</h2>
    </div>

    <div class="app-table oracle-validators__table">
      <div class="app-table__head oracle-validators__table-head">
        <span>Validator</span>
        <span>Is active</span>
        <span>Validator address</span>
        <span>Validator since</span>
      </div>
      <div class="table__body">
        <template v-if="validators.length">
          <div
            v-for="item in filteredValidators"
            :key="item.operatorAddress"
            class="app-table__row oracle-validators__table-row"
          >
            <div class="app-table__cell">
              <span class="app-table__title">Validator</span>
              <TitledLink
                class="app-table__cell-txt app-table__link"
                :text="item.description.moniker"
                :to="`/validators/${item.operatorAddress}`"
              />
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Is active</span>
              <StatusBlock
                :status="item.isActive ? 'success' : 'error'"
                :text="item.isActive ? 'Active' : 'Inactive'"
              />
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Validator address</span>
              <span class="app-table__cell-txt" :title="item.operatorAddress">
                {{ item.operatorAddress }}
              </span>
              <CopyButton :text="item.operatorAddress" />
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Validator since</span>
              <span>
                {{
                  $fDate(item.commission.updateTime.seconds, 'HH:mm dd.MM.yy')
                }}
              </span>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="app-table__empty-stub">
            <p v-if="isLoading">Loading…</p>
            <p v-else>No items yet</p>
          </div>
        </template>
      </div>

      <template v-if="validatorsCount > ITEMS_PER_PAGE">
        <AppPagination
          class="mg-t32 mg-b32"
          v-model="currentPage"
          :pages="totalPages"
          @update:modelValue="paginationHandler"
        />
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { callers } from '@/api/callers'
import {
  isActiveValidator,
  isOracleValidator,
} from '@/helpers/validatorHelpers'
import { ValidatorDecoded } from '@/helpers/validatorDecoders'
import TitledLink from '@/components/TitledLink.vue'
import CopyButton from '@/components/CopyButton.vue'
import StatusBlock from '@/components/StatusBlock.vue'
import AppPagination from '@/components/AppPagination/AppPagination.vue'
import { handleError } from '@/helpers/errors'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'

export default defineComponent({
  components: { TitledLink, CopyButton, StatusBlock, AppPagination },
  setup() {
    const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
    const ITEMS_PER_PAGE = 50
    const currentPage = ref(1)
    const totalPages = ref(0)
    const validatorsCount = ref(0)
    const validators = ref<ValidatorDecoded[]>([])
    const filteredValidators = ref()

    const getOracleValidators = async () => {
      lockLoading()
      try {
        const response = await callers.getValidators('BOND_STATUS_BONDED')
        const oracleValidators = response.validators.filter(async (item) => {
          if (await isOracleValidator(item.operatorAddress)) return true
          return false
        })

        validatorsCount.value = oracleValidators.length
        validators.value = await Promise.all(
          oracleValidators.map(async (item) => {
            return {
              ...item,
              isActive: await isActiveValidator(item.operatorAddress),
            }
          })
        )
        totalPages.value = Math.ceil(validatorsCount.value / ITEMS_PER_PAGE)
        filterValidators(currentPage.value)
      } catch (error) {
        handleError(error as Error)
      }
      releaseLoading()
    }

    const filterValidators = (newPage: number) => {
      let tempArr = validators.value

      if (newPage === 1) {
        filteredValidators.value = tempArr.slice(0, newPage * ITEMS_PER_PAGE)
      } else {
        filteredValidators.value = tempArr.slice(
          (newPage - 1) * ITEMS_PER_PAGE,
          (newPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
        )
      }
      currentPage.value = newPage
    }

    const paginationHandler = (num: number) => {
      filterValidators(num)
    }

    onMounted(async () => {
      await getOracleValidators()
    })

    return {
      ITEMS_PER_PAGE,
      currentPage,
      totalPages,
      isLoading,
      validatorsCount,
      validators,
      filteredValidators,
      paginationHandler,
    }
  },
})
</script>

<style lang="scss" scoped>
.oracle-validators {
  &__table-head,
  &__table-row {
    grid:
      auto /
      minmax(10rem, 0.7fr) minmax(10rem, 0.5fr) minmax(10rem, 2fr) minmax(10rem, 0.1fr);
  }
}
@include respond-to(tablet) {
  .oracle-validators {
    &__table-head,
    &__table-row {
      grid: none;
    }
  }
}
</style>
