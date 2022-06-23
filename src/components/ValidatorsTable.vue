<template>
  <div
    class="app-table__row validators__table-row"
    :class="{
      'validators__table-row--top':
        validator.status === 3 && delegations[validator.operatorAddress],
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
        :text="validator.description.moniker"
        :to="`/validators/${validator.operatorAddress}`"
      />
    </div>
    <div class="app-table__cell app-table__cell-txt">
      <span class="app-table__title">Delegated</span>
      <span
        :title="
          $convertLokiToOdin(validator.delegatorShares, {
            withPrecise: true,
          })
        "
      >
        {{
          $convertLokiToOdin(validator.delegatorShares, {
            withDenom: true,
            withPrecise: true,
          })
        }}
      </span>
    </div>
    <div class="app-table__cell validators__table-cell--center">
      <span class="app-table__title">Commission</span>
      <span>
        {{ $getPrecisePercents(validator.commission.commissionRates.rate) }}
      </span>
    </div>
    <div v-if="tabStatus !== inactiveValidatorsTitle" class="app-table__cell">
      <span class="app-table__title">Uptime</span>
      <Progressbar
        :min="0"
        :max="100"
        :current="Number(validator.uptimeInfo?.uptime) || 0"
        :isForValidators="true"
      />
    </div>
    <div class="app-table__cell validators__table-cell--center">
      <span class="app-table__title">Status</span>
      <ValidatorStatus
        :width="14"
        :height="14"
        :status="validatorStatus(validator)"
        class="validators-item__validator-status"
      />
    </div>
    <div class="app-table__cell">
      <div class="app-table__activities validators__table-activities">
        <div
          v-if="validator.status === 3"
          class="app-table__activities-item validators__table-activities-item"
        >
          <button
            v-if="delegations[validator.operatorAddress]"
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
          v-if="delegations[validator.operatorAddress]"
          class="app-table__activities-item validators__table-activities-item"
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

<script lang="ts">
import { defineComponent, ref, PropType } from 'vue'
import { COINS_LIST } from '@/api/api-config'
import TitledLink from '@/components/TitledLink.vue'
import Progressbar from '@/components/Progressbar.vue'
import ValidatorStatus from '@/components/ValidatorStatus.vue'
import { isMobile } from '@/helpers/helpers'
import { ValidatorDecoded } from '@/helpers/validatorDecoders'

export default defineComponent({
  components: {
    TitledLink,
    Progressbar,
    ValidatorStatus,
  },
  props: {
    validator: { type: Object as PropType<ValidatorDecoded>, required: true },
    delegations: { type: Object, required: true },
    tabStatus: { type: String, required: true },
    inactiveValidatorsTitle: { type: String, required: true },
  },
  setup(props, { emit }) {
    const ITEMS_PER_PAGE = 50
    const currentPage = ref(1)
    const totalPages = ref()
    const isShow = ref([])

    const validatorStatus = (validator: {
      status: number
      isActive: boolean
    }) => {
      if (validator.status === 3) {
        return validator.isActive ? 'success' : 'error'
      } else {
        return 'inactive'
      }
    }
    const selectedBtn = (typeBtn: string) => {
      emit('selectedBtn', { typeBtn, validator: props.validator })
    }

    return {
      COINS_LIST,
      ITEMS_PER_PAGE,
      totalPages,
      currentPage,
      validatorStatus,
      isShow,
      isMobile,
      selectedBtn,
    }
  },
})
</script>

<style lang="scss" scoped>
.validators__table--inactive {
  .validators__table-head,
  .validators__table-row {
    gap: 2rem;
    grid:
      auto /
      minmax(2rem, 5rem)
      minmax(5rem, 1.5fr)
      minmax(6rem, 1fr)
      minmax(8rem, 0.5fr)
      minmax(7rem, 8.7rem)
      minmax(24rem, 1.5fr);
  }
}
.validators__table-row {
  padding: 3.2rem 0 2rem;
  align-items: center;
}
.validators__table-row--top {
  align-items: flex-start;
}
.validators__table-activities {
  width: 100%;
  & > *:not(:last-child) {
    margin-bottom: 1.6rem;
  }
}
.validators__table-activities-item {
  display: flex;
  justify-content: flex-end;
  gap: 1.6rem;
}
.validators__table-cell--center {
  justify-content: center;
}
.validators__mobile-activities {
  & > *:not(:last-child) {
    margin-bottom: 0.8rem;
  }
}
@include respond-to(tablet) {
  .validators__table--inactive {
    .validators__table-head,
    .validators__table-row {
      grid: none;
    }
  }
  .validators__table-activities {
    width: 100%;
  }

  .validators__table-activities-item {
    & > * {
      flex: 1;
    }
  }
  .validators__table-cell--center {
    justify-content: flex-start;
  }
  .validators__table-head--center {
    text-align: start;
  }
  .validators__table-head--end {
    text-align: start;
  }
}
</style>
