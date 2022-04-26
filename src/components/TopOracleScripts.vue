<template>
  <div class="oracle-scripts__top">
    <div
      v-for="script in topOracleScripts"
      :key="script.attributes.id"
      class="oracle-scripts__top-item"
    >
      <div class="oracle-scripts__top-item-description">
        <div class="oracle-scripts__top-item-title">
          {{ script.attributes.name }}
        </div>
        <span class="oracle-scripts__top-item-text">
          {{
            script.attributes.description ||
            'ODIN Standard Dataset oracle script for querying cryptocurrency prices'
          }}
        </span>
      </div>
      <div class="oracle-scripts__top-item-info">
        <div class="oracle-scripts__top-item-value">
          <div class="oracle-scripts__top-item-text">Requests number</div>
          <div class="oracle-scripts__top-item-text">-</div>
        </div>
        <div class="oracle-scripts__top-item-value">
          <div class="oracle-scripts__top-item-text">Response time</div>
          <div class="oracle-scripts__top-item-text">-</div>
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
.oracle-scripts {
  &__top {
    display: grid;
    grid: auto/ repeat(3, 1fr);
    gap: 2.4rem;
    margin-bottom: 4rem;
  }
  &__top-item {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-width: 26rem;
    min-height: 24rem;
    padding: 3.2rem 2.4rem;
    border: 0.1rem solid var(--clr__action);
    border-radius: 0.8rem;
  }
  &__top-item-title {
    font-weight: 600;
    font-size: 1.8rem;
    padding-bottom: 2.4rem;
  }
  &__top-item-text {
    font-weight: 400;
    font-size: 1.6rem;
  }
  &__top-item-info {
    display: grid;
    grid: auto/ repeat(2, 1fr);
  }
  &__top-item-description {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
  }
  &__top-item-value {
    display: flex;
    flex-direction: column;
  }
}
@include respond-to(medium) {
  .oracle-scripts {
    &__top {
      grid: auto/repeat(2, 1fr);
      gap: 2rem;
    }
  }
}
@include respond-to(tablet) {
  .oracle-scripts {
    &__top {
      grid: auto/repeat(6, 1fr);
      overflow-x: scroll;
    }
    &__top-item {
      min-width: 28.7rem;
      min-height: 26.5rem;
      justify-content: space-between;
      padding: 3.2rem 1.6rem;
    }
  }
}
</style>
