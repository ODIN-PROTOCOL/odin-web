<template>
  <div class="app__main-view validator-item">
    <div class="app__main-view-detail-container">
      <div class="app__main-view-detail-back-icon">
        <BackButton />
      </div>
      <div class="app__main-view-detail-title-container">
        <h2 class="app__main-view-detail-title">Validator</h2>
        <div
          v-if="operatorAddress"
          class="app__main-view-detail-subtitle-container"
        >
          <span class="app__main-view-detail-subtitle">
            {{ operatorAddress }}
          </span>
          <CopyButton class="mg-l8" :text="operatorAddress" />
          <Tag
            class="validator-item__status"
            text="Oracle"
            :type="oracleStatus"
          />
        </div>
      </div>
    </div>
    <template v-if="isFinishLoading">
      <template v-if="isLoadingError || !isValidatorResponseLoadingError">
        <div class="app-table__empty-stub">
          <ui-loading-error-message message="Not Found" title="404" />
        </div>
      </template>
      <template v-else>
        <template v-if="validator">
          <ValidatorInfo :validator="validator" />
          <AppTabs>
            <AppTab title="Oracle Reports">
              <OracleReportsTable :proposer-address="validatorAddress" />
            </AppTab>
            <AppTab :title="delegatorsTitle">
              <DelegatorsTable
                :delegators="delegators"
                :is-loading="isLoading"
              />
            </AppTab>
            <AppTab title="Proposed Blocks">
              <ProposedBlocksTable :proposer-address="validatorAddress" />
            </AppTab>
          </AppTabs>
        </template>
        <template v-else>
          <div class="app-table__empty-stub">
            <ui-no-data-message />
          </div>
        </template>
      </template>
    </template>
    <template v-else>
      <div class="app-table__empty-stub">
        <ui-loader positionCenter message="Loading" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'
import { callers } from '@/api/callers'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import { DelegationResponse } from 'cosmjs-types/cosmos/staking/v1beta1/staking'
import {
  isActiveValidator,
  getValidatorStatus,
  ValidatorInfoModify,
  VALIDATOR_STATUS,
} from '@/helpers/validatorHelpers'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import { useQuery } from '@vue/apollo-composable'
import { ValidatorQuery } from '@/graphql/queries'
import { ValidatorResponse } from '@/graphql/types'
import {
  UiLoadingErrorMessage,
  UiLoader,
  UiNoDataMessage,
} from '@/components/ui'
import BackButton from '@/components/BackButton.vue'
import CopyButton from '@/components/CopyButton.vue'
import AppTabs from '@/components/tabs/AppTabs.vue'
import AppTab from '@/components/tabs/AppTab.vue'
import Tag from '@/components/Tag.vue'
import ValidatorInfo from '@/components/ValidatorInfo.vue'
import OracleReportsTable from '@/components/tables/OracleReportsTable.vue'
import DelegatorsTable from '@/components/tables/DelegatorsTable.vue'
import ProposedBlocksTable from '@/components/tables/ProposedBlocksTable.vue'

const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
const isLoadingError = ref(false)
const route: RouteLocationNormalizedLoaded = useRoute()
const validator = ref<ValidatorInfoModify>()
const delegators = ref<DelegationResponse[]>([])
const delegatorsTitle = computed(() =>
  delegators.value?.length
    ? `Delegators (${delegators.value?.length})`
    : 'Delegators',
)
const operatorAddress = ref('')
const validatorAddress = ref('')
const oracleStatus = ref('')

const { result, loading: isValidatorResponseLoading } =
  useQuery<ValidatorResponse>(ValidatorQuery, {
    address: String(route.params.address),
  })

const isValidatorResponseLoadingError = computed(
  () => result.value?.validator.length,
)

const isFinishLoading = computed(
  () =>
    !(
      isLoading.value ||
      isValidatorResponseLoading.value ||
      !result.value?.validator
    ),
)

const getValidator = async () => {
  lockLoading()
  const defaultStatus = {
    status: VALIDATOR_STATUS.bounding,
    height: 0,
    jailed: true
  }
  try {
    if (result.value?.validator) {
      validator.value = {
        ...result.value.validator[0],
        isActive: await isActiveValidator(String(route.params.address)),
        status: result.value.validator[0].statuses.length ? result.value.validator[0] : defaultStatus
      }
  
      operatorAddress.value = validator.value.info.operatorAddress
      validatorAddress.value = validator.value.info.validatorAddress      
      oracleStatus.value = getValidatorStatus(validator.value.status, validator.value.isActive || false)    
    }
  } catch (error) {
    isLoadingError.value = true
    handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
  }
  releaseLoading()
}

const getDelegators = async () => {
  lockLoading()
  try {
    const response = await callers.getValidatorDelegations(
      String(route.params.address),
    )
    if (response.delegationResponses) {
      delegators.value = response.delegationResponses
    }
  } catch (error) {
    isLoadingError.value = true
    handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
  }
  releaseLoading()
}

watch([isValidatorResponseLoading], async () => {
  await getValidator()
})

onMounted(async () => {
  await getValidator()
  await getDelegators()
})
</script>

<style lang="scss" scoped>
.app__main-view-detail-subtitle-container {
  align-items: center;
}

.validator-item__status {
  margin-left: 1rem;
}
</style>
