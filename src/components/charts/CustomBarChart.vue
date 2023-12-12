<template>
  <BarChart class="custom-bar-chart" ref="barRef" v-bind="barChartProps" />
</template>

<script lang="ts" setup>
import { computed, ref, toRefs } from 'vue'
import { Chart, registerables } from 'chart.js'
import { BarChart, useBarChart } from 'vue-chart-3'
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
    datasetUnit: '',
    chartDataset: () => ({ data: [], labels: [] }),
  },
)

const { chartDataset, datasetUnit, datasetLabel } = toRefs(props)
const barRef = ref()

const options = computed(() => {
  return getChartOptions(datasetUnit.value, chartDataset.value.labels)
})

const chartData = computed(() => ({
  labels: chartDataset.value.labels,
  datasets: [
    {
      label: datasetLabel.value,
      data: chartDataset.value.data,
      backgroundColor: '#6274ff',
      hoverBackgroundColor: '#6274ff',
      borderRadius: 8,
      tension: 0.4,
      maxBarThickness: 170,
    },
  ],
}))

const { barChartProps } = useBarChart({ chartData, options })
</script>
