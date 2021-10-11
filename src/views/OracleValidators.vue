<template>
  <div class="oracle-validators view-main">
    <div class="page-title">
      <h2 class="view-title">Oracle validators</h2>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { callers } from '@/api/callers'
import { Report } from '@provider/codec/oracle/v1/oracle'

export default defineComponent({
  setup() {
    const ITEMS_PER_PAGE = 5
    // const currentPage = ref(1)
    const validatorsCount = ref()

    const getOracleValidators = async () => {
      const response = await callers.getActiveValidators()
      const response1 = await callers.getValidatorStatus('odinvaloper1qfjlfywrue7ad8q8h59qc32cyfz34yy9l8hpzj')
      const response2 = await callers.getValidator('odinvaloper1qfjlfywrue7ad8q8h59qc32cyfz34yy9l8hpzj')

      console.log(response2)
      console.log(response1)
      console.log('active-validators', response)
    }

    onMounted(async () => {
      await getOracleValidators()
    })

    return {
      ITEMS_PER_PAGE,
      validatorsCount,
    }
  },
})
</script>

<style lang="scss" scoped></style>
