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
    <template v-if="validators?.length">
      <ValidatorCard
        v-for="item in validators"
        :key="item.operatorAddress"
        class="mg-b32"
        :validator="item"
      />
    </template>
    <template v-else>
      <div class="app-table__row">
        <p class="app-table-empty-stub">No items yet</p>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { callers } from '@/api/callers'
import { showBecomeValidatorFormDialog } from '@/components/modals/BecomeValidatorFormModal.vue'
import ValidatorCard from '@/components/ValidatorCard.vue'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  components: { ValidatorCard },
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
