<template>
  <div class="view-main">
    <div class="view-main__title-wrapper">
      <BackButton :text="'Oracle Scripts'" />
      <h2 class="view-main__title">Oracle Script</h2>
      <span class="view-main__subtitle">
        {{ String(oracleScriptData?.name) }}
      </span>
    </div>

    <template v-if="oracleScriptData">
      <div class="info-card">
        <div class="info-card__content">
          <div class="info-card__row">
            <span class="info-card__row-title">Owner</span>
            <a
              class="info-card__row-value info-card__row-value_txt info-card__row-link"
              :href="`${API_CONFIG.odinScan}/account/${oracleScriptData.owner}`"
              :title="oracleScriptData.owner"
            >
              {{ oracleScriptData.owner }}
            </a>
          </div>
          <div class="info-card__row">
            <span class="info-card__row-title">Description</span>
            <span class="info-card__row-value">
              {{ oracleScriptData.description }}
            </span>
          </div>
        </div>
      </div>
      <Tabs>
        <Tab title="Code">
          <CodeTable :code="oracleScriptCode" />
        </Tab>
      </Tabs>
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
import Tabs from '@/components/tabs/Tabs.vue'
import Tab from '@/components/tabs/Tab.vue'
import CodeTable from '@/components/tables/CodeTable.vue'

export default defineComponent({
  components: { BackButton, Tabs, Tab, CodeTable },
  setup: function () {
    const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
    const route: RouteLocationNormalizedLoaded = useRoute()
    const oracleScriptData = ref()
    const oracleScriptCode = ref('')

    const getOracleScript = async () => {
      lockLoading()
      try {
        const response = await callers.getOracleScript(String(route.params.id))

        oracleScriptData.value = response.oracleScript
      } catch (error) {
        handleError(error as Error)
      }
      releaseLoading()
    }
    const getOracleScriptCode = async () => {
      lockLoading()
      try {
        oracleScriptCode.value = await callers
          .getDataSourceCode(String(1))
          .then((response) => response.json())
          .then((data) => data?.executable)
      } catch (error) {
        handleError(error as Error)
      }
      releaseLoading()
    }
    onMounted(async () => {
      await getOracleScript()
      await getOracleScriptCode()
    })

    return {
      API_CONFIG,
      isLoading,
      oracleScriptData,
      getOracleScriptCode,
      oracleScriptCode,
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
