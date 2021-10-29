<template>
  <div class="chart-block">
    <div style="height: 158px; width: 158px">
      <DoughnutChart v-bind="doughnutChartProps" />
    </div>
    <template v-if="data">
      <div class="legend" @click="handler()">
        <div v-for="(item, idx) in data" :key="item.name" class="legend__item">
          <span class="legend__item-percentage">{{ percentage[idx] }}%</span>
          <span
            class="legend__item-color"
            :style="`background-color: ${item.color}`"
          />
          <span class="legend__item-lable">{{ item.name }}</span>
        </div>
      </div>
    </template>
    <template v-else>
      <span class="chart-block__empty-message">No data</span>
    </template>
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
  },
  setup: function (props) {
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
    }
  },
})
</script>

<style lang="scss" scoped>
.chart-block {
  display: flex;
  align-items: center;
  gap: 3.2rem;

  .legend {
    &__item {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      font-size: 1.4rem;

      &-percentage {
        min-width: 3.6rem;
        font-weight: 600;
      }

      &-color {
        display: block;
        width: 0.4rem;
        height: 1.4rem;
      }
    }

    & > *:not(:last-child) {
      margin-bottom: 1.6rem;
    }
  }

  &__empty-message {
    font-size: 3.2rem;
    color: var(--clr__chart-default);
    font-weight: 600;
  }
}
</style>
