<template>
  <div class="info-card mg-b40">
    <div class="info-card__item">
      <div class="info-card__row">
        <span class="info-card__title">Status</span>
        <span class="info-card__txt">
          {{ $tBondStatus(validator.status) }}
        </span>
      </div>
      <div class="info-card__row">
        <span class="info-card__title">Jailed?</span>
        <span class="info-card__txt">
          {{ validator.jailed ? 'Yes' : 'No' }}
        </span>
      </div>
      <div class="info-card__row">
        <span class="info-card__title">Delegated</span>
        <span class="info-card__txt" :title="$fCoin(validator.tokens, 'loki')">
          {{ $fCoin(validator.tokens, 'loki') }}
        </span>
      </div>
      <div class="info-card__row">
        <span class="info-card__title">Delegator shares</span>
        <span class="info-card__txt">
          {{ $preciseAsPercents(validator.delegatorShares) }}
        </span>
      </div>
    </div>
    <div class="info-card__item">
      <div class="info-card__row">
        <span class="info-card__title">Rate</span>
        <span class="info-card__txt">
          {{ $preciseAsPercents(validator.commission.commissionRates.rate) }}
        </span>
      </div>
      <div class="info-card__row">
        <span class="info-card__title">Max rate</span>
        <span class="info-card__txt">
          {{ $preciseAsPercents(validator.commission.commissionRates.maxRate) }}
        </span>
      </div>
      <div class="info-card__row">
        <span class="info-card__title">Max change rate</span>
        <span class="info-card__txt">
          {{
            $preciseAsPercents(
              validator.commission.commissionRates.maxChangeRate
            )
          }}
        </span>
      </div>
      <div class="info-card__row">
        <span class="info-card__title">Operator</span>
        <span class="info-card__txt">{{ validator.operatorAddress }}</span>
      </div>
    </div>
    <div class="info-card__item">
      <ExtendedProgressbar
        :color="'#007BFF'"
        :value="'RAM'"
        :unit="'KB'"
        :current="7.15"
        :max="14.3"
      />
      <ExtendedProgressbar
        :color="'#00D097'"
        :value="'NET'"
        :unit="'KB'"
        :current="7.15"
        :max="14.3"
      />
      <ExtendedProgressbar
        :color="'#FDC748'"
        :value="'CPU'"
        :unit="'us'"
        :current="7.15"
        :max="14.3"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { ValidatorDecoded } from '@/helpers/validatorDecoders'
import ExtendedProgressbar from '@/components/ExtendedProgressbar.vue'

export default defineComponent({
  components: { ExtendedProgressbar },
  props: {
    validator: { type: Object as PropType<ValidatorDecoded>, required: true },
  },
})
</script>

<style lang="scss" scoped>
.info-card {
  display: flex;
  flex-direction: row;
  padding: 3.2rem 2.4rem;
  border: 1px solid var(--clr__action);
  border-radius: 8px;
  gap: 2.4rem;

  &__item {
    width: 33.333%;

    & > *:not(:last-child) {
      margin-bottom: 2.4rem;
    }
  }

  &__row {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  &__title {
    display: inline-block;
    max-width: 10rem;
    min-width: 10rem;
  }

  &__txt {
    font-weight: 600;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}

@media screen and (max-width: 768px) {
  .info-card {
    flex-direction: column;

    &__item {
      width: 100%;
    }
  }
}
</style>
