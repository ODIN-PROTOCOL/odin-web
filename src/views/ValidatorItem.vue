<template>
  <div
    class="view-main validators-item"
    :class="
      delegations[validator?.operatorAddress]
        ? 'validators-item--large-padding'
        : ''
    "
  >
    <div class="view-main__title-wrapper w-full">
      <div class="validators-item__title-wrapper">
        <BackButton class="validators-item__back-btn" :text="'Validators'" />
        <h2 class="view-main__title validators-item__title">Validator</h2>
        <div class="validators-item__validator-address">
          <p
            :title="validator?.operatorAddress"
            class="view-main__subtitle validators-item__subtitle"
          >
            {{ validator?.operatorAddress }}
          </p>
          <CopyButton
            class="mg-l8"
            :text="String(validator?.operatorAddress)"
          />
        </div>
        <StatusIcon :status="validator?.isActive ? 'success' : 'error'" />
      </div>
      <div
        class="validators-item__activities validators-item__activities--top"
        v-if="delegations[validator?.operatorAddress]"
      >
        <button
          class="app-btn app-btn--small w-min150"
          type="button"
          @click="withdrawRewards"
        >
          Claim rewards
        </button>
      </div>
    </div>

    <template v-if="validator">
      <ValidatorInfo :validator="validator" />

      <Tabs>
        <Tab title="Oracle Reports">
          <template v-if="reports">
            <OracleReportsTable :reports="reports" />
          </template>
        </Tab>
        <Tab title="Delegators">
          <template v-if="delegators">
            <DelegatorsTable :delegators="delegators" />
          </template>
        </Tab>
        <Tab title="Proposed Blocks">
          <ProposedBlocksTable :proposerAddress="validator.operatorAddress" />
        </Tab>
      </Tabs>
    </template>

    <div class="view-main__mobile-activities">
      <div class="validators-item__activities">
        <div
          class="validators-item__activities-item"
          v-if="delegations[validator?.operatorAddress]"
        >
          <button
            class="validators-item__activities-btn app-btn"
            type="button"
            @click="withdrawRewards"
          >
            Claim rewards
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'
import { callers } from '@/api/callers'
import { wallet } from '@/api/wallet'
import { DelegationResponse } from 'cosmjs-types/cosmos/staking/v1beta1/staking'
import BackButton from '@/components/BackButton.vue'
import CopyButton from '@/components/CopyButton.vue'
import Tabs from '@/components/tabs/Tabs.vue'
import Tab from '@/components/tabs/Tab.vue'
import ValidatorInfo from '@/components/ValidatorInfo.vue'
import OracleReportsTable from '@/components/tables/OracleReportsTable.vue'
import DelegatorsTable from '@/components/tables/DelegatorsTable.vue'
import ProposedBlocksTable from '@/components/tables/ProposedBlocksTable.vue'
import { isActiveValidator } from '@/helpers/validatorHelpers'
import StatusIcon from '@/components/StatusIcon.vue'

import { showDialogHandler } from '@/components/modals/handlers/dialogHandler'
import WithdrawRewardsFormModal from '@/components/modals/WithdrawRewardsFormModal.vue'
import DelegateFormModal from '@/components/modals/DelegateFormModal.vue'
import UndelegateFormModal from '@/components/modals/UndelegateFormModal.vue'
import RedelegateFormModal from '@/components/modals/RedelegateFormModal.vue'

export default defineComponent({
  components: {
    BackButton,
    CopyButton,
    Tabs,
    Tab,
    ValidatorInfo,
    OracleReportsTable,
    DelegatorsTable,
    ProposedBlocksTable,
    StatusIcon,
  },
  setup: function () {
    const route: RouteLocationNormalizedLoaded = useRoute()
    const validator = ref()
    const delegators = ref()
    const reports = ref()
    const delegations = ref<{ [k: string]: DelegationResponse }>({})

    const getValidator = async () => {
      const response = await callers.getValidator(String(route.params.address))

      validator.value = {
        ...response.validator,
        isActive: await isActiveValidator(String(route.params.address)),
      }
      console.log(validator.value)
    }

    const getDelegators = async () => {
      const response = await callers.getValidatorDelegations(
        String(route.params.address)
      )
      delegators.value = [...response.delegationResponses]
    }

    const getReports = async () => {
      // TODO get reports from telemetry
      // const response = await callers.getTxSearch({
      //   query: `tx.height>=0 AND report.validator='${validator.value.operatorAddress}'`,
      // })
      // reports.value = response.txs
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
      await getReports()
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
      await loadData()
    })

    return {
      validator,
      delegators,
      delegations,
      reports,
      withdrawRewards,
      delegate,
      redelegate,
      undelegate,
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
}
.validators-item__title {
  margin: 0 1.6rem 0 2rem;
}

.validators-item__subtitle {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
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
  }
}

@include respond-to(small) {
  .validators-item__activities-btn {
    font-size: 1.6rem;
  }
}
</style>
