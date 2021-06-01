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
        <label class="dp-ib mg-b8 fs-14">Delegated</label>
        <p :title="$fCoin(delegated, 'loki')">
          {{ $fCoin(delegated, 'loki', true) }}
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
    </div>
  </div>
</template>

<script lang="ts">
import { bigMath } from '@/helpers/bigMath'
import { ValidatorDecoded } from '@/helpers/validatorDecoders'
import { computed, defineComponent, PropType } from 'vue'
import CopyText from './CopyText.vue'

export default defineComponent({
  components: { CopyText },
  props: {
    validator: { type: Object as PropType<ValidatorDecoded>, required: true },
  },
  setup(props) {
    const delegated = computed(() =>
      bigMath.add(props.validator.tokens, props.validator.delegatorShares)
    )

    return { delegated }
  },
})
</script>

<style scoped>
.validator-card {
  border: 1px solid var(--clr__action);
  border-radius: 8px;
  padding: 3.2rem;
}

.validator-card__row {
  padding-bottom: 2.4rem;
  border-bottom: 1px solid var(--clr__table-border);
}
</style>
