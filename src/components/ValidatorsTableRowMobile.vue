<template>
  <div class="app-table__row validators-table-row-mobile">
    <div class="app-table__cell validators-table-row-mobile__cell">
      <div class="validators-table-row-mobile__info">
        <span class="validators-table-row-mobile__rank">
          {{ validator.rank }}
        </span>
        <TitledLink
          v-if="validator.descriptions.length"
          class="app-table__cell-txt app-table__link"
          :text="validator.descriptions[0]?.moniker"
          :name="{
            name: $routes.validatorDetails,
            params: { address: validator.info.operatorAddress },
          }"
        />
        <p v-else class="app-table__cell-txt">-</p>
      </div>
      <div class="validators-table-row-mobile__show">
        <button
          @click="isShowValidatorDetails = !isShowValidatorDetails"
          type="button"
          class="validators-table-row-mobile__show-button"
        >
          {{ isShowValidatorDetails ? 'Hidden' : 'Show more' }}
          <ArrowIcon
            class="validators-table-row-mobile__arrow-icon"
            :class="{
              ['validators-table-row-mobile__arrow-icon--active']:
                isShowValidatorDetails,
            }"
          />
        </button>
      </div>
    </div>
    <div class="app-table__cell app-table__cell-txt">
      <span class="app-table__title validators-table-row-mobile__title">
        Delegated
      </span>
      <span
        :title="
          $convertLokiToOdin($trimZeros(validator.info?.delegatedAmount), {
            onlyNumber: true,
          })
        "
      >
        {{
          $convertLokiToOdin($trimZeros(validator.info?.delegatedAmount), {
            withDenom: true,
          })
        }}
      </span>
    </div>
    <template v-if="isShowValidatorDetails">
      <div class="app-table__cell">
        <span class="app-table__title validators-table-row-mobile__title">
          Commission
        </span>
        <span v-if="validator.commissions.length">
          {{ $trimZeros(validator?.commissions[0]?.commission * 100, 2) }}%
        </span>
        <span v-else>0%</span>
      </div>
      <div v-if="tabStatus !== inactiveValidatorsTitle" class="app-table__cell">
        <span class="app-table__title validators-table-row-mobile__title">
          Uptime
        </span>
        <ProgressbarTool
          :min="0"
          :max="100"
          :current="$trimZeros(validator?.uptime, 2) || 0"
          is-for-validators
        />
      </div>
      <div class="app-table__cell">
        <span class="app-table__title validators-table-row-mobile__title">
          Status
        </span>
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

<script lang="ts" setup>
import { ref, toRef, watch } from 'vue'
import { DelegationResponse } from 'cosmjs-types/cosmos/staking/v1beta1/staking'
import {
  getValidatorStatus,
  ValidatorInfoModify,
  VALIDATOR_STATUS,
} from '@/helpers/validatorHelpers'
import { ArrowIcon } from '@/components/icons'
import ProgressbarTool from '@/components/ProgressbarTool.vue'
import TitledLink from '@/components/TitledLink.vue'
import ValidatorStatus from '@/components/ValidatorStatus.vue'

enum EVENTS {
  selectedBtn = 'selected-btn',
}

const props = defineProps<{
  currentPage: number
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

const isShowValidatorDetails = ref(false)

const currentPage = toRef(props, 'currentPage')
const tabStatus = toRef(props, 'tabStatus')

const selectedBtn = (typeBtn: string) => {
  emit(EVENTS.selectedBtn, { typeBtn, validator: props.validator })
}

watch([tabStatus, currentPage], () => (isShowValidatorDetails.value = false))
</script>

<style lang="scss" scoped>
.validators-table-row-mobile__info {
  max-width: 16.5rem;
  min-width: 12rem;
  display: flex;
  align-items: center;

  &:first-child {
    margin-right: 1.6rem;
  }
}

.validators-table-row-mobile {
  grid: none;
}

.validators-table-row-mobile__rank {
  margin-right: 1.6rem;
}

.validators-table-row-mobile {
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

.validators-table-row-mobile__show {
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.validators-table-row-mobile__show-button {
  color: var(--clr__btn-normal);
  text-align: center;
}

.validators-table-row-mobile__arrow-icon {
  fill: var(--clr__btn-normal);
  transform: translate(0.3rem, 0.7rem);
}

.validators-table-row-mobile__arrow-icon--active {
  fill: var(--clr__action);
  transform: translate(0rem, 0.7rem) rotate(180deg);
}

.validators-table-row-mobile__cell {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

@include respond-to(tablet) {
  .validators-table-row-mobile__title {
    min-width: 15rem;
    margin-right: 2.4rem;
    display: inline-block;
    font-weight: 300;
  }
}
</style>
