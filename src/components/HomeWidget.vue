<template>
  <div class="home-widget-group">
    <!-- ODIN Price widget -->
    <div class="home-widget-item widget-price">
      <p class="">ODIN Price</p>
      <skeleton-loader
        v-if="fetchLoading"
        width="100"
        height="24"
        pill
        shimmer
      />
      <div v-else class="widget-odin-price">
        <h4 class="widget-green-color">
          {{ priceFormatter(odinPrice) }}
        </h4>
        <div
          class="widget-odin-percentage"
          :class="isODINPriceUp ? 'green' : 'red'"
        >
          <span v-if="isODINPriceUp" v-html="`&#9650;`"></span>
          <span v-else v-html="`&#9660;`"></span>
          {{ isODINPriceUp ? '+' : '-' }}
          {{ odinPric24HRChange.toFixed(2) + '%' }}
        </div>
      </div>
    </div>

    <!-- Market Cap widget -->
    <div class="home-widget-item">
      <p>Market Cap</p>
      <skeleton-loader
        v-if="fetchLoading"
        width="100"
        height="24"
        pill
        shimmer
      />
      <template v-else>
        <h4>{{ marketCap }}</h4>
        <small>(FDA {{ numberFormatter(fdv) }})</small>
      </template>
    </div>

    <!-- Latest Block widget -->
    <div class="home-widget-item">
      <p>Latest Block</p>
      <skeleton-loader
        v-if="fetchLoading"
        width="100"
        height="24"
        pill
        shimmer
      />
      <router-link
        v-else
        :to="{
          name: $routes.blockDetails,
          params: { id: latestBlock },
        }"
        :style="{
          textDecoration: 'none',
        }"
      >
        <h4 class="widget-action-color">#{{ latestBlock }}</h4>
      </router-link>
    </div>

    <!-- Active Validators widget -->
    <div class="home-widget-item">
      <p>Active Validators</p>
      <skeleton-loader
        v-if="fetchLoading"
        width="100"
        height="24"
        pill
        shimmer
      />
      <h4 v-else>{{ validators }}</h4>
    </div>

    <!-- Total Supply widget -->
    <div class="home-widget-item">
      <p>Total Supply</p>
      <skeleton-loader
        v-if="fetchLoading"
        width="100"
        height="24"
        pill
        shimmer
      />

      <h4 v-else>
        {{ convertToDecimal(odinNumber, 3, 2) + 'M' }}
      </h4>
    </div>

    <!-- Community Pool widget -->
    <div class="home-widget-item">
      <p>Community Pool</p>
      <skeleton-loader
        v-if="fetchLoading"
        width="100"
        height="24"
        pill
        shimmer
      />
      <template v-else>
        <h4>
          {{ numberFormatter(communityPool) }}
        </h4>
        <small>{{
          priceFormatter(odinPrice * communityPool, {
            notation: 'compact',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        }}</small>
      </template>
    </div>
  </div>

  <div class="home-widget_row_2">
    <div class="widget-content">
      <!-- Total Transactions widget -->
      <div class="content">
        <p>Total Transactions</p>
        <skeleton-loader
          v-if="fetchLoading"
          width="100"
          height="24"
          pill
          shimmer
        />
        <router-link
          v-else
          :to="{
            name: $routes.transactions,
          }"
          :style="{
            textDecoration: 'none',
          }"
        >
          <h4 class="widget-action-color">{{ transaction }}</h4>
        </router-link>
      </div>

      <!-- Total Requests widget -->
      <div class="content">
        <p>Total Requests</p>
        <skeleton-loader
          v-if="fetchLoading"
          width="100"
          height="24"
          pill
          shimmer
        />
        <h4 v-else>{{ requests }}</h4>
      </div>
    </div>

    <div class="widget-content">
      <!-- Inflation Rate widget -->
      <div class="content">
        <p>Inflation Rate</p>
        <skeleton-loader
          v-if="fetchLoading"
          width="100"
          height="24"
          pill
          shimmer
        />
        <h4 v-else>{{ (inflation * 100).toFixed(2) + '%' }}</h4>
      </div>

      <!-- Stacking APR Widget-->
      <div class="content">
        <p>Stacking APR</p>
        <skeleton-loader
          v-if="fetchLoading"
          width="100"
          height="24"
          pill
          shimmer
        />
        <h4 v-else>{{ stackingAPR + '%' }}</h4>
      </div>

      <!-- ODIN Bonded Widget-->
      <div class="content">
        <p>ODIN Bonded</p>
        <skeleton-loader
          v-if="fetchLoading"
          width="100"
          height="24"
          pill
          shimmer
        />
        <template v-else>
          <h4>{{ numberFormatter(bondedODIN) }}</h4>
          <small>{{
            priceFormatter(odinPrice * bondedODIN, {
              notation: 'compact',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          }}</small>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { callers } from '@/api/callers'
import {
  priceFormatter,
  convertToDecimal,
  numberFormatter,
} from '@/helpers/formatters'
import { convertLokiToOdin } from '@/helpers/converters'

const createDataRef = (defaultValue = 0) => ref(defaultValue)

const fetchLoading = ref(true)
const odinPrice = createDataRef()
const odinPric24HRChange = createDataRef()
const marketCap = createDataRef('$554k')
const latestBlock = createDataRef()
const validators = createDataRef()
const transaction = createDataRef()
const requests = createDataRef()
const inflation = createDataRef()
const stackingAPR = createDataRef()
const communityPool = createDataRef()
const bondedODIN = createDataRef()
const odinNumber = createDataRef()
const fdv = createDataRef()

const fetchData = async () => {
  try {
    const [
      inflationData,
      blockData,
      validatorData,
      odinPriceData,
      transactionData,
      requestCountData,
      boundedPool,
      supply,
      comPool,
    ] = await Promise.all([
      callers.getInflationRate(),
      callers.getBlockOnHeight(),
      callers.getValidatorInfo(),
      callers.getOdinPrice(),
      callers.getTxSearchFromTelemetry(0, 1, 'desc').then(res => res.json()),
      callers.getCounts(),
      callers.getBoundedPool(),
      callers.getSupply(),
      callers.getCommunityPool(),
    ])

    const supplyAmount = supply.data.supply.find(
      item => item.denom === 'loki'
    ).amount
    inflation.value = inflationData.data.inflation
    latestBlock.value = blockData.data.result.block.header.height
    validators.value = validatorData.data.result.total
    transaction.value = transactionData.total_count
    requests.value = Number(requestCountData.requestCount)
    communityPool.value = +convertLokiToOdin(comPool.data.pool[1].amount, {
      onlyNumber: true,
      toFixed: 2,
    })
    bondedODIN.value = +convertLokiToOdin(boundedPool.data.pool.bonded_tokens, {
      onlyNumber: true,
      toFixed: 2,
    })
    odinNumber.value = Number(supplyAmount)
    stackingAPR.value = +(
      (inflation.value /
        (boundedPool.data.pool.bonded_tokens / Number(supplyAmount))) *
      100
    ).toFixed(2)
    if (odinPriceData.data.price) {
      odinPrice.value = odinPriceData.data.price
      odinPric24HRChange.value = odinPriceData.data['24h_change']
    }
    fdv.value = +convertLokiToOdin(
      (supplyAmount * odinPrice.value).toString(),
      {
        onlyNumber: true,
        toFixed: 2,
      }
    )
  } finally {
    fetchLoading.value = false
  }
}

const isODINPriceUp = computed(() => odinPric24HRChange.value > 0)

let timer = null
onMounted(() => {
  timer = setInterval(async () => {
    const odinPriceData = await callers.getOdinPrice()
    if (odinPriceData.data.price) {
      odinPrice.value = odinPriceData.data.price
    }
  }, 2000)
})

onUnmounted(() => {
  clearInterval(timer)
})

onMounted(fetchData)
</script>

<style lang="scss" scoped>
.home-widget-group {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.home-widget-item {
  border-radius: 8px;
  padding: 2rem;
  background-color: var(--clr__bg-main);
  border: 0.1rem solid var(--clr__card-border);

  p {
    margin-bottom: 1rem;
    font-weight: 500;
    color: var(--clr__text-muted);
  }

  h4 {
    font-size: 2rem;
  }

  small {
    display: block;
    font-weight: 500;
    margin-top: 1rem;
    color: var(--clr__text-muted);
  }
}

.home-widget_row_2 {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  background-color: var(--clr__bg-main);
  border-radius: 8px;
  padding: 2rem 0;
  margin-bottom: 2rem;
  border: 0.1rem solid var(--clr__card-border);

  .widget-content {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .widget-content:first-child {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    border-right: 0.1rem solid var(--clr__card-border);
  }

  .content {
    padding: 0 2rem;

    p {
      margin-bottom: 1rem;
      font-weight: 500;
      color: var(--clr__text-muted);
    }

    h4 {
      font-size: 2rem;
    }

    small {
      display: block;
      font-weight: 500;
      margin-top: 1rem;
      color: var(--clr__text-muted);
    }
  }
}

.widget-price {
  h4 {
    color: var(--clr__btn-normal);
    font-size: 2.5rem;
  }
}

.widget-odin-price {
  .widget-odin-percentage {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    gap: 0.2rem;
    font-size: 14px;
    margin-top: 1rem;
  }

  .widget-odin-percentage.green {
    color: green;
  }

  .widget-odin-percentage.red {
    color: red;
  }
}

.widget-action-color {
  color: var(--clr__btn-normal);
}

@include respond-to(medium) {
  .home-widget-group {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .home-widget_row_2 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
    padding: unset;
    .content {
      padding-top: 2rem;
      padding-bottom: 2rem;
      border-bottom: 0.1rem solid var(--clr__card-border);
    }
  }
}

@include respond-to(small) {
  .widget-content {
    grid-template-columns: repeat(1, minmax(0, 1fr)) !important;
  }

  .widget-odin-price {
    flex-wrap: wrap;
  }
}
</style>
