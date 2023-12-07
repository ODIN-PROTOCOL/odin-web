<template>
  <div class="home-widget-group">
    <div class="home-widget-item widget-price">
      <p class="">ODIN Price</p>
      <skeleton-loader
        v-if="fetchLoading"
        width="100"
        height="24"
        pill
        shimmer
      />
      <h4 class="widget-green-color" v-else>{{ priceFormatter(odinPrice) }}</h4>
    </div>

    <div class="home-widget-item">
      <p>Market Cap</p>
      <skeleton-loader
        v-if="fetchLoading"
        width="100"
        height="24"
        pill
        shimmer
      />
      <h4 v-else>{{ marketCap }}</h4>
      <small>(FDA {{ numberFormatter(fdv) }})</small>
    </div>

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
  </div>

  <div class="home-widget_row_2">
    <div class="widget-content">
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

      <div class="content">
        <p>Community Pool</p>
        <skeleton-loader
          v-if="fetchLoading"
          width="100"
          height="24"
          pill
          shimmer
        />
        <h4 v-else>
          {{ numberFormatter(communityPool) }}
        </h4>
        <small>{{
          priceFormatter(odinPrice * communityPool, {
            notation: 'compact',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        }}</small>
      </div>
    </div>

    <div class="widget-content">
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

      <div class="content">
        <p>ODIN Bonded</p>
        <skeleton-loader
          v-if="fetchLoading"
          width="100"
          height="24"
          pill
          shimmer
        />
        <h4 v-else>{{ numberFormatter(bondedODIN) }}</h4>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
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
      item => item.denom === 'loki',
    ).amount

    inflation.value = inflationData.data.inflation
    latestBlock.value = blockData.data.result.block.header.height
    validators.value = validatorData.data.result.total
    odinPrice.value = odinPriceData.data[0].result['odin-protocol'].usd
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
    fdv.value = +convertLokiToOdin(
      (supplyAmount * odinPrice.value).toString(),
      {
        onlyNumber: true,
        toFixed: 2,
      },
    )
  } finally {
    fetchLoading.value = false
  }
}

let timer = null
onMounted(() => {
  timer = setInterval(async () => {
    const odinPriceData = await callers.getOdinPrice()
    odinPrice.value = odinPriceData.data[0].result['odin-protocol'].usd
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
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.home-widget-item {
  border-radius: 8px;
  padding: 2rem;
  background-color: var(--clr__bg-main);
  -webkit-box-shadow: 0px 0px 5px 1px rgba(74, 217, 176, 1);
  -moz-box-shadow: 0px 0px 5px 1px rgba(74, 217, 176, 1);
  box-shadow: 0px 0px 5px 1px rgba(74, 217, 176, 1);

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
  -webkit-box-shadow: 0px 0px 5px 1px rgba(74, 217, 176, 1);
  -moz-box-shadow: 0px 0px 5px 1px rgba(74, 217, 176, 1);
  box-shadow: 0px 0px 5px 1px rgba(74, 217, 176, 1);

  .widget-content {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .widget-content:first-child {
    border-right: 1px solid rgba(74, 217, 176, 0.3);
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

.widget-action-color {
  color: var(--clr__btn-normal);
}

@include respond-to(medium) {
  .home-widget-group {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .home-widget_row_2 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
    gap: 1.5rem;
    background-color: unset;
    border: unset;
    border-radius: unset;
    padding: unset;
  }

  .widget-content {
    gap: 2rem;
    .content {
      border-radius: 8px;
      padding: 2rem !important;
      background-color: var(--clr__search-bar-bg);
      border: 0.5px solid var(--clr__card-border);
    }
  }
}

@include respond-to(small) {
  .home-widget-group,
  .widget-content {
    grid-template-columns: repeat(1, minmax(0, 1fr)) !important;
  }
}
</style>
