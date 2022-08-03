<template>
  <div class="app-table__row validators-view-table-row-mobile">
    <div class="app-table__cell validators-view-table-row-mobile__cell">
      <div class="validators-view-table-row-mobile__info">
        <span class="validators-view-table-row-mobile__rank">{{
          validator.rank
        }}</span>
        <TitledLink
          class="app-table__cell-txt app-table__link"
          :text="validator?.descriptions[0]?.moniker"
          :to="{
            name: $routes.validatorDetails,
            params: { address: validator?.info.operatorAddress },
          }"
        />
      </div>
      <div class="validators-view-table-row-mobile__show">
        <button
          @click="isShowValidatorDetails = !isShowValidatorDetails"
          type="button"
          class="validators-view-table-row-mobile__show-button"
        >
          {{ isShowValidatorDetails ? 'Hidden' : 'Show more' }}
          <ArrowIcon
            class="validators-view-table-row-mobile__arrow-icon"
            :class="{
              ['validators-view-table-row-mobile__arrow-icon--active']:
                isShowValidatorDetails,
            }"
          />
        </button>
      </div>
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
    <template v-if="isShowValidatorDetails">
      <div class="app-table__cell">
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
      <div class="app-table__cell">
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
        <div
          class="app-table__activities validators-view-table-row-mobile__activities"
        >
          <div
            v-if="validator?.statuses[0]?.status === VALIDATOR_STATUS.active"
            class="app-table__activities-item validators-view-table-row-mobile__activities-item"
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
            class="app-table__activities-item validators-view-table-row-mobile__activities-item"
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
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, toRef } from 'vue'
import { DelegationResponse } from 'cosmjs-types/cosmos/staking/v1beta1/staking'
import {
  ValidatorInfoModify,
  VALIDATOR_STATUS,
  getValidatorStatus,
} from '@/helpers/validatorHelpers'
import { ArrowIcon } from '@/components/icons'
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
  currentPage: number
  inactiveValidatorsTitle: string
  hasActionButtons: boolean
}>()

const emit = defineEmits<{
  (
    e: EVENTS.selectedBtn,
    payload: { typeBtn: string; validator: ValidatorInfoModify },
  ): void
}>()

const tabStatus = toRef(props, 'tabStatus')
const currentPage = toRef(props, 'currentPage')
const isShowValidatorDetails = ref(false)

const selectedBtn = (typeBtn: string) => {
  emit(EVENTS.selectedBtn, { typeBtn, validator: props.validator })
}
watch([tabStatus, currentPage], () => (isShowValidatorDetails.value = false))
</script>

<style lang="scss" scoped>
.validators-view-table-row-mobile__info {
  display: flex;
  align-items: center;
  max-width: 16.5rem;
  min-width: 12rem;
  &:first-child {
    margin-right: 1.6rem;
  }
}

.validators-view-table-row-mobile__rank {
  margin-right: 1.6rem;
}

.validators-view-table-row-mobile {
  padding: 3.2rem 0 2rem;
  align-items: center;
}

.validators-view-table-row-mobile__activities {
  width: 100%;

  & > *:not(:last-child) {
    margin-bottom: 1.6rem;
  }
}

.validators-view-table-row-mobile__activities-item {
  display: flex;
  justify-content: flex-end;
  gap: 1.6rem;
  & > * {
    flex: 1;
  }
}

.validators-view-table-row-mobile__show {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 3rem;
}

.validators-view-table-row-mobile__show-button {
  color: var(--clr__btn-normal);
  text-align: center;
}

.validators-view-table-row-mobile__arrow-icon {
  fill: var(--clr__btn-normal);
  transform: translate(0.3rem, 0) rotate(270deg);
}

.validators-view-table-row-mobile__arrow-icon--active {
  transform: translate(-1rem, 1.5rem) rotate(90deg);
  fill: var(--clr__action);
}

.validators-view-table-row-mobile__cell {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
