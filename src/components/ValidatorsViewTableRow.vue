<template>
  <div
    class="validators-view-table-row app-table__row"
    :class="{
      'validators-view-table-row--top':
        validator?.statuses[0]?.status === VALIDATOR_STATUS.active &&
        delegations[validator.info.operatorAddress],
    }"
  >
    <div class="app-table__cell">
      <span class="app-table__title">Rank</span>
      <span>{{ validator.rank }}</span>
    </div>
    <div class="app-table__cell">
      <span class="app-table__title">Validator</span>
      <TitledLink
        class="app-table__cell-txt app-table__link"
        :text="validator?.descriptions[0]?.moniker"
        :to="`/validators/${validator?.info.operatorAddress}`"
      />
    </div>
    <div class="app-table__cell app-table__cell-txt">
      <span class="app-table__title">Delegated</span>
      <span
        :title="
          $convertLokiToOdin($trimZeros(validator.info.delegatedAmount), {
            onlyNumber: true,
          })
        "
      >
        {{
          $convertLokiToOdin($trimZeros(validator.info.delegatedAmount), {
            withDenom: true,
          })
        }}
      </span>
    </div>
    <div class="app-table__cell validators-view-table-row__cell--margin-left">
      <span class="app-table__title">Commission</span>
      <span>
        {{ $trimZeros(validator?.commissions[0]?.commission * 100, 2) }}%
      </span>
    </div>
    <div v-if="tabStatus !== inactiveValidatorsTitle" class="app-table__cell">
      <span class="app-table__title">Uptime</span>
      <Progressbar
        :min="0"
        :max="100"
        :current="$trimZeros(validator?.uptime, 2) || 0"
        is-for-validators
      />
    </div>
    <div class="app-table__cell validators-view-table-row__cell--center">
      <span class="app-table__title">Status</span>
      <ValidatorStatus
        :width="14"
        :height="14"
        :status="
          getValidatorStatus(validator.statuses[0].status, validator.isActive)
        "
        class="validators-item__validator-status"
      />
    </div>
    <div v-if="hasActionButtons" class="app-table__cell">
      <div class="app-table__activities validators-view-table-row__activities">
        <div
          v-if="validator?.statuses[0]?.status === VALIDATOR_STATUS.active"
          class="app-table__activities-item validators-view-table-row__activities-item"
        >
          <button
            v-if="delegations[validator.info.operatorAddress]"
            class="app-btn app-btn--outlined app-btn--very-small w-min108"
            type="button"
            @click="selectedBtn('Regelate')"
          >
            Redelegate
          </button>
          <button
            class="app-btn app-btn--very-small w-min108"
            type="button"
            @click="selectedBtn('Delegate')"
          >
            Delegate
          </button>
        </div>
        <div
          v-if="delegations[validator.info.operatorAddress]"
          class="app-table__activities-item validators-view-table-row__activities-item"
        >
          <button
            class="app-btn app-btn--outlined app-btn--very-small w-min108"
            type="button"
            @click="selectedBtn('Claim rewards')"
          >
            Claim rewards
          </button>
          <button
            class="app-btn app-btn--outline-red app-btn--very-small w-min108"
            type="button"
            @click="selectedBtn('Undelegate')"
          >
            Undelegate
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  getValidatorStatus,
  ValidatorInfoModify,
  VALIDATOR_STATUS,
} from '@/helpers/validatorHelpers'
import { DelegationResponse } from 'cosmjs-types/cosmos/staking/v1beta1/staking'
import TitledLink from '@/components/TitledLink.vue'
import Progressbar from '@/components/ProgressbarTool.vue'
import ValidatorStatus from '@/components/ValidatorStatus.vue'

enum EVENTS {
  selectedBtn = 'selected-btn',
}

const props = defineProps<{
  validator: ValidatorInfoModify
  delegations: DelegationResponse
  tabStatus: string
  inactiveValidatorsTitle: string
  hasActionButtons: boolean
}>()

const emit = defineEmits<{
  (
    e: EVENTS.selectedBtn,
    payload: { typeBtn: string; validator: ValidatorInfoModify },
  ): void
}>()

const selectedBtn = (typeBtn: string) => {
  emit(EVENTS.selectedBtn, { typeBtn, validator: props.validator })
}
</script>

<style lang="scss" scoped>
.validators-view-table-row {
  padding: 3.2rem 0 2rem;
  align-items: center;
}

.validators-view-table-row--top {
  align-items: flex-start;
}

.validators-view-table-row__activities {
  width: 100%;
  & > *:not(:last-child) {
    margin-bottom: 1.6rem;
  }
}

.validators-view-table-row__activities-item {
  display: flex;
  justify-content: flex-end;
  gap: 1.6rem;
}

.validators-view-table-row__cell--center {
  justify-content: center;
}
.validators-view-table-row__cell--margin-left {
  margin-left: 2rem;
}
</style>
