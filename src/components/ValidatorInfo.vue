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
        <span class="validator-info__top-line-item-title">Jailed</span>
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
    <div class="app-table">
      <div class="app-table__row validator-info__line">
        <div class="app-table__cell app-table__cell--label">
          <span>Delegator Shares</span>
        </div>
        <div class="app-table__cell">
          <span>
            {{
              getDelegationsShares(
                validator.info.delegatedAmount,
                validator.info.delegatorShares,
              )
            }}
          </span>
        </div>
      </div>
      <div class="app-table__row validator-info__line">
        <div class="app-table__cell app-table__cell--label">
          <span>
            {{ isMobile() ? 'Proposed blocks' : 'Amount of proposed blocks' }}
          </span>
        </div>
        <div class="app-table__cell">
          <span class="app-table__text">
            {{ validator.blocksAggregate.aggregate.count }}
          </span>
        </div>
      </div>
      <div class="app-table__row validator-info__line">
        <div class="app-table__cell app-table__cell--label">
          <span>Max rate</span>
        </div>
        <div class="app-table__cell">
          <span class="app-table__text">
            {{ $trimZeros(validator.info.maxRate * 100, 2) }}%
          </span>
        </div>
      </div>
      <div class="app-table__row validator-info__line">
        <div class="app-table__cell app-table__cell--label">
          <span>Max change rate</span>
        </div>
        <div class="app-table__cell">
          <span class="app-table__text">
            {{ $trimZeros(validator.info.maxChangeRate * 100, 2) }}%
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ValidatorInfoModify,
  getDelegationsShares,
} from '@/helpers/validatorHelpers'
import { isMobile } from '@/helpers/helpers'
defineProps<{
  validator: ValidatorInfoModify
}>()
</script>

<style lang="scss" scoped>
.validator-info {
  display: flex;
  flex-direction: column;
  margin-bottom: 4rem;
  gap: 4rem;
}

.validator-info__line {
  grid: auto/minmax(6rem, 2fr) minmax(9rem, 3fr);
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
  max-width: 20rem;
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
