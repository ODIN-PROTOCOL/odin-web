<template>
  <div class="validator-info">
    <div class="validator-info__top-line">
      <div class="validator-info__top-line-item card-frame">
        <span class="validator-info__top-line-item-title">Moniker</span>
        <div class="validator-info__card-balance-row-value-wrapper">
          <span
            :title="validator.description.moniker"
            class="validator-info__top-line-item-value"
          >
            {{ validator.description.moniker }}
          </span>
        </div>
      </div>
      <div class="validator-info__top-line-item card-frame">
        <span class="validator-info__top-line-item-title">Status</span>
        <div class="validator-info__card-balance-row-value-wrapper">
          <span
            :title="$tBondStatus(validator.status)"
            class="validator-info__top-line-item-value"
          >
            {{ $tBondStatus(validator.status) }}
          </span>
        </div>
      </div>
      <div class="validator-info__top-line-item card-frame">
        <span class="validator-info__top-line-item-title">Jailed?</span>
        <div class="validator-info__card-balance-row-value-wrapper">
          <span
            :title="validator.jailed ? 'Yes' : 'No'"
            class="validator-info__top-line-item-value"
          >
            {{ validator.jailed ? 'Yes' : 'No' }}
          </span>
        </div>
      </div>
      <div class="validator-info__top-line-item card-frame">
        <span class="validator-info__top-line-item-title">Stake</span>
        <div class="validator-info__card-balance-row-value-wrapper">
          <span
            :title="$convertLokiToOdin(validator.tokens, { withDenom: true })"
            class="validator-info__top-line-item-value"
          >
            {{ $convertLokiToOdin(validator.tokens, { withDenom: true }) }}
          </span>
        </div>
      </div>
      <div class="validator-info__top-line-item card-frame">
        <span class="validator-info__top-line-item-title">Rate</span>
        <div class="validator-info__card-balance-row-value-wrapper">
          <span
            :title="
              $getPrecisePercents(validator.commission.commissionRates.rate)
            "
            class="validator-info__top-line-item-value"
          >
            {{ $getPrecisePercents(validator.commission.commissionRates.rate) }}
          </span>
        </div>
      </div>
    </div>
    <div class="validator-info__table">
      <div class="validator-info__delegetion card-frame">
        <div class="validator-info__delegetion-title">Delegation</div>
        <div class="validator-info__delegetion-balance">
          <div class="validator-info__delegetion-balance-row">
            <span class="validator-info__delegetion-balance-row-title"
              >Min delegation</span
            >
            <div class="validator-info__card-balance-row-value-wrapper">
              <span
                :title="$convertLokiToOdin(validator.minSelfDelegation)"
                class="validator-info__card-balance-row-value app-table__cell-txt"
              >
                {{ $convertLokiToOdin(validator.minSelfDelegation) }}
              </span>
            </div>
          </div>

          <div class="validator-info__delegetion-balance-row">
            <span class="validator-info__delegetion-balance-row-title"
              >You delegated</span
            >
            <div class="validator-info__card-balance-row-value-wrapper">
              <span
                class="validator-info__card-balance-row-value app-table__cell-txt"
                :title="$convertLokiToOdin(delegationsBalance)"
              >
                {{
                  $convertLokiToOdin(delegationsBalance, {
                    withDenom: true,
                  })
                }}
              </span>
            </div>
          </div>
        </div>
        <div class="validator-info__delegetion-btn-wrapper">
          <button
            v-if="delegations?.balance"
            @click="undelegate"
            class="validator-info__delegetion-btn app-btn app-btn--outline-red app-btn--very-small"
            type="button"
          >
            Undelegate
          </button>
          <button
            v-if="delegations?.balance && validator.status === 3"
            @click="redelegate"
            type="button"
            class="validator-info__delegetion-btn app-btn app-btn--outlined app-btn--very-small"
          >
            Redelegate
          </button>
          <button
            v-if="validator.status === 3"
            @click="delegate"
            type="button"
            class="validator-info__delegetion-btn app-btn app-btn--very-small"
          >
            Delegate
          </button>
        </div>
      </div>
      <div class="validator-info__description card-frame">
        <div class="validator-info__description-title">Information</div>
        <div class="validator-info__description-item">
          <span class="validator-info__description-item-title"
            >Delegator shares</span
          >
          <span class="validator-info__description-item-value">
            {{
              $getPercentOutOfNumber(
                validator.delegatorShares,
                validator.tokens
              )
            }}
          </span>
        </div>
        <div class="validator-info__description-item">
          <span class="validator-info__description-item-title">
            {{ isMobile() ? 'Proposed blocks' : 'Amount of proposed blocks' }}
          </span>
          <span
            :title="proposedBlocksCount"
            class="validator-info__description-item-value"
          >
            {{ proposedBlocksCount }}
          </span>
        </div>
        <div class="validator-info__description-item">
          <span class="validator-info__description-item-title">Max rate</span>
          <span class="validator-info__description-item-value">
            {{
              $getPrecisePercents(validator.commission.commissionRates.maxRate)
            }}
          </span>
        </div>
        <div class="validator-info__description-item">
          <span class="validator-info__description-item-title"
            >Max change rate</span
          >
          <span class="validator-info__description-item-value">
            {{
              $getPrecisePercents(
                validator.commission.commissionRates.maxChangeRate
              )
            }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, onMounted } from 'vue'
