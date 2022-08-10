<template>
  <div class="oracle-scripts-details view-main">
    <div class="view-main__title-wrapper">
      <div class="oracle-scripts-details__title-wrapper">
        <BackButton text="Oracle Scripts" />
        <h2 class="view-main__title oracle-scripts-details__title">
          Oracle Script
        </h2>
        <span v-if="!isLoadingError" class="view-main__subtitle">
          {{ oracleScriptData?.name }}
        </span>
      </div>

      <button
        v-if="isOracleScriptOwner && !isLoadingError"
        class="oracle-scripts-details__title-btn app-btn app-btn--medium"
        type="button"
        @click="editOracleScript(oracleScriptData)"
      >
        Edit Script
      </button>
    </div>

    <template v-if="!isLoading">
      <template v-if="isLoadingError">
        <div class="app-table__empty-stub">
          <ui-loading-error-message message="Not Found" title="404" />
        </div>
      </template>
      <template v-else>
        <template v-if="oracleScriptData">
          <div class="oracle-scripts-details__card info-card card-frame">
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
                'oracle-scripts-details__tab-content': isOracleScriptOwner,
              }"
            >
              <RequestsOracleScriptTable
                :oracle-script-id="String($route.params.id)"
              />
            </AppTab>
            <AppTab
              title="Code"
              :class="{
                'oracle-scripts-details__tab-content': isOracleScriptOwner,
              }"
            >
              <CodeTable :code="oracleScriptCode" />
            </AppTab>
          </AppTabs>
        </template>
        <template v-else>
          <div class="app-table__empty-stub">
            <ui-no-data-message />
          </div>
        </template>
      </template>
    </template>

    <template v-else>
      <div class="app-table__empty-stub">
        <ui-loader positionCenter message="Loading" />
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
import { OracleScriptFormModal } from '@/components/modals'
import {
  UiLoadingErrorMessage,
  UiLoader,
  UiNoDataMessage,
} from '@/components/ui'
import BackButton from '@/components/BackButton.vue'
import AppTabs from '@/components/tabs/AppTabs.vue'
import AppTab from '@/components/tabs/AppTab.vue'
import CodeTable from '@/components/tables/CodeTable.vue'
import RequestsOracleScriptTable from '@/components/tables/RequestsOracleScriptTable.vue'

const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
const isLoadingError = ref(false)
const route: RouteLocationNormalizedLoaded = useRoute()
const oracleScriptData = ref()
const oracleScriptCode = ref('')
const isOracleScriptOwner = computed(() => {
  return (
    !wallet.isEmpty && wallet.account.address === oracleScriptData.value?.owner
  )
})

const getOracleScript = async () => {
  if (Number(route.params.id) > 0) {
    const response = await callers.getOracleScript(String(route.params.id))
    oracleScriptData.value = response.oracleScript
  } else {
    throw 'Invalid Oracle Script Id'
  }
}

const getOracleScriptCode = async () => {
  if (oracleScriptData.value.sourceCodeUrl) {
    await fetch(oracleScriptData.value.sourceCodeUrl).then(response => {
      response.text().then(text => {
        oracleScriptCode.value = text
      })
    })
  }
}

const loadData = async () => {
  lockLoading()
  try {
    await Promise.all([getOracleScript(), getOracleScriptCode()])
  } catch (error) {
    isLoadingError.value = true
    handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
  }
  releaseLoading()
}

const editOracleScript = async (oracleScript: OracleScript) => {
  await showDialogHandler(
    OracleScriptFormModal,
    {
      onSubmit: async d => {
        await loadData()
        d.kill()
      },
    },
    { oracleScript },
  )
}
onMounted(async () => {
  await loadData()
})
</script>

<style lang="scss" scoped>
.oracle-scripts-details__title {
  margin: 0 1.6rem 0 2rem;
}
.oracle-scripts-details__empty-msg {
  text-align: center;
}
.oracle-scripts-details__card {
  margin-bottom: 3.4rem;
}
.oracle-scripts-details__title-wrapper {
  display: flex;
  align-items: center;
}
@include respond-to(tablet) {
  .oracle-scripts-details__title {
    margin: 0.8rem 0 0.4rem 0;
  }
  .oracle-scripts-details__title-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .oracle-scripts-details__tab-content {
    margin-bottom: 12rem;
  }
  .oracle-scripts-details {
    padding-bottom: 10rem;
  }
  .oracle-scripts-details__title-btn {
    display: none;
  }
}
</style>
