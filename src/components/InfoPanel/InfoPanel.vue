<template>
  <transition name="fade" mode="out-in">
    <div class="info-panel">
      <InfoPanelData class="info-panel__data" :info-panel-rows="totalData" />
      <div class="info-panel__chart-wrapper">
        <div class="info-panel__chart-title">
          Transactions history statistics
        </div>
        <div class="info-panel__chart">
          <skeleton-loader
            v-if="isLoading"
            class="info-panel__chart-skeleton"
            width="100%"
            pill
            shimmer
          />
          <CustomLineChart
            v-else
            class="info-panel__custom-line-chart"
            :chart-dataset="chartData"
            :dataset-label="'Transactions'"
          />
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { callers } from '@/api/callers'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import { formatDataForCharts } from '@/helpers/customChartHelpers'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import { getAPIDate } from '@/helpers/requests'
import { CoingeckoCoinsType, Link } from '@/helpers/Types'
import CustomLineChart from '@/components/charts/CustomLineChart.vue'
import InfoPanelData from './InfoPanelData.vue'

const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()

const CHART_DATA_PERIOD = 7

const chartData = ref()
const transactionCount = ref()
const totalData = ref<Link[]>([])

const getTotalTxNumber = async () => {
  try {
    const { total_count } = await callers
      .getTxSearchFromTelemetry(0, 1, 'desc')
      .then(resp => resp.json())

    transactionCount.value = total_count
  } catch (error) {
    handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
  }
}

const getLatestTelemetry = async (): Promise<void> => {
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - CHART_DATA_PERIOD)

  try {
    const { data } = await callers.getTxVolumePerDays(startDate, endDate)
    chartData.value = formatDataForCharts(data)
  } catch (error) {
    handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getCoinInfo = async (): Promise<void> => {
  const {
    data: {
      name: odinName,
      market_data: {
        current_price: { usd: odinUSD },
        market_cap: { usd: odinMarketCapUSD },
      },
    },
  } = (await getAPIDate(
    `${process.env.VUE_APP_COINGECKO_API}/coins/odin-protocol`,
  )) as CoingeckoCoinsType

  const {
    data: {
      name: geoDBName,
      market_data: {
        current_price: { usd: geoDBUSD },
        market_cap: { usd: geoDBMarketCapUSD },
      },
    },
  } = (await getAPIDate(
    `${process.env.VUE_APP_COINGECKO_API}/coins/geodb`,
  )) as CoingeckoCoinsType

  totalData.value = [
    { title: odinName, text: `$${odinUSD}` },
    { title: geoDBName, text: `$${geoDBUSD}` },
    {
      title: 'Transactions',
      text: `${transactionCount.value || 'Insufficient data'}`,
    },
    {
      title: 'Market CAP',
      text: `$${odinMarketCapUSD + geoDBMarketCapUSD}`,
    },
  ]
}

onMounted(async () => {
  lockLoading()

  try {
    await getTotalTxNumber()
    // Don`t work request
    // await getCoinInfo()
    await getLatestTelemetry()
  } catch (error) {
    handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
  }

  releaseLoading()
})
</script>

<style lang="scss" scoped>
.info-panel__empty {
  display: flex;
  justify-content: center;
  align-items: center;
  grid-column-start: 1;
  grid-column-end: -1;
  color: var(--clr__input-border);
  font-size: 3.2rem;
  font-weight: 600;
  text-transform: uppercase;
}

.info-panel__empty-chart {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--clr__input-border);
  font-size: 3.4rem;
  font-weight: 600;
  text-transform: uppercase;

  @include respond-to(small) {
    text-align: center;
    font-size: 2.4rem;
  }
}

.info-panel__chart-wrapper {
  margin-bottom: 3.2rem;
  padding: 3.2rem 2.4rem;
  width: 100%;
  min-height: 20.5rem;
  background-color: var(--clr__card-bg);
  border: 0.1rem solid var(--clr__card-border);
  border-radius: 0.8rem;
}

.info-panel__chart-title {
  margin-bottom: 1.53rem;
  font-size: 2.4rem;
  font-weight: 400;
}

.info-panel__chart {
  min-height: 19.5rem;

  canvas {
    height: 19.5rem;
  }
}

.info-panel__chart-skeleton {
  width: 100%;
  height: 19rem;
}

.info-panel__custom-line-chart {
  max-height: 19.5rem;
}

@include respond-to(tablet) {
  .info-panel__text {
    font-size: 2rem;
    line-height: 2.4rem;
  }

  .info-panel__chart {
    grid-column: 1/-1;
  }
}
</style>
