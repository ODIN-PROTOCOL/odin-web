<template>
  <div
    class="validators view-main load-fog"
    :class="{ 'load-fog_show': isLoading && validators?.length }"
  >
    <div class="fx-row mg-b32">
      <h2 class="view-title">Validators</h2>
      <button
        class="app-btn-2nd fx-sae"
        type="button"
        @click="becomeValidator()"
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
        @loadValidators="loadValidators()"
      />
    </template>
    <template v-else>
      <p v-if="isLoading">Loading…</p>
      <p v-else>No items yet</p>
    </template>
  </div>
</template>

<script lang="ts">
import { callers } from '@/api/callers'
import { showBecomeValidatorFormDialog } from '@/components/modals/BecomeValidatorFormModal.vue'
import ValidatorCard from '@/components/ValidatorCard.vue'
import { handleError } from '@/helpers/errors'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  components: { ValidatorCard },
  setup() {
    const isLoading = ref(false)
    const validators = ref()
    const loadValidators = async () => {
      isLoading.value = true
      try {
        const response = await callers.getValidators('BOND_STATUS_BONDED')
        validators.value = response.validators

        console.debug('Validators:', response)
      } catch (error) {
        handleError(error)
      }
      isLoading.value = false
    }
    loadValidators()

    const becomeValidator = async () => {
      showBecomeValidatorFormDialog({
        onSubmit: (d) => {
          d.kill()
          loadValidators()
        },
      })
    }

    return { validators, isLoading, becomeValidator, loadValidators }
  },
})
</script>

<style scoped></style>
