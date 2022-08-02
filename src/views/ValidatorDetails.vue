<template>
  <div
    class="view-main validator-details"
    :class="delegation.balance ? 'validator-details--large-padding' : ''"
  >
    <div class="view-main__title-wrapper validator-details__title-wrapper">
      <BackButton text="Validators" class="validator-details__back-btn" />
      <h2 class="view-main__title validator-details__title">Validator</h2>
      <template v-if="validator">
        <div class="validator-details__validator-address">
          <p
            :title="validator.info.operatorAddress"
            class="view-main__subtitle validator-details__subtitle"
          >
            {{ validator.info.operatorAddress }}
          </p>
          <CopyButton
            :text="String(validator.info.operatorAddress)"
            class="mg-l8"
          />
        </div>
        <ValidatorStatus
          :width="14"
          :height="14"
          :status="validatorStatus"
          class="validator-details__validator-status"
        />
        <div
          v-if="delegation.balance"
          class="validator-details__activities validator-details__activities--top fx-sae"
        >
          <button
            @click="withdrawRewards(validator)"
            type="button"
            class="app-btn app-btn--small w-min150"
          >
            Claim rewards
          </button>
        </div>
      </template>
    </div>
    <template v-if="!isLoading && !isValidatorResponseLoading">
      <template v-if="validator">
        <ValidatorInfo
          :validator="validator"
          :delegation="delegation"
          @selectedBtn="openModal"
        />
        <AppTabs>
          <AppTab title="Oracle Reports">
            <OracleReportsTable :proposerAddress="operatorAddress" />
          </AppTab>
          <AppTab :title="delegatorsTitle">
            <DelegatorsTable :delegators="delegators" :is-loading="isLoading" />
          </AppTab>
          <AppTab title="Proposed Blocks">
            <ProposedBlocksTable :proposerAddress="operatorAddress" />
          </AppTab>
        </AppTabs>
      </template>
      <template v-else>
        <div class="app-table__empty-stub">
          <p class="empty mg-t32">Validator not found!</p>
        </div>
      </template>
    </template>
    <template v-else>
      <div class="app-table__empty-stub">
        <p class="empty mg-t32">Loading…</p>
      </div>
    </template>
    <div v-if="delegation.balance" class="view-main__mobile-activities">
      <div class="validator-details__activities">
        <div class="validator-details__activities-item">
          <button
            @click="withdrawRewards(validator)"
            type="button"
            class="validator-details__activities-btn app-btn"
          >
            Claim rewards
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'
import { callers } from '@/api/callers'
import { wallet } from '@/api/wallet'
import { DelegationResponse } from 'cosmjs-types/cosmos/staking/v1beta1/staking'
import BackButton from '@/components/BackButton.vue'
import CopyButton from '@/components/CopyButton.vue'
import AppTabs from '@/components/tabs/AppTabs.vue'
import AppTab from '@/components/tabs/AppTab.vue'
import ValidatorInfo from '@/components/ValidatorInfo.vue'
import OracleReportsTable from '@/components/tables/OracleReportsTable.vue'
import DelegatorsTable from '@/components/tables/DelegatorsTable.vue'
import ProposedBlocksTable from '@/components/tables/ProposedBlocksTable.vue'
import { isActiveValidator } from '@/helpers/validatorHelpers'
import ValidatorStatus from '@/components/ValidatorStatus.vue'

import { showDialogHandler } from '@/components/modals/handlers/dialogHandler'
import WithdrawRewardsFormModal from '@/components/modals/WithdrawRewardsFormModal.vue'
import DelegateFormModal from '@/components/modals/DelegateFormModal.vue'
import UndelegateFormModal from '@/components/modals/UndelegateFormModal.vue'
import RedelegateFormModal from '@/components/modals/RedelegateFormModal.vue'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'

import { useQuery } from '@vue/apollo-composable'
import { ValidatorQuery } from '@/graphql/queries'
import { ValidatorResponse } from '@/graphql/types'
import { ValidatorInfoModify } from '@/helpers/validatorHelpers'

const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
const route: RouteLocationNormalizedLoaded = useRoute()
const validator = ref<ValidatorInfoModify>()
const delegators = ref<DelegationResponse[]>([])

const delegation = ref<DelegationResponse>({})
const delegatorsTitle = computed(() =>
  delegators.value?.length
    ? `Delegators (${delegators.value?.length})`
    : 'Delegators',
)
const operatorAddress = ref('')
const { result, loading: isValidatorResponseLoading } =
  useQuery<ValidatorResponse>(ValidatorQuery, {
    address: String(route.params.address),
  })

