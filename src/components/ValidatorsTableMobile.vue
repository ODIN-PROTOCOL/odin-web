<template>
  <div class="app-table__row validators-table-mobile validators__table-row">
    <div class="app-table__cell validators-table-mobile__cell">
      <div class="validators-table-mobile__info">
        <span class="validators-table-mobile__rank">{{ validator.rank }}</span>
        <TitledLink
          class="app-table__cell-txt app-table__link"
          :text="validator.description.moniker"
          :to="`/validators/${validator.operatorAddress}`"
        />
      </div>
      <div class="validators-table-mobile__show">
        <button
          @click="isShow[validator.rank] = !isShow[validator.rank]"
          type="button"
          class="validators-table-mobile__show-button"
        >
          {{ isShow[validator.rank] ? 'Hidden' : 'Show more' }}
          <ArrowIcon
            class="validators-table-mobile__arrow-icon"
            :class="{
              ['validators-table-mobile__arrow-icon--active']:
                isShow[validator.rank],
            }"
          />
        </button>
      </div>
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
    <template v-if="isShow[validator.rank]">
      <div class="app-table__cell">
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
      <div class="app-table__cell">
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
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from 'vue'
import { COINS_LIST } from '@/api/api-config'
import TitledLink from '@/components/TitledLink.vue'
import Progressbar from '@/components/Progressbar.vue'
import ValidatorStatus from '@/components/ValidatorStatus.vue'
import { isMobile } from '@/helpers/helpers'
import ArrowIcon from '@/components/icons/ArrowIcon.vue'
import { ValidatorDecoded } from '@/helpers/validatorDecoders'

export default defineComponent({
  components: {
    TitledLink,
    Progressbar,
    ValidatorStatus,
    ArrowIcon,
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
.validators-table-mobile__info {
  display: flex;
  align-items: center;
  max-width: 16.5rem;
  min-width: 12rem;
  &:first-child {
    margin-right: 1.6rem;
  }
}
.validators-table-mobile__rank {
  margin-right: 1.6rem;
}
.validators__table-row {
  padding: 3.2rem 0 2rem;
  align-items: center;
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
  & > * {
    flex: 1;
  }
}
.validators-table-mobile__show {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 3rem;
}
.validators-table-mobile__show-button {
  color: var(--clr__btn-normal);
  text-align: center;
}
.validators-table-mobile__arrow-icon {
  fill: var(--clr__btn-normal);
  transform: translate(0.3rem, 0) rotate(270deg);
}
.validators-table-mobile__arrow-icon--active {
  transform: translate(-1rem, 1.5rem) rotate(90deg);
  fill: var(--clr__action);
}
.validators-table-mobile__cell {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.validators__table--inactive {
  .validators__table-head,
  .validators__table-row {
    grid: none;
  }
}
</style>
