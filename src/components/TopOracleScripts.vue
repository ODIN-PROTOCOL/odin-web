<template>
  <div class="top-oracle-scripts">
    <div
      v-for="script in topOracleScripts"
      :key="script.attributes.id"
      class="top-oracle-scripts__item"
    >
      <div class="top-oracle-scripts__item-description">
        <div class="top-oracle-scripts__item-title">
          {{ script.attributes.name }}
        </div>
        <span class="top-oracle-scripts__item-text">
          {{ script.attributes.description || 'No description' }}
        </span>
      </div>
      <div class="top-oracle-scripts__item-info">
        <div class="top-oracle-scripts__item-info-value">
          <div class="top-oracle-scripts__item-info-title">Requests number</div>
          <div class="top-oracle-scripts__item-info-text">-</div>
        </div>
        <div class="top-oracle-scripts__item-info-value">
          <div class="top-oracle-scripts__item-info-title">Response time</div>
          <div class="top-oracle-scripts__item-info-text">-</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  components: {},
  props: {
    topOracleScripts: {
      required: true,
    },
  },
  setup() {
    return {}
  },
})
</script>

<style scoped lang="scss">
.top-oracle-scripts {
  display: grid;
  grid: auto/ repeat(3, 1fr);
  gap: 2.4rem;
  margin-bottom: 4rem;
  font-weight: 400;
  font-size: 1.6rem;
  line-height: 24px;

  &__item {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-width: 26rem;
    min-height: 24rem;
    padding: 3.2rem 2.4rem;
    border: 0.1rem solid var(--clr__action);
    border-radius: 0.8rem;
  }
  &__item-title {
    font-weight: 600;
    font-size: 1.8rem;
    padding-bottom: 2.4rem;
  }

  &__item-info {
    display: grid;
    grid: auto/ repeat(2, 1fr);
  }
  &__item-info-title {
    padding-bottom: 0.8rem;
    color: var(--clr__text-muted);
  }
  &__item-description {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
  }
  &__item-value {
    display: flex;
    flex-direction: column;
  }
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

    &__item {
      min-width: 28.7rem;
      min-height: 26.5rem;
      justify-content: space-between;
      padding: 3.2rem 1.6rem;
    }
  }
}
</style>
