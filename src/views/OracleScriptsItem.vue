<template>
  <div class="oracle-scripts-item view-main">
    <div class="view-main__title-wrapper">
      <div class="oracle-scripts-item__title-wrapper">
        <BackButton text="Oracle Scripts" />
        <h2 class="view-main__title oracle-scripts-item__title">
          Oracle Script
        </h2>
        <span class="view-main__subtitle">
          {{ oracleScriptData?.name }}
        </span>
      </div>

      <button
        v-if="isOracleScriptOwner"
        class="oracle-scripts-item__title-btn app-btn app-btn--medium"
        type="button"
        @click="editOracleScript(oracleScriptData)"
      >
        Edit Script
      </button>
    </div>

    <template v-if="oracleScriptData">
      <div class="oracle-scripts-item__card info-card card-frame">
        <div class="info-card__content">
          <div class="info-card__row">
            <span class="info-card__row-title">Owner</span>
            <a
              class="info-card__row-value info-card__row-value_txt info-card__row-link"
              :href="`${API_CONFIG.odinScan}/account/${oracleScriptData.owner}`"
              :title="oracleScriptData.owner"
            >
              {{ oracleScriptData.owner }}
            </a>
          </div>
          <div class="info-card__row">
            <span class="info-card__row-title">Description</span>
            <span class="info-card__row-value">
              {{ oracleScriptData.description || 'No description' }}
            </span>
          </div>
        </div>
      </div>
      <AppTabs>
        <AppTab
          title="Requests"
          :class="{
            'oracle-scripts-item__tab-content': isOracleScriptOwner,
          }"
        >
          <RequestsOracleScriptTable
            :oracle-script-id="String($route.params.id)"
          />
        </AppTab>
        <AppTab
          title="Code"
          :class="{
            'oracle-scripts-item__tab-content': isOracleScriptOwner,
          }"
        >
          <CodeTable :code="oracleScriptCode" />
        </AppTab>
      </AppTabs>
    </template>
    <template v-else>
      <div class="app-table__empty-stub">
        <p v-if="isLoading" class="empty mg-t32">Loading…</p>
        <p v-else class="empty mg-t32">No items yet</p>
      </div>
    </template>
    <div class="view-main__mobile-activities" v-if="isOracleScriptOwner">
      <button
        class="app-btn w-full app-btn--medium"
        type="button"
        @click="editOracleScript(oracleScriptData)"
      >
        Edit script
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { API_CONFIG } from '@/api/api-config'
import { callers } from '@/api/callers'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'
import { showDialogHandler } from '@/components/modals/handlers/dialogHandler'
import { OracleScript } from '@provider/codec/oracle/v1/oracle'
import { wallet } from '@/api/wallet'
import BackButton from '@/components/BackButton.vue'
import AppTabs from '@/components/tabs/AppTabs.vue'
import AppTab from '@/components/tabs/AppTab.vue'
import CodeTable from '@/components/tables/CodeTable.vue'
import RequestsOracleScriptTable from '@/components/tables/RequestsOracleScriptTable.vue'
import OracleScriptFormModal from '@/components/modals/OracleScriptFormModal.vue'

const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
const route: RouteLocationNormalizedLoaded = useRoute()
const oracleScriptData = ref()
const oracleScriptCode = ref('')
const isOracleScriptOwner = computed(() => {
  return (
    !wallet.isEmpty && wallet.account.address === oracleScriptData.value?.owner
  )
})
const getOracleScript = async () => {
  lockLoading()
  try {
    const response = await callers.getOracleScript(String(route.params.id))
    oracleScriptData.value = response.oracleScript
  } catch (error) {
    handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
  }
  releaseLoading()
}
const getOracleScriptCode = async () => {
  try {
    if (oracleScriptData.value.sourceCodeUrl) {
      await fetch(oracleScriptData.value.sourceCodeUrl).then(response => {
        response.text().then(text => {
          oracleScriptCode.value = text
        })
      })
    }
  } catch (error) {
    handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
  }
}
const editOracleScript = async (oracleScript: OracleScript) => {
  await showDialogHandler(
    OracleScriptFormModal,
    {
      onSubmit: async d => {
        d.kill()
        await getOracleScript()
      },
    },
    { oracleScript },
  )
}
onMounted(async () => {
  await getOracleScript()
  await getOracleScriptCode()
})
</script>

<style lang="scss" scoped>
.oracle-scripts-item__title {
  margin: 0 1.6rem 0 2rem;
}
.oracle-scripts-item__empty-msg {
  text-align: center;
}
.oracle-scripts-item__card {
  margin-bottom: 3.4rem;
}
.oracle-scripts-item__title-wrapper {
  display: flex;
  align-items: center;
}
@include respond-to(tablet) {
  .oracle-scripts-item__title {
    margin: 0.8rem 0 0.4rem 0;
  }
  .oracle-scripts-item__title-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .oracle-scripts-item__tab-content {
    margin-bottom: 12rem;
  }
  .oracle-scripts-item {
    padding-bottom: 10rem;
  }
  .oracle-scripts-item__title-btn {
    display: none;
  }
}
</style>
