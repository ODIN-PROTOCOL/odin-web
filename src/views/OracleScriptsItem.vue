<template>
  <div class="oracle-script view-main">
    <div class="page-title">
      <BackButton :text="'Oracle Scripts'" />
      <h2 class="view-title">Oracle Script</h2>
      <span class="view-subtitle">
        {{ String(oracleScriptData?.name) }}
      </span>
    </div>

    <template v-if="oracleScriptData">
      <div class="info-card">
        <div class="info-card__content">
          <div class="info-card__row">
            <span class="info-card__row-title">Owner</span>
            <a
              class="
                info-card__row-value
                info-card__row-value_txt
                info-card__row-link
              "
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
    </template>
    <template v-else>
      <div class="empty-msg">
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
    const oracleScriptData = ref()

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

    onMounted(async () => {
      await getOracleScript()
    })

    return {
      API_CONFIG,
      isLoading,
      oracleScriptData,
    }
  },
})
</script>

<style lang="scss" scoped>
.view-title {
  margin: 0 1.6rem 0 2rem;
}

.empty-msg {
  text-align: center;
}

@media screen and (max-width: 768px) {
  .view-title {
    margin: 0.8rem 0 0.4rem 0;
  }
}
</style>
