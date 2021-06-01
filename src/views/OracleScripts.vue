<template>
  <div class="oracle-scripts view-main">
    <div class="fx-row mg-b32">
      <h2 class="view-title">Oracle scripts</h2>
      <button
        class="app-btn-2nd fx-sae"
        type="button"
        @click="createOracleScript()"
      >
        Create oracle script
      </button>
    </div>
    <div class="app-table">
      <div class="oracle-scripts__table-head app-table__head">
        <div class="app-table__cell">
          <span class="app-table__cell-txt"> ID </span>
        </div>
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
      <template v-if="oracleScripts?.length">
        <button
          v-for="item in oracleScripts"
          :key="item.id.toString()"
          class="app-table__row-btn"
          type="button"
          @click="showOracleScript(item)"
        >
          <div class="oracle-scripts__table-row app-table__row">
            <div class="app-table__cell">
              <TitledSpan
                class="app-table__cell-txt"
                :text="item.id.toString()"
              />
            </div>
            <div class="app-table__cell">
              <TitledSpan class="app-table__cell-txt" :text="item.name" />
            </div>
            <div class="app-table__cell">
              <TitledSpan
                class="app-table__cell-txt"
                :text="item.description"
              />
            </div>
            <div class="app-table__cell">
              <TitledSpan
                class="app-table__cell-txt"
                :text="$cropAddress(item.owner)"
                :title="item.owner"
              />
            </div>
          </div>
        </button>
      </template>
      <template v-else>
        <div class="app-table__row">
          <p class="app-table__empty-stub">No items yet</p>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { callers } from '@/api/callers'
import { showOracleScriptFormDialog } from '@/components/modals/OracleScriptFormModal.vue'
import { showOracleScriptDialog } from '@/components/modals/OracleScriptModal.vue'
import TitledSpan from '@/components/TitledSpan.vue'
import router from '@/router'
import { OracleScript } from '@provider/codec/oracle/v1/oracle'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  components: { TitledSpan },
  setup() {
    const oracleScripts = ref()
    const loadOracleScripts = async () => {
      const response = await callers.getOracleScripts(100)
      console.debug('OracleScripts:', response)
      oracleScripts.value = response.oracleScripts
    }
    loadOracleScripts()

    const createOracleScript = async () => {
      showOracleScriptFormDialog({
        onSubmit: (d) => {
          d.kill()
          loadOracleScripts()
        },
      })
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
  grid:
    auto /
    minmax(2rem, 0.1fr) minmax(8rem, 0.5fr) minmax(8rem, 1fr) minmax(8rem, 0.5fr);
}
</style>
