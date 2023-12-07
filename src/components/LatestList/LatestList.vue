<template>
  <div class="latest-list">
    <div class="latest-list__header">
      <div class="latest-list__header-title">{{ header.title }}</div>
      <div class="latest-list__header-link">
        <router-link
          :data-text="header.linkDataText"
          :to="{ name: header.linkDataText }"
        >
          <span>{{ header.link }}</span>
        </router-link>
      </div>
    </div>
    <div class="latest-list__body">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  header: unknown
}>()
</script>

<style lang="scss" scoped>
.latest-list {
  width: 100%;
  padding: 3.2rem 2.4rem 5.6rem 2.4rem;
  background-color: var(--clr__main-bg);
  border: 0.1rem solid var(--clr__card-border);
  border-radius: 0.8rem;

  .latest-list__header {
    margin-bottom: 4rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .latest-list__header-title {
      font-size: 2.4rem;
      font-style: normal;
      font-weight: normal;
      line-height: 3.2rem;
    }

    .latest-list__header-link {
      color: var(--clr__action);
      font-size: 1.6rem;
      line-height: 2.4rem;

      a {
        color: inherit;
        border-bottom: 0.1rem solid var(--clr__action);
        text-decoration: none;
      }
    }
  }

  .latest-list__body {
    display: flex;
    flex-direction: column;
    gap: 2.4rem;
  }
}
</style>
