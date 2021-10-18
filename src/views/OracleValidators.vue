<template>
  <div class="oracle-validators view-main">
    <div class="page-title">
      <h2 class="view-title">Oracle validators</h2>
    </div>

    <div class="app-table">
      <div class="app-table__head">
        <span>Moniker</span>
        <span>Is active</span>
        <span>Validator address</span>
        <span>Validator since</span>
      </div>
      <div class="table__body">
        <template v-if="validators.length">
          <div
            v-for="item in filteredValidators"
            :key="item.operatorAddress"
            class="app-table__row"
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
              <span>{{ $fDate(item.commission.updateTime) }}</span>
            </div>
          </div>
        </template>
      </div>

      <template v-if="validatorsCount > ITEMS_PER_PAGE">
        <Pagination
          @changePageNumber="paginationHandler($event)"
          :blocksPerPage="ITEMS_PER_PAGE"
          :total-length="validatorsCount"
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
import Pagination from '@/components/pagination/pagination.vue'

export default defineComponent({
  components: { TitledLink, CopyButton, StatusBlock, Pagination },
  setup() {
    const ITEMS_PER_PAGE = 5
    const currentPage = ref(1)
    const validatorsCount = ref(0)
    const validators = ref<ValidatorDecoded[]>([])
    const filteredValidators = ref()

    const getOracleValidators = async () => {
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
      filterValidators(currentPage.value)
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
      validatorsCount,
      validators,
      filteredValidators,
      paginationHandler,
    }
  },
})
</script>

<style lang="scss" scoped>
.app-table__head,
.app-table__row {
  grid:
    auto /
    minmax(10rem, 1fr) minmax(10rem, 1fr) minmax(10rem, 1fr) minmax(10rem, 0.1fr);
}

@media screen and (max-width: 768px) {
  .app-table__row {
    grid: none;
  }
}
</style>
