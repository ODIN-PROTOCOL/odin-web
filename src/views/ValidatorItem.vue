<template>
  <div
    class="validator view-main"
    :class="
      delegations[validator?.operatorAddress] ? 'view-main_large-padding' : ''
    "
  >
    <div class="page-title">
      <BackButton :text="'Validators'" />
      <h2 class="view-title">Validator</h2>
      <div class="validator__address">
        <p :title="validator?.operatorAddress" class="view-subtitle">
          {{ validator?.operatorAddress }}
        </p>
        <CopyButton class="mg-l8" :text="String(validator?.operatorAddress)" />
      </div>
      <div class="validator__activities validator__activities_top fx-sae">
        <template v-if="delegations[validator?.operatorAddress]">
          <button
            class="app-btn app-btn_outlined app-btn_small"
            type="button"
            @click="withdrawRewards"
          >
            Claim rewards
          </button>
          <button
            class="app-btn app-btn_outlined app-btn_small mg-l24"
            type="button"
            @click="undelegate"
          >
            Undelegate
          </button>
        </template>
        <button
          class="app-btn app-btn_small mg-l24"
          type="button"
          @click="delegate"
        >
          Delegate
        </button>
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
          <template v-if="blocks">
            <ProposedBlocksTable :blocks="blocks" />
          </template>
        </Tab>
      </Tabs>
    </template>

    <div class="page-mobile-activities">
      <div class="validator__activities">
        <div
          class="validator__activities-item"
          v-if="delegations[validator?.operatorAddress]"
        >
          <button
            class="app-btn app-btn_outlined"
            type="button"
            @click="withdrawRewards"
          >
            Claim rewards
          </button>
          <button
            class="app-btn app-btn_outlined"
            type="button"
            @click="undelegate"
          >
            Undelegate
          </button>
        </div>
        <div class="validator__activities-item">
          <button class="app-btn" type="button" @click="delegate">
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
import { Bech32 } from '@cosmjs/encoding'
import BackButton from '@/components/BackButton.vue'
import CopyButton from '@/components/CopyButton.vue'
import Tabs from '@/components/tabs/Tabs.vue'
import Tab from '@/components/tabs/Tab.vue'
import ValidatorInfoCard from '@/components/ValidatorInfoCard.vue'
import OracleReportsTable from '@/components/tables/OracleReportsTable.vue'
import DelegatorsTable from '@/components/tables/DelegatorsTable.vue'
import ProposedBlocksTable from '@/components/tables/ProposedBlocksTable.vue'
import { showDelegateFormModal } from '@/components/modals/handlers/delegateFormModalHandler'
import { showUndelegateFormModal } from '@/components/modals/handlers/undelegateFormModalHandler'
import { showWithdrawRewardsFormModal } from '@/components/modals/handlers/withdrawRewardsFormModalHandler'

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
    const blocks = ref()
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

    const getBlocks = async () => {
      const response = await callers.getBlockchain()
      blocks.value = response.blockMetas.filter((item) => {
        const encodedAddress = Bech32.encode(
          'odinvaloper',
          item.header.proposerAddress
        )

        if (encodedAddress === String(route.params.address)) return true
        return false
      })
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

    const delegate = () => {
      showDelegateFormModal(
        {
          onSubmit: (d) => {
            d.kill()
            getValidator()
            getDelegators()
            getBlocks()
            getReports()
            getDelegations()
          },
        },
        {
          validator: validator.value,
          delegation: delegations.value[String(route.params.address)],
        }
      )
    }

    const undelegate = () => {
      if (!delegations.value[validator.value.operatorAddress]) return
      showUndelegateFormModal(
        {
          onSubmit: (d) => {
            d.kill()
            getValidator()
            getDelegators()
            getBlocks()
            getReports()
            getDelegations()
          },
        },
        {
          validator: validator.value,
          delegation: delegations.value[validator.value.operatorAddress],
        }
      )
    }

    const withdrawRewards = () => {
      if (!delegations.value[validator.value.operatorAddress]) return
      showWithdrawRewardsFormModal(
        {
          onSubmit: (d) => {
            d.kill()
            getValidator()
            getDelegators()
            getBlocks()
            getReports()
            getDelegations()
          },
        },
        { validator: validator.value }
      )
    }

    onMounted(async () => {
      await getValidator()
      await getDelegators()
      await getBlocks()
      await getReports()
      await getDelegations()
    })

    return {
      validator,
      delegators,
      delegations,
      blocks,
      reports,
      withdrawRewards,
      delegate,
      undelegate,
    }
  },
})
</script>

<style lang="scss" scoped>
.view-title {
  margin: 0 1.6rem 0 2rem;
}

.view-subtitle {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.validator__address {
  display: flex;
  min-width: 10%;
  margin-right: 1rem;
}

.validator__activities {
  display: flex;
}

@media screen and (max-width: 768px) {
  .view-main {
    padding-bottom: 10rem;

    &_large-padding {
      padding-bottom: 17rem;
    }
  }

  .view-title {
    margin: 0.8rem 0 0.4rem 0;
  }

  .validator__address {
    width: 100%;
    margin: 0;
  }

  .validator {
    &__activities {
      flex-direction: column;
      gap: 2.4rem;

      &_top {
        display: none;
      }
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
}

@media screen and (max-width: 390px) {
  .validator__activities-item {
    button {
      font-size: 1.6rem;
    }
  }
}
</style>
