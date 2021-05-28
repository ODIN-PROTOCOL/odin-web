<template>
  <div class="validators view-main">
    <div class="fx-row mg-b32">
      <h2 class="view-title">Validators</h2>
      <button
        class="app-btn-2nd fx-sae"
        type="button"
        @click="createDataSource()"
      >
        Become a validator
      </button>
    </div>
    <div class="app-table">
      <div class="validators__table-head app-table__head">
        <div class="app-table__cell">
          <span class="app-table__cell-txt"> Moniker </span>
        </div>
        <div class="app-table__cell">
          <span class="app-table__cell-txt"> TODO </span>
        </div>
        <div class="app-table__cell">
          <span class="app-table__cell-txt"> TODO </span>
        </div>
        <div class="app-table__cell">
          <span class="app-table__cell-txt"> TODO </span>
        </div>
      </div>
      <template v-if="validators?.length">
        <div
          v-for="item in validators"
          :key="item.operatorAddress"
          class="validators__table-row app-table__row"
        >
          <div class="app-table__cell">
            <TitledSpan
              class="app-table__cell-txt"
              :text="item.description.moniker"
            />
          </div>
          <div class="app-table__cell">TODO</div>
          <div class="app-table__cell">TODO</div>
          <div class="app-table__cell">TODO</div>
        </div>
      </template>
      <template v-else>
        <div class="app-table__row">
          <p class="app-table-empty-stub">No items yet</p>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { callers } from '@/api/callers'
import { showBecomeValidatorFormDialog } from '@/components/modals/BecomeValidatorFormModal.vue'
import TitledSpan from '@/components/TitledSpan.vue'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  components: { TitledSpan },
  setup() {
    const validators = ref()
    const _loadValidators = async () => {
      const response = await callers.getValidators('BOND_STATUS_BONDED')
      console.debug('Validators:', response)
      validators.value = response.validators
    }
    _loadValidators()

    const createDataSource = async () => {
      showBecomeValidatorFormDialog({
        onSubmit: (d) => {
          d.kill()
          _loadValidators()
        },
      })
    }

    return { validators, createDataSource }
  },
})
</script>

<style scoped></style>
