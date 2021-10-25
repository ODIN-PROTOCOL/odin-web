<template>
  <div class="chart-block">
    <div style="height: 158px; width: 158px">
      <DoughnutChart v-bind="doughnutChartProps" />
    </div>
    <div class="legend">
      <div v-for="item in data" :key="item.label" class="legend__item">
        <span class="legend__item-percentage">{{ item.persentage }}</span>
        <span class="legend__item-color" :style="`background-color: ${item.color}`" />
        <span class="legend__item-lable">{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { Chart, registerables } from 'chart.js'
import { DoughnutChart, useDoughnutChart } from 'vue-chart-3'

Chart.register(...registerables)

export default defineComponent({
  components: { DoughnutChart },
  setup: function () {
    const dataValues = ref([1])
    // const labels = ref(['Approved', 'Rejected', 'Pending', 'In progress'])
    // const colors = ref(['#00D097', '#F65160', '#FDC748', '#007BFF'])
    const labels = ref(['In progress'])
    const colors = ref(['#007BFF'])

    const data = ref([
      {
        label: 'In progress',
        color: '#007BFF',
        count: 1,
        persentage: '100%',
      },
    ])

    const testData = computed(() => ({
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
          enabled: true,
        },
      },
    }))

    const { doughnutChartProps } = useDoughnutChart({
      chartData: testData,
      options,
    })

    return {
      doughnutChartProps,
      data,
      labels,
      colors,
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
}
</style>
