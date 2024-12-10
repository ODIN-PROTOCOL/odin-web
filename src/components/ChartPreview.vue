<template>
  <div>
    <template v-if="!isLoading">
      <template v-if="isLoadingError">
        <ui-loading-error-message
          message="Something went wrong"
          title="Try again!"
        />
      </template>
      <template v-else>
        <template v-if="chartData?.data?.length > 1">
          <template v-if="chartType === 'bar'">
            <CustomBarChart
              :chart-dataset="chartData"
              :dataset-label="datasetLabel"
              :dataset-unit="datasetUnit"
            />
          </template>
          <template v-if="chartType === 'line'">
            <CustomLineChart
              :chart-dataset="chartData"
              :dataset-label="datasetLabel"
              :dataset-unit="datasetUnit"
            />
          </template>
        </template>
        <template v-else>
          <div class="app-table__empty-stub">
            <ui-no-data-message-with-img
              message="Insufficient data to visualize"
            />
          </div>
        </template>
      </template>
    </template>
    <template v-else>
      <div class="app-table__empty-stub">
        <skeleton-loader
          class="chart-panel__chart-skeleton"
          width="100%"
          pill
          shimmer
        />
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, toRefs } from 'vue'
import { callers } from '@/api/callers'
import { sortingDaysForChart } from '@/helpers/helpers'
import { formatDataForCharts } from '@/helpers/customChartHelpers'
import CustomBarChart from '@/components/charts/CustomBarChart.vue'
import CustomLineChart from '@/components/charts/CustomLineChart.vue'
import { UiLoadingErrorMessage, UiNoDataMessageWithImg } from '@/components/ui'

const props = withDefaults(
  defineProps<{
    chartPageTitle: string
    chartType: string
    getDataMethodName: string
    datasetLabel: string
    datasetUnit?: string
    yAxisTitle: string
  }>(),
  {
    datasetUnit: '',
  },
)

const { getDataMethodName } = toRefs(props)
const chartData = ref()
const isLoading = ref(false)
const isLoadingError = ref(false)
const sortingValue = ref(sortingDaysForChart.lastMonth.value)
const sortingValueYear = ref(sortingDaysForChart.lastYear.value)

onMounted(async (): Promise<void> => {
  await getChartData()
})

const getChartData = async () => {
  const endDate = new Date()
  const startDate = new Date()

  const sorting_value =
    getDataMethodName.value == 'getRequestsVolumePerDays'
      ? sortingValueYear.value
      : sortingValue.value
  startDate.setDate(startDate.getDate() - Number(sorting_value))
  isLoading.value = true

  try {
    const { data } = await callers[getDataMethodName.value](startDate, endDate)
    chartData.value = formatDataForCharts(data.chartData)
    isLoadingError.value = false
  } catch (error) {
    isLoadingError.value = true
    // handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
  } finally {
    isLoading.value = false
  }
}
</script>

<style lang="scss" scoped>
.chart-panel__chart-skeleton {
  height: 100px;
}
</style>
