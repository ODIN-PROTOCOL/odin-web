<template>
  <div
    class="view-main validators-item"
    :class="
      delegations[validator?.operatorAddress] ? 'view-main_large-padding' : ''
    "
  >
    <div class="view-main__title-wrapper validators-item__title-wrapper">
      <BackButton class="validators-item__back-btn" :text="'Validators'" />
      <h2 class="view-main__title validators-item__title">Validator</h2>
      <div class="validators-item__validator-address">
        <p
          :title="validator?.operatorAddress"
          class="view-main__subtitle validators-item__subtitle"
        >
          {{ validator?.operatorAddress }}
        </p>
        <CopyButton class="mg-l8" :text="String(validator?.operatorAddress)" />
      </div>
      <div
        class="
          validators-item__activities validators-item__activities_top
          fx-sae
        "
      >
        <div
          class="validators-item__activities-item"
          v-if="delegations[validator?.operatorAddress]"
        >
          <button
            class="app-btn app-btn_outlined app-btn_small w-min150"
            type="button"
            @click="withdrawRewards"
          >
            Claim rewards
          </button>
          <button
            class="app-btn app-btn_outlined app-btn_small w-min150"
            type="button"
            @click="undelegate"
          >
            Undelegate
          </button>
        </div>
        <div class="validators-item__activities-item">
          <button
            v-if="delegations[validator?.operatorAddress]"
            class="app-btn app-btn_outlined app-btn_small w-min150"
            type="button"
            @click="redelegate"
          >
            Redelegate
          </button>
          <button
            class="app-btn app-btn_small w-min150"
            type="button"
            @click="delegate"
          >
            Delegate
          </button>
        </div>
      </div>
    </div>

    <template v-if="validator">
      <ValidatorInfoCard :validator="validator" />

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
            class="validators-item__activities-btn app-btn app-btn_outlined"
            type="button"
            @click="withdrawRewards"
          >
            Claim rewards
          </button>
          <button
            class="validators-item__activities-btn app-btn app-btn_outlined"
            type="button"
            @click="undelegate"
          >
            Undelegate
          </button>
        </div>
        <div class="validators-item__activities-item">
          <button
            v-if="delegations[validator?.operatorAddress]"
            class="validators-item__activities-btn app-btn app-btn_outlined"
            type="button"
            @click="redelegate"
          >
            Redelegate
          </button>
          <button
            class="validators-item__activities-btn app-btn"
            type="button"
            @click="delegate"
          >
            Delegate
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
import { DelegationResponse } from '@cosmjs/stargate/build/codec/cosmos/staking/v1beta1/staking'
import BackButton from '@/components/BackButton.vue'
import CopyButton from '@/components/CopyButton.vue'
import Tabs from '@/components/tabs/Tabs.vue'
import Tab from '@/components/tabs/Tab.vue'
import ValidatorInfoCard from '@/components/ValidatorInfoCard.vue'
import OracleReportsTable from '@/components/tables/OracleReportsTable.vue'
import DelegatorsTable from '@/components/tables/DelegatorsTable.vue'
import ProposedBlocksTable from '@/components/tables/ProposedBlocksTable.vue'

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
    ValidatorInfoCard,
    OracleReportsTable,
    DelegatorsTable,
    ProposedBlocksTable,
  },
  setup: function () {
    const route: RouteLocationNormalizedLoaded = useRoute()
    const validator = ref()
    const delegators = ref()
    const reports = ref()
    const delegations = ref<{ [k: string]: DelegationResponse }>({})

    const getValidator = async () => {
      const response = await callers.getValidator(String(route.params.address))
      validator.value = { ...response.validator }
    }

    const getDelegators = async () => {
      const response = await callers.getValidatorDelegations(
        String(route.params.address)
      )
      delegators.value = [...response.delegationResponses]
    }

    const getReports = async () => {
      const response = await callers.getTxSearch({
        query: `tx.height>=0 AND report.validator='${validator.value.operatorAddress}'`,
      })
      // TODO get the necessary reports from transactions
      reports.value = response.txs
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
.validators-item {
  &__title-wrapper {
    align-items: flex-start;
  }

  &__title {
    margin: 0 1.6rem 0 2rem;
  }

  &__subtitle {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    line-height: 4.6rem;
  }

  &__back-btn {
    height: 4.6rem;
  }

  &__validator-address {
    display: flex;
    min-width: 10%;
    margin-right: 1rem;
  }

  &__activities {
    display: flex;
    flex-direction: column;
    gap: 2.4rem;
  }

  &__activities-item {
    display: flex;
    flex-direction: row;
    gap: 2.4rem;

    & > * {
      flex: 1;
    }
  }
}

@include respond-to(tablet) {
  .validators-item {
    padding-bottom: 10rem;

    &__title {
      margin: 0.8rem 0 0.4rem 0;
    }

    &__subtitle {
      line-height: 2.4rem;
    }

    &__back-btn {
      height: 2.4rem;
    }

    &__validator-address {
      width: 100%;
      margin: 0;
    }
    &__activities_top {
      display: none;
    }

    &_large-padding {
      padding-bottom: 17rem;
    }
  }
}

@include respond-to(small) {
  .validators-item {
    &__activities-btn {
      font-size: 1.6rem;
    }
  }
}
</style>
