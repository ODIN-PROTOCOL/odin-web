<template>
  <div
    class="data-source-item view-main load-fog"
    :class="{
      'load-fog_show': isLoading,
    }"
  >
    <div class="view-main__title-wrapper">
      <div class="data-source-item__title-wrapper">
        <BackButton text="Data Sources" />
        <h2 class="view-main__title data-source-item__title">Data Source</h2>
        <span class="view-main__subtitle">
          {{ dataSourceData?.name }}
        </span>
      </div>
      <button
        v-if="isDataSourceOwner"
        class="data-source-item__title-btn app-btn app-btn--medium"
        type="button"
        @click="editDataSource(dataSourceData)"
      >
        Edit Data Source
      </button>
    </div>

    <template v-if="dataSourceData">
      <div class="data-source-item__card info-card card-frame">
        <div class="info-card__content">
          <div class="info-card__row">
            <span class="info-card__row-title">Owner</span>
            <a
              class="info-card__row-value info-card__row-value_txt info-card__row-link"
              :href="`${API_CONFIG.odinScan}/account/${dataSourceData.owner}`"
              :title="dataSourceData.owner"
            >
              {{ dataSourceData.owner }}
            </a>
          </div>
          <div class="info-card__row">
            <span class="info-card__row-title">Description</span>
            <span class="info-card__row-value">
              {{ dataSourceData.description }}
            </span>
          </div>
        </div>
      </div>
      <AppTabs>
        <AppTab
          title="Requests"
          :class="{ 'data-source-item__tab-content': isDataSourceOwner }"
        >
          <RequestsDataSourceTable :data-source-id="String($route.params.id)" />
        </AppTab>
        <AppTab
          title="Code"
          :class="{ 'data-source-item__tab-content': isDataSourceOwner }"
        >
          <CodeTable :code="dataSourceCode" />
        </AppTab>
      </AppTabs>
    </template>
    <template v-else>
      <div class="app-table__empty-stub">
        <span v-if="isLoading" class="empty mg-t32">Loading…</span>
        <span v-else class="empty mg-t32">No items yet</span>
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

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import { API_CONFIG } from '@/api/api-config'
import { callers } from '@/api/callers'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'
import BackButton from '@/components/BackButton.vue'
import AppTabs from '@/components/tabs/AppTabs.vue'
import AppTab from '@/components/tabs/AppTab.vue'
import CodeTable from '@/components/tables/CodeTable.vue'
import RequestsDataSourceTable from '@/components/tables/RequestsDataSourceTable.vue'

import { showDialogHandler } from '@/components/modals/handlers/dialogHandler'
import DataSourceFormModal from '@/components/modals/DataSourceFormModal.vue'
import { wallet } from '@/api/wallet'

export default defineComponent({
  components: {
    BackButton,
    AppTabs,
    AppTab,
    CodeTable,
    RequestsDataSourceTable,
  },
  setup: function () {
    const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
    const route: RouteLocationNormalizedLoaded = useRoute()
    const dataSourceData = ref()
    const dataSourceRequests = ref({})
    const dataSourceCode = ref('')
    const isDataSourceOwner = computed(() => {
      return wallet.account.address === dataSourceData.value?.owner
    })
    const getDataSource = async () => {
      lockLoading()
      try {
        const response = await callers.getDataSource(String(route.params.id))
        dataSourceData.value = response.dataSource
      } catch (error) {
        handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
      }
      releaseLoading()
    }
    const getDataSourceCode = async () => {
      try {
        dataSourceCode.value = await callers
          .getDataSourceCode(String(route.params.id))
          .then((response) => response.json())
          .then((data) => data?.executable)
      } catch (error) {
        handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
      }
    }
    const editDataSource = async (dataSource: unknown) => {
      await showDialogHandler(
        DataSourceFormModal,
        {
          onSubmit: async (d) => {
            d.kill()
            await getDataSource()
          },
        },
        { dataSource }
      )
    }
    onMounted(async () => {
      await getDataSource()
      await getDataSourceCode()
    })

    return {
      API_CONFIG,
      isLoading,
      dataSourceData,
      dataSourceCode,
      dataSourceRequests,
      getDataSourceCode,
      editDataSource,
      isDataSourceOwner,
    }
  },
})
</script>

<style lang="scss" scoped>
.data-source-item__title {
  margin: 0 1.6rem 0 2rem;
}
.data-source-item__card {
  margin-bottom: 3.4rem;
}
.data-source-item__title-info {
  display: flex;
  justify-content: space-between;
}
.data-source-item__title-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}
@include respond-to(tablet) {
  .data-source-item__title-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .data-source-item__title {
    margin: 0.8rem 0 0.4rem 0;
  }
  .data-source-item__tab-content {
    margin-bottom: 12rem;
  }
  .data-source-item {
    padding-bottom: 10rem;
  }
  .data-source-item__title-btn {
    display: none;
  }
}
</style>
