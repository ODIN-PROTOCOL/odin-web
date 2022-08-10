<template>
  <div class="validator-info">
    <div class="validator-info__top-line">
      <div class="validator-info__top-line-item card-frame">
        <span class="validator-info__top-line-item-title">Moniker</span>
        <div class="validator-info__card-balance-row-value-wrapper">
          <span
            :title="validator.descriptions[0].moniker"
            class="validator-info__top-line-item-value"
          >
            {{ validator.descriptions[0].moniker }}
          </span>
        </div>
      </div>
      <div class="validator-info__top-line-item card-frame">
        <span class="validator-info__top-line-item-title">Status</span>
        <div class="validator-info__card-balance-row-value-wrapper">
          <span
            :title="$tBondStatus(validator.statuses[0].status)"
            class="validator-info__top-line-item-value"
          >
            {{ $tBondStatus(validator.statuses[0].status) }}
          </span>
        </div>
      </div>
      <div class="validator-info__top-line-item card-frame">
        <span class="validator-info__top-line-item-title">Jailed?</span>
        <div class="validator-info__card-balance-row-value-wrapper">
          <span
            :title="validator.statuses[0].jailed ? 'Yes' : 'No'"
            class="validator-info__top-line-item-value"
          >
            {{ validator.statuses[0].jailed ? 'Yes' : 'No' }}
          </span>
        </div>
      </div>
      <div class="validator-info__top-line-item card-frame">
        <span class="validator-info__top-line-item-title">Stake</span>
        <div class="validator-info__card-balance-row-value-wrapper">
          <span
            :title="$convertLokiToOdin(validator.info.delegatedAmount)"
            class="validator-info__top-line-item-value"
          >
            {{
              $convertLokiToOdin(validator.info.delegatedAmount, {
                withDenom: true,
              })
            }}
          </span>
        </div>
      </div>
      <div class="validator-info__top-line-item card-frame">
        <span class="validator-info__top-line-item-title">Rate</span>
        <div class="validator-info__card-balance-row-value-wrapper">
          <span
            :title="$trimZeros(validator?.commissions[0]?.commission * 100, 2)"
            class="validator-info__top-line-item-value"
          >
            {{ $trimZeros(validator?.commissions[0]?.commission * 100, 2) }}%
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
                :title="
                  $convertLokiToOdin(validator.commissions[0].minSelfDelegation)
                "
                class="validator-info__card-balance-row-value app-table__cell-txt"
              >
                {{
                  $convertLokiToOdin(validator.commissions[0].minSelfDelegation)
                }}
              </span>
            </div>
          </div>

          <div
            v-if="accountAddress"
            class="validator-info__delegetion-balance-row"
          >
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
        <div
          v-if="accountAddress"
          class="validator-info__delegetion-btn-wrapper"
        >
          <button
            v-if="delegationsBalance"
            type="button"
            class="validator-info__delegetion-btn app-btn app-btn--outline-red app-btn--very-small"
            @click="selectedBtn('Undelegate')"
          >
            Undelegate
          </button>
          <button
            v-if="delegationsBalance && validator.statuses[0].status === 3"
            type="button"
            class="validator-info__delegetion-btn app-btn app-btn--outlined app-btn--very-small"
            @click="selectedBtn('Regelate')"
          >
            Redelegate
          </button>
          <button
            v-if="validator.statuses[0].status === 3"
            type="button"
            class="validator-info__delegetion-btn app-btn app-btn--very-small"
            @click="selectedBtn('Delegate')"
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
            {{ delegetionSharesPercent }}%
          </span>
        </div>
        <div class="validator-info__description-item">
          <span class="validator-info__description-item-title">
            {{ isMobile() ? 'Proposed blocks' : 'Amount of proposed blocks' }}
          </span>
          <span
            :title="validator.blocksAggregate.aggregate.count"
            class="validator-info__description-item-value"
          >
            {{ validator.blocksAggregate.aggregate.count }}
          </span>
        </div>
        <div class="validator-info__description-item">
          <span class="validator-info__description-item-title">Max rate</span>
          <span class="validator-info__description-item-value">
            {{ $trimZeros(validator.info.maxRate * 100, 2) }}%
          </span>
        </div>
        <div class="validator-info__description-item">
          <span class="validator-info__description-item-title"
            >Max change rate</span
          >
          <span class="validator-info__description-item-value">
            {{ $trimZeros(validator.info.maxChangeRate * 100, 2) }}%
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { wallet } from '@/api/wallet'
import { DelegationResponse } from 'cosmjs-types/cosmos/staking/v1beta1/staking'
import { isMobile } from '@/helpers/helpers'
import { ValidatorInfoModify } from '@/helpers/validatorHelpers'

enum EVENTS {
  selectedBtn = 'selected-btn',
}

const props = defineProps<{
  validator: ValidatorInfoModify
  delegation: DelegationResponse
}>()

const emit = defineEmits<{
  (
    e: EVENTS.selectedBtn,
    payload: { typeBtn: string; validator: ValidatorInfoModify },
  ): void
}>()

const accountAddress = ref(wallet.isEmpty ? '' : wallet.account.address)

const delegationsBalance = computed(() => {
  if (props.delegation?.balance) {
    return Number(props.delegation.balance?.amount)
  } else return 0
})

const delegetionSharesPercent = computed(() => {
  if (Number(props.validator.info.delegatedAmount) !== 0) {
    return (
      (Number(props.validator.info.delegatorShares) * 100) /
      Number(props.validator.info.delegatedAmount)
    )
  } else return 0
})

const selectedBtn = (typeBtn: string) => {
  emit(EVENTS.selectedBtn, { typeBtn, validator: props.validator })
}
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
body.dark {
  .validator-info__card-balance-row-value {
    color: var(--d-clr__text);
  }
}
</style>
