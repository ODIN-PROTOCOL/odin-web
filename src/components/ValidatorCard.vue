<template>
  <div class="validator-card">
    <div class="validator-card__row">
      <div class="validator-card__cell">
        <span class="validator-card__title">Moniker</span>
        <TitledLink
          class="validator-card__link"
          :text="validator.description.moniker.toString()"
          :to="`/validators/${validator.operatorAddress}`"
        />
      </div>
      <div class="validator-card__cell">
        <span class="validator-card__title">Status</span>
        <span>{{ $tBondStatus(validator.status) }}</span>
      </div>
      <div class="validator-card__cell">
        <span class="validator-card__title">Jailed?</span>
        <span>{{ validator.jailed ? 'Yes' : 'No' }}</span>
      </div>
      <div class="validator-card__cell">
        <span class="validator-card__title">Delegated</span>
        <span :title="$fCoin(validator.tokens, 'loki')">
          {{ $fCoin(validator.tokens, 'loki', true) }}
        </span>
      </div>
      <div class="validator-card__activities">
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

    <div class="validator-card__row">
      <div class="validator-card__cell">
        <span class="validator-card__title">Delegator shares</span>
        <span>{{ $preciseAsPercents(validator.delegatorShares) }}</span>
      </div>
      <div class="validator-card__cell">
        <span class="validator-card__title">Rate</span>
        <span>
          {{ $preciseAsPercents(validator.commission.commissionRates.rate) }}
        </span>
      </div>
      <div class="validator-card__cell">
        <span class="validator-card__title">Max rate</span>
        <span>
          {{ $preciseAsPercents(validator.commission.commissionRates.maxRate) }}
        </span>
      </div>
      <div class="validator-card__cell">
        <span class="validator-card__title">Max change rate</span>
        <span>
          {{
            $preciseAsPercents(
              validator.commission.commissionRates.maxChangeRate
            )
          }}
        </span>
      </div>
      <div class="validator-card__cell">
        <span class="validator-card__title">Operator</span>
        <span>
          <CopyText
            :text="validator.operatorAddress"
            :title="validator.operatorAddress"
            :displayText="$cropAddress(validator.operatorAddress)"
          />
        </span>
      </div>
      <div class="validator-card__activities">
        <button
          v-if="delegation"
          class="app-btn app-btn_outlined app-btn_small"
          type="button"
          @click="undelegate"
        >
          Undelegate
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ValidatorDecoded } from '@/helpers/validatorDecoders'
import { DelegationResponse } from '@cosmjs/stargate/build/codec/cosmos/staking/v1beta1/staking'
import { defineComponent, PropType } from 'vue'
import CopyText from './CopyText.vue'
import TitledLink from '@/components/TitledLink.vue'
import { showWithdrawFormDialog } from './modals/WithdrawFormModal.vue'
import { showDelegateFormDialog } from './modals/DelegateFormModal.vue'
import { showUndelegateFormDialog } from './modals/UndelegateFormModal.vue'

export default defineComponent({
  emits: ['delegationChanged'],
  components: { CopyText, TitledLink },
  props: {
    validator: { type: Object as PropType<ValidatorDecoded>, required: true },
    delegation: { type: Object as PropType<DelegationResponse> },
  },
  setup(props, ctx) {
    const withdraw = () => {
      showWithdrawFormDialog({
        onSubmit: (d) => {
          d.kill()
        },
      })
    }

    const delegate = () => {
      showDelegateFormDialog(
        {
          onSubmit: (d) => {
            d.kill()
            ctx.emit('delegationChanged')
          },
        },
        { validator: props.validator, delegation: props.delegation }
      )
    }

    const undelegate = () => {
      if (!props.delegation) return
      showUndelegateFormDialog(
        {
          onSubmit: (d) => {
            d.kill()
            ctx.emit('delegationChanged')
          },
        },
        { validator: props.validator, delegation: props.delegation }
      )
    }

    return { withdraw, delegate, undelegate }
  },
})
</script>

<style scoped lang="scss">
.validator-card {
  border: 1px solid var(--clr__action);
  border-radius: 8px;
  padding: 0.8rem 3.2rem;

  &__row {
    display: flex;
    flex-direction: row;
    padding: 2.4rem 0;

    &:not(:last-of-type) {
      border-bottom: 1px solid var(--clr__table-border);
    }
  }

  &__cell {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  &__title {
    font-size: 1.4rem;
    margin-bottom: 0.8rem;
  }

  &__link {
    text-decoration: none;
    color: var(--clr__action);
  }

  &__activities {
  }
}
</style>
