<template>
  <div
    class="view-main validators-item"
    :class="
      delegations[validator?.operatorAddress]
        ? 'validators-item--large-padding'
        : ''
    "
  >
    <div class="view-main__title-wrapper validators-item__title-wrapper">
      <BackButton text="Validators" class="validators-item__back-btn" />
      <h2 class="view-main__title validators-item__title">Validator</h2>
      <div
        v-if="!isLoading && validator"
        class="validators-item__validator-address"
      >
        <p
          :title="validator?.operatorAddress"
          class="view-main__subtitle validators-item__subtitle"
        >
          {{ validator?.operatorAddress }}
        </p>
        <CopyButton :text="String(validator?.operatorAddress)" class="mg-l8" />
      </div>
      <ValidatorStatus
        v-if="!isLoading && validator"
        :width="14"
        :height="14"
        :status="validatorStatus"
        class="validators-item__validator-status"
      />
      <div
        v-if="delegations[validator?.operatorAddress]"
        class="validators-item__activities validators-item__activities--top fx-sae"
      >
        <button
          @click="withdrawRewards"
          type="button"
          class="app-btn app-btn--small w-min150"
        >
          Claim rewards
        </button>
      </div>
    </div>

    <template v-if="validator">
      <ValidatorInfo :validator="validator" />
      <AppTabs @changeTab="selectTab">
        <AppTab title="Oracle Reports">
          <OracleReportsTable :proposerAddress="validator.operatorAddress" />
        </AppTab>
        <AppTab :title="delegatorsTitle">
          <DelegatorsTable :delegators="delegators" :is-loading="isLoading" />
        </AppTab>
        <AppTab title="Proposed Blocks">
          <ProposedBlocksTable :proposerAddress="validator?.operatorAddress" />
        </AppTab>
      </AppTabs>
    </template>
    <template v-else>
      <div class="app-table__empty-stub">
        <p v-if="isLoading" class="empty mg-t32">Loading…</p>
        <p v-else class="empty mg-t32">Validator not found!</p>
      </div>
    </template>
    <div
      v-if="delegations[validator?.operatorAddress]"
      class="view-main__mobile-activities"
    >
      <div class="validators-item__activities">
        <div class="validators-item__activities-item">
          <button
            @click="withdrawRewards"
            type="button"
            class="validators-item__activities-btn app-btn"
          >
            Claim rewards
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
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
import { Router, useRouter } from 'vue-router'

