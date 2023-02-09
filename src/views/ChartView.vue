<template>
  <div class="app__main-view chart-view">
    <div class="app__main-view-detail-container">
      <div class="app__main-view-detail-back-icon">
        <BackButton />
      </div>
      <div class="app__main-view-detail-title-container">
        <h2 class="app__main-view-detail-title">
          {{ chartPageTitle }}
        </h2>
      </div>
    </div>

    <div class="chart-view__container">
      <div class="chart-view__sort-wrapper">
        <div class="chart-view__y-axis">
          <span v-if="chartData?.data?.length > 1 && !isLoading">
            {{ yAxisTitle }}
          </span>
        </div>

        <VuePicker
          class="app-form__field-input app-filter app-filter--coin _vue-picker"
          name="filter"
          v-model="sortingValue"
          :is-disabled="isLoading"
        >
          <template #dropdownInner>
            <div class="_vue-picker__dropdown-custom">
              <VuePickerOption
                v-for="{ text, value } in sortingDaysForChart"
                :key="text"
                :value="value"
                :text="text"
              >
                {{ text }}
              </VuePickerOption>
            </div>
          </template>
        </VuePicker>
      </div>

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
          <ui-loader positionCenter message="Loading" />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, toRefs, watch } from 'vue'
import { callers } from '@/api/callers'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import { formatDataForCharts } from '@/helpers/customChartHelpers'
import { sortingDaysForChart } from '@/helpers/helpers'
import CustomBarChart from '@/components/charts/CustomBarChart.vue'
import CustomLineChart from '@/components/charts/CustomLineChart.vue'
import BackButton from '@/components/BackButton.vue'
import {
  UiLoadingErrorMessage,
  UiLoader,
  UiNoDataMessageWithImg,
} from '@/components/ui'

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
const sortingValue = ref(sortingDaysForChart.lastMonth.value)
const sortingValueYear = ref(sortingDaysForChart.lastYear.value)
const isLoadingError = ref(false)

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
    chartData.value = formatDataForCharts(data)
    isLoadingError.value = false
  } catch (error) {
    isLoadingError.value = true
    handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
  } finally {
    isLoading.value = false
  }
}

watch(sortingValue, async (): Promise<void> => await getChartData())

onMounted(async (): Promise<void> => {
  await getChartData()
})
</script>

<style lang="scss" scoped>
.chart-view__container {
  padding: 3.2rem 2.4rem;
  border-radius: 0.8rem;
  background-color: var(--clr__card-bg);
  border: 0.1rem solid var(--clr__card-border);
}

.chart-view__sort-wrapper {
  margin-bottom: 2.4rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.chart-view__y-axis {
  font-size: 1.6rem;
  font-weight: 600;
  line-height: 2.4rem;
}

@include respond-to(tablet) {
  .chart-view__sort-wrapper {
    flex-direction: column-reverse;
    gap: 3.2rem;

    .app-filter {
      padding: 0;
      width: 100%;
    }
  }
}
</style>
