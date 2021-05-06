<template>
  <div class="oracle-scripts">
    <h3>Oracle scripts</h3>
    <button class="app-btn" type="button" @click="createOracleScript()">
      Create oracle script
    </button>
    <div class="oracle-scripts__table">
      <div class="oracle-scripts__table-head">
        <div class="oracle-scripts__table-cell"><span>Column</span></div>
        <div class="oracle-scripts__table-cell"><span>Column</span></div>
        <div class="oracle-scripts__table-cell"><span>Column</span></div>
        <div class="oracle-scripts__table-cell"><span>Column</span></div>
      </div>
      <div
        v-for="item in oracleScripts"
        :key="item.id"
        class="oracle-scripts__table-row"
      >
        <div class="oracle-scripts__table-cell"><span>Cell</span></div>
        <div class="oracle-scripts__table-cell"><span>Cell</span></div>
        <div class="oracle-scripts__table-cell"><span>Cell</span></div>
        <div class="oracle-scripts__table-cell"><span>Cell</span></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { getQueryClient } from '@/api/client/queryClient'
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
      oracleScripts.value = response.oracleScripts
      console.log(oracleScripts.value)
    }
    loadOracleScripts()

    const createOracleScript = async () => {
      alert('CREATE ORACLE SCRIPT!')
    }

    return { oracleScripts, createOracleScript }
  },
})
</script>

<style scoped>
.oracle-scripts__table-head,
.oracle-scripts__table-row {
  display: grid;
  grid: auto / auto-flow auto;
}
</style>