export default defineComponent({
  components: {
    BackButton,
    CopyButton,
    AppTabs,
    AppTab,
    ValidatorInfo,
    OracleReportsTable,
    DelegatorsTable,
    ProposedBlocksTable,
    ValidatorStatus,
  },
  setup: function () {
    const router: Router = useRouter()
    const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
    const route: RouteLocationNormalizedLoaded = useRoute()
    const validator = ref()
    const delegators = ref<DelegationResponse[]>([])
    const tabStatus = ref('')
    const oracleReportsTableTitle = 'Oracle Reports'
    const proposedBlocksTitle = 'Proposed Blocks'
    const delegations = ref<{ [k: string]: DelegationResponse }>({})
    const delegatorsTitle = computed(() =>
      delegators.value?.length
        ? `Delegators (${delegators.value?.length})`
        : 'Delegators'
    )
    const selectTab = async (title: string) => {
      if (title !== tabStatus.value) {
        tabStatus.value = title
        router.push({
          query: { tab: title },
        })
      }
    }
    const getValidator = async () => {
      lockLoading()
      try {
        const response = await callers.getValidator(
          String(route.params.address)
        )
        validator.value = {
          ...response.validator,
          isActive: await isActiveValidator(String(route.params.address)),
        }
      } catch (error) {
        handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
      }
      releaseLoading()
    }

    const validatorStatus = computed(() => {
      if (validator.value?.status === 3) {
        return validator.value.isActive ? 'success' : 'error'
      } else {
        return 'inactive'
      }
    })
    const getDelegators = async () => {
      const response = await callers.getValidatorDelegations(
        String(route.params.address)
      )
      if (response.delegationResponses) {
        delegators.value = response.delegationResponses
      }
    }

    const getDelegations = async () => {
      try {
        // TODO: delegations returns invalid delegator's amount?
        const response = await callers.getDelegations(wallet.account.address)

        const _delegations: { [k: string]: DelegationResponse } = {}
        for (const delegation of response.delegationResponses) {
          if (!delegation.delegation?.validatorAddress) continue
          _delegations[delegation.delegation.validatorAddress] = delegation
        }
        delegations.value = _delegations
      } catch (error) {
        // error is ignored, since no delegations also throws the error
      }
    }

    const loadData = async () => {
      await getValidator()
      await getDelegators()
      await getDelegations()
    }

    const delegate = async () => {
      await showDialogHandler(
        DelegateFormModal,
        {
          onSubmit: async (d) => {
            d.kill()
            await loadData()
          },
        },
        {
          validator: validator.value,
          delegation: delegations.value[String(route.params.address)],
        }
      )
    }

    const redelegate = async () => {
      await showDialogHandler(
        RedelegateFormModal,
        {
          onSubmit: async (d) => {
            d.kill()
            await loadData()
          },
        },
        {
          validator: validator.value,
          delegation: delegations.value[String(route.params.address)],
        }
      )
    }

    const undelegate = async () => {
      if (!delegations.value[validator.value.operatorAddress]) return
      await showDialogHandler(
        UndelegateFormModal,
        {
          onSubmit: async (d) => {
            d.kill()
            await loadData()
          },
        },
        {
          validator: validator.value,
          delegation: delegations.value[validator.value.operatorAddress],
        }
      )
    }

    const withdrawRewards = async () => {
      if (!delegations.value[validator.value.operatorAddress]) return
      await showDialogHandler(
        WithdrawRewardsFormModal,
        {
          onSubmit: async (d) => {
            d.kill()
            await loadData()
          },
        },
        { validator: validator.value }
      )
    }

    onMounted(async () => {
      if (router.currentRoute.value.query.tab) {
        tabStatus.value = String(router.currentRoute.value.query.tab)
      } else {
        router.push({
          query: { tab: tabStatus.value },
        })
      }
      await loadData()
    })

    return {
      validator,
      delegators,
      delegations,
      withdrawRewards,
      delegate,
      redelegate,
      undelegate,
      delegatorsTitle,
      validatorStatus,
      isLoading,
      selectTab,
      oracleReportsTableTitle,
      proposedBlocksTitle,
    }
  },
})
</script>

<style lang="scss" scoped>
.validators-item__title-wrapper {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  margin-right: 2rem;
}
.validators-item__title {
  margin: 0 1.6rem 0 2rem;
}

.validators-item__subtitle {
  @include ellipsis();
  line-height: 4.6rem;
}

.validators-item__back-btn {
  height: 4.6rem;
}

.validators-item__validator-address {
  display: flex;
  min-width: 10%;
  margin-right: 1rem;
}

.validators-item__activities {
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
}

.validators-item__activities-item {
  display: flex;
  flex-direction: row;
  gap: 2.4rem;

  & > * {
    flex: 1;
  }
}
@include respond-to(tablet) {
  .validators-item {
    padding-bottom: 10rem;
  }
  .validators-item__title {
    margin: 0.8rem 0 0.4rem 0;
  }

  .validators-item__subtitle {
    line-height: 2.4rem;
  }

  .validators-item__back-btn {
    height: 2.4rem;
  }

  .validators-item__validator-address {
    width: 100%;
    margin: 0;
  }
  .validators-item__activities--top {
    display: none;
  }

  .validators-item--large-padding {
    padding-bottom: 17rem;
  }
  .validators-item__title-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-right: 0;
    margin-bottom: 3.2rem;
  }
  .validators-item__validator-status {
    margin-top: 1.2rem;
  }
}

@include respond-to(small) {
  .validators-item__activities-btn {
    font-size: 1.6rem;
  }
}
</style>
