<template>
  <div
    class="requests-data-source load-fog"
    :class="{
      'load-fog_show': isLoading,
    }"
  >
    <div class="app-table" v-if="requests">
      <div class="app-table__head">
        <span>Request ID</span>
        <span>Oracle Script</span>
        <span>Timestamp</span>
      </div>
      <div class="app-table__body">
        <template v-if="requests.length">
          <div
            v-for="(item, index) in requests"
            :key="item.attributes?.oracle_script_id"
            class="app-table__row"
          >
            <div class="app-table__cell">
              <span class="app-table__title">Request ID</span>
              <TitledLink
                class="app-table__cell-txt app-table__link"
                :text="`#${item.id}`"
                :to="`/requests/${item.id}`"
              />
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Transactions</span>
              <TitledLink
                class="app-table__cell-txt app-table__link"
                :text="getRequestItemName(index)"
                :to="`/oracle-scripts/${item.attributes?.oracle_script_id}`"
              />
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Timestamp</span>
              <span>{{
                $fDate(
                  new Date(item.attributes.timestamp * 1000),
                  'HH:mm dd.MM.yy'
                )
              }}</span>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="app-table__empty-stub">
            <span v-if="isLoading" class="empty mg-t32">Loading…</span>
            <span v-else class="empty mg-t32">No items yet</span>
          </div>
        </template>
      </div>
    </div>
    <template v-if="requestsCount > ITEMS_PER_PAGE">
      <AppPagination
        class="mg-t32 mg-b32"
        v-model="currentPage"
        :pages="totalPages"
        @update:modelValue="getDataSourceRequests"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { toHex } from '@cosmjs/encoding'
import { API_CONFIG } from '@/api/api-config'
import AppPagination from '@/components/AppPagination/AppPagination.vue'
import { callers } from '@/api/callers'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import TitledLink from '@/components/TitledLink.vue'

export default defineComponent({
  components: { AppPagination, TitledLink },
  props: {
    dataSourceId: { type: String, required: true },
  },
  setup: function (props) {
    const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
    const ITEMS_PER_PAGE = 5
    const currentPage = ref(1)
    const totalPages = ref(0)
    const requests = ref()
    const requestsCount = ref()

    const getDataSourceRequests = async () => {
      lockLoading()
      try {
        const response = await callers
          .getDataSourceRequests(
            props.dataSourceId,
            currentPage.value - 1,
            ITEMS_PER_PAGE
          )
          .then((response) => response.json())
          .then((data) => data)
        requests.value = response.data
        requestsCount.value = response.total_count || 0
        totalPages.value = Math.ceil(requestsCount.value / ITEMS_PER_PAGE)
      } catch (error) {
        handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
      }
      releaseLoading()
    }
    const getRequestItemName = (index: number) => {
      const item = requests.value[index]
      if (!item?.attributes.oracle_script_name) return '-'
      else
        return `#${item?.attributes?.oracle_script_id}${item?.attributes?.oracle_script_name}`
    }
    onMounted(async () => {
      await getDataSourceRequests()
    })

    return {
      isLoading,
      API_CONFIG,
      ITEMS_PER_PAGE,
      currentPage,
      totalPages,
      requestsCount,
      requests,
      toHex,
      getDataSourceRequests,
      getRequestItemName,
    }
  },
})
</script>

<style lang="scss" scoped>
.requests-data-source {
  margin-bottom: 3rem;
}
.app-table__head,
.app-table__row {
  grid:
    auto /
    minmax(3rem, 1fr)
    minmax(8rem, 2fr)
    minmax(8rem, 0.5fr);
}
@include respond-to(tablet) {
  .app-table__head,
  .app-table__row {
    grid: none;
  }
}
@include respond-to(small) {
  .app-table__title {
    min-width: 12rem;
  }
}
</style>