const getValidator = async () => {
  lockLoading()
  try {
    if (result.value?.validator) {
      validator.value = {
        ...result.value.validator[0],
        isActive: await isActiveValidator(String(route.params.address)),
      }
      operatorAddress.value = validator.value.info.operatorAddress
    }
    await getDelegations()
  } catch (error) {
    handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
  }
  releaseLoading()
}

const validatorStatus = computed(() => {
  if (validator.value?.statuses[0].status === 3) {
    return validator.value.isActive ? 'success' : 'error'
  } else {
    return 'inactive'
  }
})

const getDelegators = async () => {
  const response = await callers.getValidatorDelegations(
    String(route.params.address),
  )
  if (response.delegationResponses) {
    delegators.value = response.delegationResponses
  }
}

const getDelegations = async () => {
  if (wallet.isEmpty) {
    return
  }
  lockLoading()
  try {
    const response = await callers.getDelegation(
      wallet.account.address,
      operatorAddress.value,
    )
    if (response.delegationResponse)
      delegation.value = response.delegationResponse
  } catch (error) {
    // error is ignored, since no delegations also throws the error
  }
  releaseLoading()
}

const loadData = async () => {
  await getValidator()
  await getDelegators()
}

const delegate = async (validator: ValidatorInfoModify) => {
  await showDialogHandler(
    DelegateFormModal,
    {
      onSubmit: async d => {
        d.kill()
        await loadData()
      },
    },
    {
      validator: validator,
      delegation: delegation.value,
    },
  )
}

const redelegate = async (validator: ValidatorInfoModify) => {
  await showDialogHandler(
    RedelegateFormModal,
    {
      onSubmit: async d => {
        d.kill()
        await loadData()
      },
    },
    {
      validator: validator,
      delegation: delegation.value,
    },
  )
}

const undelegate = async (validator: ValidatorInfoModify) => {
  if (!delegation.value.balance) return
  await showDialogHandler(
    UndelegateFormModal,
    {
      onSubmit: async d => {
        d.kill()
        await loadData()
      },
    },
    {
      validator: validator,
      delegation: delegation.value,
    },
  )
}

const withdrawRewards = async (validator: ValidatorInfoModify) => {
  if (!delegation.value.balance) return
  await showDialogHandler(
    WithdrawRewardsFormModal,
    {
      onSubmit: async d => {
        d.kill()
        await loadData()
      },
    },
    { validator: validator },
  )
}
const openModal = (event: {
  typeBtn: string
  validator: ValidatorInfoModify
}) => {
  if (event.typeBtn === 'Delegate') {
    delegate(event.validator)
  } else if (event.typeBtn === 'Regelate') {
    redelegate(event.validator)
  } else if (event.typeBtn === 'Claim rewards') {
    withdrawRewards(event.validator)
  } else if (event.typeBtn === 'Undelegate') {
    undelegate(event.validator)
  }
}
watch([isValidatorResponseLoading], async () => {
  await getValidator()
})

onMounted(async () => {
  await loadData()
})
</script>

<style lang="scss" scoped>
.validator-details__title-wrapper {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  margin-right: 2rem;
}
.validator-details__title {
  margin: 0 1.6rem 0 2rem;
}

.validator-details__subtitle {
  @include ellipsis();
  line-height: 4.6rem;
}

.validator-details__back-btn {
  height: 4.6rem;
}

.validator-details__validator-address {
  display: flex;
  min-width: 10%;
  margin-right: 1rem;
}

.validator-details__activities {
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
}

.validator-details__activities-item {
  display: flex;
  flex-direction: row;
  gap: 2.4rem;

  & > * {
    flex: 1;
  }
}
.validator-details__validator-status {
  margin-right: 2rem;
}
@include respond-to(tablet) {
  .validator-details {
    padding-bottom: 10rem;
  }
  .validator-details__title {
    margin: 0.8rem 0 0.4rem 0;
  }

  .validator-details__subtitle {
    line-height: 2.4rem;
  }

  .validator-details__back-btn {
    height: 2.4rem;
  }

  .validator-details__validator-address {
    width: 100%;
    margin: 0;
  }
  .validator-details__activities--top {
    display: none;
  }

  .validator-details--large-padding {
    padding-bottom: 17rem;
  }
  .validator-details__title-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-right: 0;
    margin-bottom: 3.2rem;
  }
  .validator-details__validator-status {
    margin-top: 1.2rem;
  }
}

@include respond-to(small) {
  .validator-details__activities-btn {
    font-size: 1.6rem;
  }
}
</style>
