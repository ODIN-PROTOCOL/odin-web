<template>
  <div class="oracle-scripts">
    <h3>Oracle scripts</h3>
    <button class="app-btn mg-b8" type="button" @click="createOracleScript()">
      Create oracle script
    </button>
    <div class="app-table">
      <div class="oracle-scripts__table-head app-table__head">
        <div class="app-table__cell">
          <span class="app-table__cell-txt"> Name </span>
        </div>
        <div class="app-table__cell">
          <span class="app-table__cell-txt"> Description </span>
        </div>
        <div class="app-table__cell">
          <span class="app-table__cell-txt"> Owner </span>
        </div>
      </div>
      <div
        v-for="item in oracleScripts"
        :key="item.id"
        class="app-table__row-btn"
        type="button"
        @click="showOracleScript(item)"
      >
        <div class="oracle-scripts__table-row app-table__row">
          <div class="app-table__cell">
            <span class="app-table__cell-txt" :title="item.name">
              {{ item.name }}
            </span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__cell-txt" :title="item.description">
              {{ item.description }}
            </span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__cell-txt" :title="item.owner">
              {{ $cropAddress(item.owner) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { getQueryClient } from '@/api/client/queryClient'
import { showOracleScriptFormDialog } from '@/components/modals/OracleScriptFormModal.vue'
import { showOracleScriptDialog } from '@/components/modals/OracleScriptModal.vue'
import router from '@/router'
import { OracleScript } from '@provider/codec/oracle/v1/oracle'
import Long from 'long'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const queries = getQueryClient()

    const oracleScripts = ref()
    const loadOracleScripts = async () => {
      const response = await queries.oracle.unverified.oracleScripts(
        new Long(100)
      )
      console.log(response, response.oracleScripts)
      oracleScripts.value = response.oracleScripts
    }
    loadOracleScripts()

    const createOracleScript = async () => {
      const res = await showOracleScriptFormDialog({
        onSubmit: (d) => {
          d.kill()
          loadOracleScripts()
        },
      })
      console.log(res)
    }

    const showOracleScript = (oracleScript: OracleScript) => {
      showOracleScriptDialog(
        {
          onRequestCreated: (d) => {
            d.kill()
            router.push({ name: 'Requests' })
          },
        },
        { oracleScript }
      )
    }

    return { oracleScripts, createOracleScript, showOracleScript }
  },
})
</script>

<style scoped>
.oracle-scripts__table-head,
.oracle-scripts__table-row {
  grid: auto / minmax(8rem, 14rem) minmax(0, 1fr) minmax(8rem, 14rem);
}
</style>
