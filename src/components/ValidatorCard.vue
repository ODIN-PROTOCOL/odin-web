<template>
  <div class="validator-card">
    <div class="validator-card__row fx-row">
      <div class="fx-sfw">
        <label class="dp-ib mg-b8 fs-14">Moniker</label>
        <p>{{ validator.description.moniker }}</p>
      </div>
      <div class="fx-sfw mg-l32">
        <label class="dp-ib mg-b8 fs-14">Status</label>
        <p>{{ $tBondStatus(validator.status) }}</p>
      </div>
      <div class="fx-sfw mg-l32">
        <label class="dp-ib mg-b8 fs-14">Jailed?</label>
        <p>{{ validator.jailed ? 'Yes' : 'No' }}</p>
      </div>
      <div class="fx-sfw mg-l32">
        <label class="dp-ib mg-b8 fs-14">Delegated</label>
        <p :title="$fCoin(validator.tokens, 'loki')">
          {{ $fCoin(validator.tokens, 'loki', true) }}
        </p>
      </div>
      <div class="fx-sfw mg-l32">
        <label class="dp-ib mg-b8 fs-14">Delegator shares</label>
        <p>
          {{ $preciseAsPercents(validator.delegatorShares) }}
        </p>
      </div>
      <div class="fx-sfw mg-l32">
        <button class="app-btn" type="button" @click="delegate">
          Delegate
        </button>
      </div>
    </div>

    <div class="validator-card__row fx-row">
      <div class="fx-sfw">
        <label class="dp-ib mg-b8 fs-14">Rate</label>
        <p>
          {{ $preciseAsPercents(validator.commission.commissionRates.rate) }}
        </p>
      </div>
      <div class="fx-sfw mg-l32">
        <label class="dp-ib mg-b8 fs-14">Max rate</label>
        <p>
          {{ $preciseAsPercents(validator.commission.commissionRates.maxRate) }}
        </p>
      </div>
      <div class="fx-sfw mg-l32">
        <label class="dp-ib mg-b8 fs-14">Max change rate</label>
        <p>
          {{
            $preciseAsPercents(
              validator.commission.commissionRates.maxChangeRate
            )
          }}
        </p>
      </div>
      <div class="fx-sfw mg-l32">
        <label class="dp-ib mg-b8 fs-14">Public key</label>
        <CopyText
          :text="validator.consensusPubkey"
          :title="validator.consensusPubkey"
          :displayText="$cropAddress(validator.consensusPubkey)"
        />
      </div>
      <div class="fx-sfw mg-l32">
        <label class="dp-ib mg-b8 fs-14">Operator</label>
        <CopyText
          :text="validator.operatorAddress"
          :title="validator.operatorAddress"
          :displayText="$cropAddress(validator.operatorAddress)"
        />
      </div>
      <div class="fx-sfw mg-l32">
        <button
          v-if="delegation"
          class="app-btn-2nd"
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
import { showDelegateFormDialog } from './modals/DelegateFormModal.vue'
import { showUndelegateFormDialog } from './modals/UndelegateFormModal.vue'

export default defineComponent({
  emits: ['delegationChanged'],
  components: { CopyText },
  props: {
    validator: { type: Object as PropType<ValidatorDecoded>, required: true },
    delegation: { type: Object as PropType<DelegationResponse> },
  },
  setup(props, ctx) {
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

    return { delegate, undelegate }
  },
})
</script>

<style scoped lang="scss">
.validator-card {
  border: 1px solid var(--clr__action);
  border-radius: 8px;
  padding: 0.8rem 3.2rem;
}

.validator-card__row {
  padding: 2.4rem 0;

  &:not(:last-of-type) {
    border-bottom: 1px solid var(--clr__table-border);
  }
}
</style>
