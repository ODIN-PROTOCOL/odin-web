<template>
  <div class="custom-doughnut-chart">
    <div class="custom-doughnut-chart__chart-wrapper">
      <DoughnutChart v-bind="doughnutChartProps" />
    </div>
    <div v-if="isLoading" class="custom-doughnut-chart__legend">
      <div
        v-for="item in dataLegendEmpty"
        :key="item"
        class="custom-doughnut-chart__legend-item"
      >
        <skeleton-loader
          :height="16"
          :width="150"
          :rounded="true"
          animation="wave"
          color="rgb(225, 229, 233)"
        />
      </div>
    </div>
    <div v-else-if="data" class="custom-doughnut-chart__legend">
      <div
        v-for="(item, idx) in data"
        :key="item.name"
        class="custom-doughnut-chart__legend-item"
      >
        <span class="custom-doughnut-chart__legend-item-percentage"
          >{{ percentage[idx] }}%</span
        >
        <span
          class="custom-doughnut-chart__legend-item-color"
          :style="`background-color: ${item.color}`"
        />
        <span class="custom-doughnut-chart__legend-item-lable">{{
          item.name
        }}</span>
      </div>
    </div>
    <div v-else>
      <span class="custom-doughnut-chart__empty-message">No data</span>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  PropType,
  ref,
  toRef,
  watch,
} from 'vue'
import { Chart, registerables } from 'chart.js'
import { DoughnutChart, useDoughnutChart } from 'vue-chart-3'
import { ChartDataItem } from '@/helpers/Types'
import {
  defaultChartData,
  getPercentageForChartValues,
} from '@/helpers/chartHelpers'

Chart.register(...registerables)

export default defineComponent({
  components: { DoughnutChart },
  props: {
    data: { type: (Array as PropType<Array<ChartDataItem>>) || undefined },
    isLoading: { type: Boolean, required: true },
  },
  setup: function (props) {
    const dataLegendEmpty = [1, 2, 3, 4, 5, 6]
    const _data = toRef(props, 'data')
    const labels = ref<string[]>([])
    const dataValues = ref<number[]>([])
    const colors = ref<string[]>([])
    const percentage = ref<number[]>([])
    const isTooltipeEnabled = ref<boolean>()

    const prepareData = () => {
      const l: string[] = []
      const v: number[] = []
      const c: string[] = []
      let totalCount = 0

      resetChartData()

      if (_data.value) {
        _data.value.forEach((item) => {
          l.push((item as ChartDataItem).name)
          v.push((item as ChartDataItem).count)
          c.push((item as ChartDataItem).color)
          totalCount += (item as ChartDataItem).count
        })
      }

      if (totalCount) {
        labels.value = [...l]
        dataValues.value = [...v]
        colors.value = [...c]
        isTooltipeEnabled.value = true
      }

      percentage.value = getPercentageForChartValues(v, totalCount)
    }

    const resetChartData = () => {
      labels.value = defaultChartData.labels
      dataValues.value = defaultChartData.dataValues
      colors.value = defaultChartData.colors
      isTooltipeEnabled.value = false
    }

    watch(
      () => _data.value,
      () => {
        prepareData()
      }
    )

    const chartData = computed(() => ({
      labels: labels.value,
      datasets: [
        {
          data: dataValues.value,
          backgroundColor: colors.value,
        },
      ],
    }))

    const options = computed(() => ({
      cutout: 45,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: isTooltipeEnabled.value,
        },
      },
    }))

    const { doughnutChartProps } = useDoughnutChart({
      chartData,
      options,
    })

    onMounted(() => {
      resetChartData()
    })

    return {
      percentage,
      doughnutChartProps,
      dataLegendEmpty,
    }
  },
})
</script>

<style lang="scss" scoped>
.custom-doughnut-chart {
  display: flex;
  align-items: center;
  gap: 3.2rem;
}
.custom-doughnut-chart__chart-wrapper {
  height: 15.8rem;
  width: 15.8rem;
}
.custom-doughnut-chart__legend-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1.4rem;
  margin-bottom: 1.6rem;
  &:last-child {
    margin-bottom: 0;
  }
}

.custom-doughnut-chart__legend-item-percentage {
  min-width: 3.6rem;
  font-weight: 600;
}

.custom-doughnut-chart__legend-item-color {
  display: block;
  width: 0.4rem;
  height: 1.4rem;
}
.custom-doughnut-chart__empty-message {
  font-size: 3.2rem;
  color: var(--clr__chart-default);
  font-weight: 600;
}

@media screen and (max-width: 375px) {
  .custom-doughnut-chart {
    flex-direction: column;
  }
  .custom-doughnut-chart__chart-wrapper {
    height: 14.8rem;
    width: 14.8rem;
  }
}
</style>
