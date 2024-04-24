<template>
  <div class="app-table__row validators-view-table-row">
    <div class="app-table__cell">
      <span class="app-table__title">Rank</span>
      <span>{{ validator.rank }}</span>
    </div>
    <div class="app-table__cell">
      <span class="app-table__title">Validator</span>
      <TitledLink
        v-if="validator.descriptions.length"
        class="app-table__cell-txt app-table__link"
        :text="validator.descriptions[0]?.moniker"
        :name="{
          name: $routes.validatorDetails,
          params: { address: validator.info?.operatorAddress },
        }"
      />
      <p v-else class="app-table__cell-txt">-</p>
    </div>
    <div class="app-table__cell app-table__cell-txt">
      <span class="app-table__title">Delegated</span>
      <span
        :title="
          $convertLokiToOdin($trimZeros(validator.info?.delegatedAmount || 0), {
            onlyNumber: true,
          })
        "
      >
        {{
          $convertLokiToOdin($trimZeros(validator.info?.delegatedAmount || 0), {
            withDenom: true,
          })
        }}
      </span>
    </div>
    <div class="app-table__cell validators-view-table-row__cell--margin-left">
      <span class="app-table__title">Commission</span>
      <span v-if="validator.commissions.length">
        {{ $trimZeros(validator?.commissions[0]?.commission * 100, 2) }}%
      </span>
      <span v-else>0%</span>
    </div>
    <div class="app-table__cell">
      <span class="app-table__title">Status</span>
      <ValidatorStatus
        :width="24"
        :height="24"
        :status="
          getValidatorStatus(
            validator.statuses.length > 0 ? validator.statuses[0].status : 3,
            validator.isActive || false,
          )
        "
        class="validators-item__validator-status"
      />
    </div>
    <div v-if="tabStatus !== inactiveValidatorsTitle" class="app-table__cell">
      <span class="app-table__title">Uptime</span>
      <ProgressbarTool
        :min="0"
        :max="100"
        :current="$trimZeros(validator?.uptime, 2) || 0"
        is-for-validators
      />
    </div>
    <div v-if="hasActionButtons" class="app-table__cell">
      <div class="app-table__activities validators-view-table-row__activities">
        <div
          v-if="validator?.statuses[0]?.status === VALIDATOR_STATUS.active"
          class="app-table__activities-item validators-view-table-row__activities-item"
        >
          <button
            v-if="delegations[validator.info?.operatorAddress]"
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
          v-if="delegations[validator.info?.operatorAddress]"
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

<script lang="ts" setup>
import { DelegationResponse } from 'cosmjs-types/cosmos/staking/v1beta1/staking'
import {
  getValidatorStatus,
  ValidatorInfoModify,
  VALIDATOR_STATUS,
} from '@/helpers/validatorHelpers'
import ProgressbarTool from '@/components/ProgressbarTool.vue'
import TitledLink from '@/components/TitledLink.vue'
import ValidatorStatus from '@/components/ValidatorStatus.vue'

enum EVENTS {
  selectedBtn = 'selected-btn',
}

const props = defineProps<{
  delegations: DelegationResponse
  hasActionButtons: boolean
  inactiveValidatorsTitle: string
  tabStatus: string
  validator: ValidatorInfoModify
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
  align-items: center;
}

.validators-view-table-row__cell--center {
  justify-content: center;
}

.validators-view-table-row__cell--margin-left {
  margin-left: 2rem;
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

@include respond-to(tablet) {
  .validators-view-table-row__cell--center {
    justify-content: flex-start;
  }

  .validators-view-table-row {
    padding: 3.4rem 0 1.6rem;
    grid: none;
  }
}
</style>
