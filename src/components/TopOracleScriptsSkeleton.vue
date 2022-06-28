<template>
  <div
    v-for="frame of 6"
    :key="frame"
    class="top-oracle-scripts-skeleton card-frame"
  >
    <div class="top-oracle-scripts-skeleton__description">
      <div class="top-oracle-scripts-skeleton__title">
        <skeleton-loader
          :height="20"
          rounded
          :width="-1"
          animation="wave"
          color="rgb(225, 229, 233)"
          class="w-full"
        />
      </div>
      <span class="top-oracle-scripts-skeleton__text">
        <skeleton-loader
          v-for="text of 3"
          :key="text"
          :height="16"
          rounded
          :width="-1"
          animation="wave"
          color="rgb(225, 229, 233)"
          class="mg-b8 w-full"
        />
      </span>
    </div>
    <div class="top-oracle-scripts-skeleton__info">
      <div class="top-oracle-scripts-skeleton__info-value">
        <div class="top-oracle-scripts-skeleton__info-title">
          <skeleton-loader
            :height="16"
            :width="-1"
            rounded
            animation="wave"
            color="rgb(225, 229, 233)"
            class="w-full"
          />
        </div>
        <div class="top-oracle-scripts-skeleton__info-text w-full">
          <skeleton-loader
            :height="16"
            :width="-1"
            rounded
            animation="wave"
            color="rgb(225, 229, 233)"
            class="w-full"
          />
        </div>
      </div>
      <div class="top-oracle-scripts-skeleton__info-value">
        <div class="top-oracle-scripts-skeleton__info-title">
          <skeleton-loader
            :height="16"
            :width="-1"
            rounded
            animation="wave"
            color="rgb(225, 229, 233)"
            class="w-full"
          />
        </div>
        <div class="top-oracle-scripts-skeleton__info-text">
          <skeleton-loader
            :height="16"
            :width="-1"
            rounded
            animation="wave"
            color="rgb(225, 229, 233)"
            class="w-full"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TopOracleScriptsSkeleton',
})
</script>

<style scoped lang="scss">
.top-oracle-scripts-skeleton {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 26rem;
  min-height: 24rem;
}
.top-oracle-scripts-skeleton__title {
  font-weight: 600;
  font-size: 1.8rem;
  padding-bottom: 2.4rem;
}

.top-oracle-scripts-skeleton__info {
  display: grid;
  grid: auto/ repeat(2, 1fr);
  gap: 1rem;
}
.top-oracle-scripts-skeleton__info-title {
  padding-bottom: 0.8rem;
  color: var(--clr__text-muted);
}
.top-oracle-scripts-skeleton__description {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
}
.top-oracle-scripts-skeleton__value {
  display: flex;
  flex-direction: column;
}

@include respond-to(tablet) {
  .top-oracle-scripts-skeleton {
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