import { ValidatorDecoded } from '@/helpers/validatorDecoders'
import { callers } from '@/api/callers'
import { wallet } from '@/api/wallet'
import { showDialogHandler } from '@/components/modals/handlers/dialogHandler'
import DelegateFormModal from '@/components/modals/DelegateFormModal.vue'
import UndelegateFormModal from '@/components/modals/UndelegateFormModal.vue'
import RedelegateFormModal from '@/components/modals/RedelegateFormModal.vue'
import { DelegationResponse } from 'cosmjs-types/cosmos/staking/v1beta1/staking'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import { isMobile } from '@/helpers/helpers'

export default defineComponent({
  props: {
    validator: { type: Object as PropType<ValidatorDecoded>, required: true },
  },
  setup(props) {
    const delegationsBalance = ref('0')
    const proposedBlocksCount = ref(0)
    const delegations = ref<DelegationResponse>({})

    const getDelegations = async () => {
      try {
        const response = await callers.getDelegations(wallet.account.address)
        for (const delegation of response.delegationResponses) {
          if (
            delegation.delegation?.validatorAddress ===
            props.validator.operatorAddress
          ) {
            delegationsBalance.value = String(delegation.balance?.amount)
            delegations.value = delegation
          }
        }
      } catch (error) {
        handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
      }
    }
    const getProposedBlocks = async () => {
      const response = await callers
        .getProposedBlocks(props.validator.operatorAddress, 0, 1)
        .then((req) => req.json())
      proposedBlocksCount.value = response?.total_count || 0
    }

    const delegate = async () => {
      await showDialogHandler(
        DelegateFormModal,
        {
          onSubmit: async (d) => {
            d.kill()
            await getDelegations()
          },
        },
        {
          validator: props.validator,
          delegation: delegations.value,
        }
      )
    }

    const redelegate = async () => {
      await showDialogHandler(
        RedelegateFormModal,
        {
          onSubmit: async (d) => {
            d.kill()
            await getDelegations()
          },
        },
        {
          validator: props.validator,
          delegation: delegations.value,
        }
      )
    }

    const undelegate = async () => {
      await showDialogHandler(
        UndelegateFormModal,
        {
          onSubmit: async (d) => {
            d.kill()
            await getDelegations()
          },
        },
        {
          validator: props.validator,
          delegation: delegations.value,
        }
      )
    }
    onMounted(async () => {
      await getDelegations()
      await getProposedBlocks()
    })
    return {
      delegationsBalance,
      delegate,
      redelegate,
      undelegate,
      delegations,
      proposedBlocksCount,
      isMobile,
    }
  },
})
</script>

<style lang="scss" scoped>
.validator-info {
  display: flex;
  flex-direction: column;
  margin-bottom: 4rem;
  gap: 4rem;
}
.validator-info__table {
  display: flex;
  gap: 2rem;
}
.validator-info__delegetion,
.validator-info__description {
  width: 100%;
}
.validator-info__top-line {
  display: grid;
  gap: 2.4rem;
  grid:
    auto /
    minmax(4rem, 1fr)
    minmax(4rem, 1fr)
    minmax(4rem, 1fr)
    minmax(8rem, 1fr)
    minmax(8rem, 1fr);
}
.validator-info__top-line-item {
  display: flex;
  flex-direction: column;
  @include ellipsis();
  max-width: 100%;
}

.validator-info__row,
.validator-info__delegetion-btn-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
}

.validator-info__top-line-item-title {
  font-size: 1.6rem;
  line-height: 2.4rem;
  margin-bottom: 0.4rem;
}
.validator-info__top-line-item-value {
  font-weight: 600;
  font-size: 2.4rem;
  line-height: 3.2rem;
  @include ellipsis();
}
.validator-info__delegetion-title,
.validator-info__description-title {
  font-weight: 400;
  font-size: 2.4rem;
  line-height: 3.2rem;
  margin-bottom: 3.2rem;
}
.validator-info__description-item {
  display: flex;
  &:not(:last-child) {
    margin-bottom: 2rem;
  }
}
.validator-info__description-item-title {
  font-size: 1.6rem;
  line-height: 2.4rem;
  min-width: 17rem;
  max-width: 21rem;
  width: 100%;
}
.validator-info__description-item-value {
  font-size: 1.4rem;
  line-height: 2rem;
}

.validator-info__delegetion-balance {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 3.2rem;
}
.validator-info__delegetion-balance-row {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1.6rem 0;
  min-width: 10rem;
  &:not(:last-child) {
    border-right: 0.1rem solid var(--clr__input-border);
    margin-right: 2rem;
    padding-right: 1.6rem;
  }
}
.validator-info__card-balance-row-value-wrapper {
  display: flex;
  flex-direction: column;
  max-width: 20rem;
  position: relative;
}
.validator-info__card-balance-row-value {
  font-size: 2.4rem;
  line-height: 3.2rem;
  width: 100%;
  font-weight: 600;
  color: var(--clr__text);
}
.validator-info__delegetion-btn {
  min-width: 9.9rem;
  max-width: 10.8rem;
  width: 100%;
}
@media screen and (max-width: 768px) {
  .validator-info {
    gap: 2.4rem;
  }

  .validator-info__top-line {
    grid-template-columns: 1fr 1fr;
    gap: 1.6rem;
  }
  .validator-info__table {
    flex-direction: column;
    gap: 2rem;
  }
  .validator-info__delegetion-btn-wrapper {
    gap: 0.8rem;
  }
  .validator-info__top-line-item-value {
    font-size: 2rem;
    line-height: 2.4rem;
  }
}
@media screen and (max-width: 393px) {
  .validator-info__delegetion-btn-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.8rem;
  }
  .validator-info__delegetion-btn {
    max-width: none;
  }
}
</style>
