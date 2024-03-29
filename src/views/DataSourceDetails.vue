<template>
  <div class="app__main-view data-source-details">
    <div class="data-source-details__header">
      <div
        class="app__main-view-detail-container data-source-detail__container"
      >
        <div class="app__main-view-detail-back-icon">
          <BackButton />
        </div>
        <div class="app__main-view-detail-title-container">
          <h2 class="app__main-view-detail-title">Data Source</h2>
          <div
            v-if="!isLoadingError"
            class="app__main-view-detail-subtitle-container"
          >
            <span class="app__main-view-detail-subtitle">
              {{ dataSourceData?.name }}
            </span>
          </div>
        </div>
      </div>
      <button
        v-if="isDataSourceOwner && !isLoadingError"
        class="data-source-details__title-btn app-btn app-btn--medium"
        type="button"
        @click="editDataSource(dataSourceData)"
      >
        Edit Data Source
      </button>
    </div>

    <template v-if="!isLoading">
      <template v-if="isLoadingError">
        <div class="app-table__empty-stub">
          <ui-loading-error-message message="Not Found" title="404" />
        </div>
      </template>
      <template v-else>
        <template v-if="dataSourceData">
          <div class="data-source-details__card info-card card-frame">
            <div class="info-card__content">
              <div class="info-card__row">
                <span class="info-card__row-title">Owner</span>
                <a
                  class="info-card__row-value info-card__row-value_txt info-card__row-link"
                  :href="`/accounts/${dataSourceData.owner}`"
                  :title="dataSourceData.owner"
                >
                  {{ dataSourceData.owner }}
                </a>
              </div>
              <div class="info-card__row">
                <span class="info-card__row-title">Description</span>
                <span class="info-card__row-value">
                  {{ dataSourceData.description || 'No description' }}
                </span>
              </div>
            </div>
          </div>
          <AppTabs>
            <AppTab
              title="Requests"
              :class="{ 'data-source-details__tab-content': isDataSourceOwner }"
            >
              <RequestsDataSourceTable
                :data-source-id="String($route.params.id)"
              />
            </AppTab>
            <AppTab
              title="Code"
              :class="{ 'data-source-details__tab-content': isDataSourceOwner }"
            >
              <CodeTable :code="dataSourceCode" />
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

    <div class="view-main__mobile-activities" v-if="isDataSourceOwner">
      <button
        class="app-btn w-full app-btn--medium"
        type="button"
        @click="editDataSource(dataSourceData)"
      >
        Edit Data Source
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { callers } from '@/api/callers'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'
import { DataSourceFormModal } from '@/components/modals'
import { showDialogHandler } from '@/components/modals/handlers/dialogHandler'
import { wallet } from '@/api/wallet'
import {
  UiLoadingErrorMessage,
  UiLoader,
  UiNoDataMessage,
} from '@/components/ui'
import BackButton from '@/components/BackButton.vue'
import AppTabs from '@/components/tabs/AppTabs.vue'
import AppTab from '@/components/tabs/AppTab.vue'
import CodeTable from '@/components/tables/CodeTable.vue'
import RequestsDataSourceTable from '@/components/tables/RequestsDataSourceTable.vue'

const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
const isLoadingError = ref(false)
const route: RouteLocationNormalizedLoaded = useRoute()
const dataSourceData = ref()
const dataSourceCode = ref('')
const isDataSourceOwner = computed(() => {
  return (
    !wallet.isEmpty && wallet.account.address === dataSourceData.value?.owner
  )
})

const getDataSource = async () => {
  const response = await callers.getDataSource(String(route.params.id))
  dataSourceData.value = response.dataSource
}

const getDataSourceCode = async () => {
  dataSourceCode.value = await callers
    .getDataSourceCode(String(route.params.id))
    .then(response => response.json())
    .then(data => data?.executable)
}

const loadData = async () => {
  lockLoading()
  try {
    await Promise.all([getDataSource(), getDataSourceCode()])
  } catch (error) {
    isLoadingError.value = true
    handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
  }
  releaseLoading()
}

const editDataSource = async (dataSource: unknown) => {
  await showDialogHandler(
    DataSourceFormModal,
    {
      onSubmit: async d => {
        await loadData()
        d.kill()
      },
    },
    { dataSource },
  )
}

onMounted(async () => {
  await loadData()
})
</script>

<style lang="scss" scoped>
.data-source-details__title {
  margin: 0 1.6rem 0 2rem;
}
.data-source-details__card {
  margin-bottom: 3.4rem;
}
.data-source-details__title-info {
  display: flex;
  justify-content: space-between;
}
.data-source-details__title-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.data-source-details__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4rem;
}

.data-source-detail__container {
  margin-bottom: 0;
}

@include respond-to(tablet) {
  .data-source-details__title-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .data-source-details__title {
    margin: 0.8rem 0 0.4rem 0;
  }
  .data-source-details__tab-content {
    margin-bottom: 12rem;
  }
  .data-source-details {
    padding-bottom: 10rem;
  }
  .data-source-details__title-btn {
    display: none;
  }
}
</style>
