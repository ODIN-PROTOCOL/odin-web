<template>
  <div class="app__main-view charts-view">
    <!-- TODO unhide when charts will be ready -->
    <!-- <h3 class="app__main-view-table-header-info-title">Charts & Stats</h3>
    <div class="charts-view__section">
      <div class="charts-view__chart-wrapper">
        <h3 class="charts-view__chart-title mg-b24">
          Total Supply & Market Cap Chart
        </h3>
        <div class="charts-view__chart-item">
          <img
            :src="require('/src/assets/images/marketBarChart.png')"
            alt="chart"
          />
        </div>
      </div>
      <div class="charts-view__chart-wrapper">
        <h3 class="charts-view__chart-title mg-b24">Block Validators Chart</h3>
        <router-link
          class="charts-view__chart-item"
          :to="{ name: $routes.blockValidatorsChart }"
        >
          <img
            :src="require('/src/assets/images/doughnutChart.png')"
            alt="chart"
          />
        </router-link>
      </div>
    </div>-->
    <h3 class="app__main-view-table-header-info-title">Blockchain Data</h3>
    <div
      v-for="(chartRow, index) in blockchainData"
      class="charts-view__section blockchain-data"
      :key="index"
    >
      <div
        v-for="item in chartRow"
        class="charts-view__chart-wrapper"
        :key="item.title"
      >
        <h3 class="charts-view__chart-title mg-b24">{{ item.title }}</h3>
        <router-link
          class="charts-view__chart-item"
          :to="{ name: item.chartPageName }"
        >
          <img
            :src="require(`/src/assets/images/${item.chartType}Chart.png`)"
            alt="chart"
          />
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { blockchainData } from '@/const'
</script>

<style lang="scss" scoped>
.app__main-view-table-header-info-title {
  padding: 4rem 0;

  &:first-child {
    padding-top: 1rem;
  }
}

.charts-view__section {
  display: flex;
  gap: 2.4rem;

  &.blockchain-data {
    padding-bottom: 2.4rem;
  }

  & > * {
    flex: 1;
  }
}

.charts-view__chart-wrapper {
  padding: 3.2rem 2.4rem;
  display: flex;
  flex-direction: column;
  border-radius: 0.8rem;
  background-color: var(--clr__card-bg);
  border: 0.1rem solid var(--clr__card-border);
}

.charts-view__chart-title {
  font-size: 1.6rem;
  font-weight: 600;
  line-height: 2.4rem;
}

.charts-view__chart-item {
  padding: 3.3rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  color: var(--clr__main-text);
  text-decoration: none;
  cursor: pointer;

  &:hover {
    color: var(--clr__secondary);
    background: var(--clr__azureish-white);
  }
}

.charts-view__chart-item-title {
  margin-top: 2.4rem;
  font-weight: 600;
  text-align: center;
}

@include respond-to(tablet) {
  .charts-view__section {
    flex-direction: column;
  }
}
</style>
