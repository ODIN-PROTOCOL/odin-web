<template>
  <div class="validator view-main">
    <div class="page-title">
      <BackButton :text="'Validators'" />
      <h2 class="view-title">Validator</h2>
      <div class="validator__address">
        <p class="view-subtitle">{{ validator?.operatorAddress }}</p>
        <CopyButton class="mg-l8" :text="String(validator?.operatorAddress)" />
      </div>
      <div class="validator__activities validator__activities_top fx-sae">
        <button
          class="app-btn app-btn_outlined app-btn_small"
          type="button"
          @click="withdraw"
        >
          Withdraw stake
        </button>
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

    <div class="validator__activities validator__activities_bottom">
      <button class="app-btn app-btn_outlined" type="button" @click="withdraw">
        Withdraw stake
      </button>
      <button class="app-btn mg-l24" type="button" @click="delegate">
        Delegate
      </button>
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
import { showDelegateFormDialog } from '@/components/modals/DelegateFormModal.vue'
import { showWithdrawFormDialog } from '@/components/modals/WithdrawFormModal.vue'

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
      showDelegateFormDialog(
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

    const withdraw = () => {
      showWithdrawFormDialog({
        onSubmit: (d) => {
          d.kill()
        },
      })
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
      blocks,
      reports,
      withdraw,
      delegate,
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
}

.validator__activities {
  &_bottom {
    display: none;

    & > * {
      flex: 1;
    }
    @media screen and (max-width: 768px) {
      display: flex;
    }
  }
  &_top {
    display: block;
    min-width: 281px;
    @media screen and (max-width: 768px) {
      display: none;
    }
  }
}

@media screen and (max-width: 768px) {
  .view-title {
    margin: 0.8rem 0 0.4rem 0;
  }

  .validator__address {
    width: 100%;
  }
}
</style>
