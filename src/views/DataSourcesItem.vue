<template>
  <div class="view-main">
    <div class="view-main__title-wrapper">
      <BackButton :text="'Data Sources'" />
      <h2 class="view-main__title">Data Source</h2>
      <span class="view-main__subtitle">
        {{ String(dataSourceData?.name) }}
      </span>
    </div>

    <template v-if="dataSourceData">
      <div class="info-card">
        <div class="info-card__content">
          <div class="info-card__row">
            <span class="info-card__row-title">Owner</span>
            <a
              class="info-card__row-value info-card__row-value_txt info-card__row-link"
              :href="`${API_CONFIG.odinScan}/account/${dataSourceData.owner}`"
              :title="dataSourceData.owner"
            >
              {{ dataSourceData.owner }}
            </a>
          </div>
          <div class="info-card__row">
            <span class="info-card__row-title">Description</span>
            <span class="info-card__row-value">
              {{ dataSourceData.description }}
            </span>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="view-main__empty-msg">
        <p v-if="isLoading">Loading…</p>
        <p v-else>Data source not found</p>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { API_CONFIG } from '@/api/api-config'
import { callers } from '@/api/callers'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import { handleError } from '@/helpers/errors'
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'
import BackButton from '@/components/BackButton.vue'

export default defineComponent({
  components: { BackButton },
  setup: function () {
    const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
    const route: RouteLocationNormalizedLoaded = useRoute()
    const dataSourceData = ref()

    const getDataSource = async () => {
      lockLoading()
      try {
        const response = await callers.getDataSource(String(route.params.id))

        dataSourceData.value = response.dataSource
      } catch (error) {
        handleError(error as Error)
      }
      releaseLoading()
    }

    onMounted(async () => {
      await getDataSource()
    })

    return {
      API_CONFIG,
      isLoading,
      dataSourceData,
    }
  },
})
</script>

<style lang="scss" scoped>
.view-main {
  &__title {
    margin: 0 1.6rem 0 2rem;
  }

  &__empty-msg {
    text-align: center;
  }
}

@include respond-to(tablet) {
  .view-main {
    &__title {
      margin: 0.8rem 0 0.4rem 0;
    }
  }
}
</style>
