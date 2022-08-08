<template>
  <div class="top-oracle-scripts">
    <TopOracleScriptsSkeleton v-if="isLoading" />
    <template v-else>
      <div
        v-for="script in topOracleScripts"
        :key="script.attributes.id"
        class="top-oracle-scripts__item card-frame"
      >
        <div class="top-oracle-scripts__item-description">
          <div class="top-oracle-scripts__item-row">
            <div class="top-oracle-scripts__item-title">
              {{ script.attributes.name }}
            </div>
            <div class="top-oracle-scripts__item-link">
              <router-link
                v-slot="{ navigate }"
                :to="{
                  name: $routes.oracleScriptDetails,
                  params: { id: script.attributes.id },
                }"
                custom
              >
                <button
                  @click="navigate"
                  @keypress.enter="navigate"
                  class="top-oracle-scripts__item-button"
                >
                  <img
                    src="@/assets/icons/forward-arrow.svg"
                    alt="enter-arrow"
                  />
                </button>
              </router-link>
            </div>
          </div>
          <span class="top-oracle-scripts__item-text">
            {{ script.attributes.description || 'No description' }}
          </span>
        </div>
        <div class="top-oracle-scripts__item-info">
          <div class="top-oracle-scripts__item-info-value">
            <div class="top-oracle-scripts__item-info-title">
              Requests number
            </div>
            <div class="top-oracle-scripts__item-info-text">
              {{ script.attributes.requests_number }}
            </div>
          </div>
          <div class="top-oracle-scripts__item-info-value">
            <div class="top-oracle-scripts__item-info-title">Response time</div>
            <div class="top-oracle-scripts__item-info-text">
              {{ script.attributes.response_time }} s
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import TopOracleScriptsSkeleton from '@/components/TopOracleScriptsSkeleton.vue'
import { OracleScriptFromTelemetry } from '@/types'

defineProps<{
  topOracleScripts: OracleScriptFromTelemetry
  isLoading: boolean
}>()
</script>

<style scoped lang="scss">
.top-oracle-scripts {
  display: grid;
  grid: auto/ repeat(3, 1fr);
  gap: 2.4rem;
  margin-bottom: 4rem;
  font-weight: 400;
  font-size: 1.6rem;
  line-height: 2.4rem;
}
.top-oracle-scripts__item {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 26rem;
  min-height: 24rem;
}
.top-oracle-scripts__item-title {
  font-weight: 600;
  font-size: 1.8rem;
  padding-bottom: 2.4rem;
}

.top-oracle-scripts__item-link {
  display: flex;
  flex-direction: column;
}

.top-oracle-scripts__item-button {
  margin-right: 0.5rem;
}

.top-oracle-scripts__item-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.top-oracle-scripts__item-info {
  display: grid;
  grid: auto/ repeat(2, 1fr);
}
.top-oracle-scripts__item-info-title {
  padding-bottom: 0.8rem;
  color: var(--clr__text-muted);
}
.top-oracle-scripts__item-description {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
}
.top-oracle-scripts__item-value {
  display: flex;
  flex-direction: column;
}
.top-oracle-scripts__item-info-text {
  max-width: 15rem;
}
@include respond-to(medium) {
  .top-oracle-scripts {
    grid: auto/repeat(2, 1fr);
    gap: 2rem;
  }
}
@include respond-to(tablet) {
  .top-oracle-scripts {
    grid: auto/repeat(6, 1fr);
    overflow-x: scroll;
    margin-bottom: 2rem;
  }
  .top-oracle-scripts__item {
    min-width: 28.7rem;
    min-height: 26.5rem;
    justify-content: space-between;
    padding: 3.2rem 1.6rem;
    margin-bottom: 0.7rem;
    &:first-child {
      margin-left: 0.7rem;
    }
  }
}
</style>
