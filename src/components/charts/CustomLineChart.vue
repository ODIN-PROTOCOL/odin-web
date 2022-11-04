<template>
  <LineChart class="custom-line-chart" ref="lineRef" v-bind="lineChartProps" />
</template>

<script setup lang="ts">
import { computed, ref, toRefs } from 'vue'
import { Chart, registerables } from 'chart.js'
import { LineChart, useLineChart } from 'vue-chart-3'
import { getChartOptions } from '@/helpers/customChartHelpers'
import { formatedTelemetryDataForCharts } from '@/helpers/Types'

Chart.register(...registerables)
const props = withDefaults(
  defineProps<{
    datasetLabel?: string
    chartDataset?: formatedTelemetryDataForCharts
    datasetUnit?: string
  }>(),
  {
    datasetLabel: 'Dataset',
    chartDataset: () => ({ data: [], labels: [] }),
    datasetUnit: '',
  },
)

const { chartDataset, datasetUnit, datasetLabel } = toRefs(props)
const lineRef = ref()

const options = computed(() => {
  return getChartOptions(datasetUnit.value, chartDataset.value.labels)
})

const chartData = computed(() => ({
  labels: chartDataset.value.labels,
  datasets: [
    {
      label: datasetLabel.value,
      data: chartDataset.value.data,
      borderColor: '#6274ff',
      backgroundColor: '#6274ff',
      tension: 0.4,
      radius: 0,
    },
  ],
}))

const { lineChartProps } = useLineChart({
  chartData,
  options,
})
</script>

<style lang="scss" scoped>
.custom-line-chart {
  min-height: 10rem;
}
</style>
