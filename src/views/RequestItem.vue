<template>
  <div class="request view-main">
    <div class="page-title">
      <BackButton :text="'Requests'" />
      <h2 class="view-title">Request</h2>
      <span class="view-subtitle">Request name</span>
    </div>

    <div class="info-table">
      <div class="info-table__row">
        <span class="info-table__title">Oracle Script</span>
        <TitledLink class="info-table__link" :text="String(reqOracleScript)" />
        <CopyButton class="mg-l8" :text="String(reqOracleScript)" />
      </div>
      <div class="info-table__row">
        <span class="info-table__title">Transaction Hash</span>
        <span class="info-table__link">{{ reqTransactionHash }}</span>
        <CopyButton class="mg-l8" :text="String(reqTransactionHash)" />
      </div>
      <div class="info-table__row">
        <span class="info-table__title">Sender</span>
        <TitledLink class="info-table__link" :text="String(reqSender)" />
        <CopyButton class="mg-l8" :text="String(reqSender)" />
      </div>
      <div class="info-table__row">
        <span class="info-table__title">Report status</span>
        <StatusBlock :status="'success'" :text="'success'" />
      </div>
      <div class="info-table__row">
        <span class="info-table__title">Request to</span>
        <div class="info-table__list">
          <div
            class="info-table__list-item"
            v-for="item in reqValidators"
            :key="String(item)"
          >
            <TitledLink :text="String(item)" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import {
  RouteLocationNormalizedLoaded,
  Router,
  useRouter,
  useRoute,
} from 'vue-router'
import { callers } from '@/api/callers'
import TitledLink from '@/components/TitledLink.vue'
import CopyButton from '@/components/CopyButton.vue'
import BackButton from '@/components/BackButton.vue'
import StatusBlock from '@/components/StatusBlock.vue'

export default defineComponent({
  components: { TitledLink, CopyButton, BackButton, StatusBlock },
  setup: function () {
    const router: Router = useRouter()
    const route: RouteLocationNormalizedLoaded = useRoute()

    const reqOracleScript = ref()
    const reqTransactionHash = ref()
    const reqSender = ref()
    const reqReportStatus = ref()
    const reqValidators = ref()

    const getRequest = async () => {
      const res = await callers.getRequest(String(route.params.id))

      // TODO implement logic with real data
      console.log(res)
      reqOracleScript.value =
        '0x34513b2dad6c9aae177f01839be7f44c6866df7f7ecc7110cf9d1349ce16d5d4'
      reqTransactionHash.value = '0x75efcb5541234aea957e40182603b92822a238c1'
      reqSender.value = '0x75efcb5541234aea957e40182603b92822a238c1'
      reqReportStatus.value = 'success'
      reqValidators.value = [
        '12540765',
        '12540765',
        '12540765',
        '12540765',
        '12540765',
        '12540765',
        '12540765',
      ]
    }

    onMounted(async () => {
      await getRequest()
    })

    return {
      router,
      reqOracleScript,
      reqTransactionHash,
      reqSender,
      reqReportStatus,
      reqValidators,
    }
  },
})
</script>

<style lang="scss" scoped>
.view-title {
  margin: 0 1.6rem 0 2rem;
}

.info-table {
  &__row {
    display: flex;
    flex-direction: row;
    padding: 1.6rem 0;
    border-bottom: 1px solid var(--clr__table-border);
  }

  &__title {
    display: inline-block;
    min-width: 18.5rem;
  }

  &__link {
    @include ellipsis();
    text-decoration: none;
    color: var(--clr__action);
  }

  &__list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;
    gap: 2.4rem;

    &-item {
      @include ellipsis();
      width: 18.5rem;

      a {
        text-decoration: none;
        color: var(--clr__action);
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .view-title {
    margin: 0.8rem 0 0.4rem 0;
  }

  .info-table {
    &__title {
      min-width: 16rem;
    }

    &__list {
      flex-direction: column;
    }
  }
}
</style>
