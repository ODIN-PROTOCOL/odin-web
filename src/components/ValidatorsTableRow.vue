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
          params: { address: validator.info.operatorAddress },
        }"
      />
      <p v-else class="app-table__cell-txt">-</p>
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
          getValidatorStatus(validator.statuses[0].status, validator.isActive)
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
  </div>
</template>

<script setup lang="ts">
import {
  getValidatorStatus,
  ValidatorInfoModify,
} from '@/helpers/validatorHelpers'
import ProgressbarTool from '@/components/ProgressbarTool.vue'
import TitledLink from '@/components/TitledLink.vue'
import ValidatorStatus from '@/components/ValidatorStatus.vue'

defineProps<{
  validator: ValidatorInfoModify
  tabStatus: string
  inactiveValidatorsTitle: string
}>()
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
