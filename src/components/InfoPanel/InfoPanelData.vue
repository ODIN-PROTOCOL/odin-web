<template>
  <div class="info-panel-data">
    <div
      class="info-panel-data__row"
      v-for="({ title, text }, index) in infoPanelRows"
      :key="index"
    >
      <div class="info-panel-data__title">{{ title }}</div>
      <span class="info-panel-data__text">{{ text }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Link } from '@/helpers/Types'
defineProps<{
  infoPanelRows: Link[]
}>()
</script>
<style lang="scss" scoped>
.info-panel-data {
  display: grid;
  grid: auto/ repeat(4, 1fr);
  gap: 2rem;
}
.info-panel-data__row {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 3.2rem 2.4rem;
  max-height: 14rem;
  background: linear-gradient(
    180deg,
    var(--clr__panel-main-background) 0%,
    var(--clr__panel-second-background) 100%
  );
  box-shadow: 0 0.4rem 0.8rem var(--clr__panel-box-shadow);
  border-radius: 0.8rem;
}
.info-panel-data__title {
  margin-bottom: 0.4rem;
  font-size: 1.6rem;
  font-weight: 400;
}
.info-panel-data__text {
  font-weight: 600;
  font-size: 2.4rem;
  line-height: 3.2rem;
}
@include respond-to(tablet) {
  .info-panel-data {
    grid: auto/ repeat(2, 1fr);
  }
  .info-panel-data__row {
    padding: 2rem 1.6rem;
    height: 10rem;
  }
  .info-panel-data__text {
    font-size: 2rem;
    line-height: 2.4rem;
  }
}

@include respond-to(small) {
  .info-panel-data {
    gap: 1.5rem;
  }
  .info-panel-data__row {
    padding: 2rem 1.6rem;
    height: 10rem;
  }
}
</style>
