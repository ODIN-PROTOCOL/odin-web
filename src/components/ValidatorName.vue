<template>
  <div class="validator-name">
    <div class="validator-name__avatar-wrapper">
      <div class="validator-name__avatar">
        <img
          v-if="descriptions.avatarUrl"
          :src="descriptions.avatarUrl"
          :alt="descriptions.moniker"
          class="validator-name__img"
        />
        <span v-else>{{ firstMonikerLetter }}</span>
      </div>
    </div>
    <div class="validator-name__info app-table__cell-txt">
      <TitledLink
        class="app-table__cell-txt app-table__link validator-name__moniker"
        :text="descriptions.moniker"
        :name="{
          name: $routes.validatorDetails,
          params: { address: operatorAddress },
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import TitledLink from '@/components/TitledLink.vue'

type Descriptions = {
  avatarUrl: string
  moniker: string
  website: string
}
const props = defineProps<{
  descriptions: Descriptions
  operatorAddress: string
}>()

const firstMonikerLetter =
  props.descriptions?.moniker.split('')[0].toUpperCase() || 'V'
</script>
<style lang="scss" scoped>
.validator-name {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
}

.validator-name__avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.2rem;
  height: 3.2rem;
  background-color: var(--clr__text-muted);
  border-radius: 50%;
  color: var(--clr__main-bg);
  font-weight: 600;
}
.validator-name__img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}
.validator-name__info {
  width: 100%;
  display: flex;
  align-items: center;
}
.validator-name__website {
  color: var(--clr__text-muted);
  font-size: 1.4rem;
  line-height: 1;
}
</style>
