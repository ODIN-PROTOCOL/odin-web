<template>
  <div class="latest-list-item">
    <div class="latest-list-item__left">
      <skeleton-loader
        class="latest-list-item__label"
        :width="42"
        :height="42"
        pill
        shimmer
      />
      <skeleton-loader
        class="latest-list-item__name w-full"
        width="100%"
        :height="16"
        pill
        shimmer
      />
      <skeleton-loader
        class="latest-list-item__time w-full"
        width="100%"
        :height="16"
        pill
        shimmer
      />
    </div>
    <div class="latest-list-item__center">
      <skeleton-loader
        class="latest-list-item__validator"
        width="100%"
        :height="16"
        pill
        shimmer
      />
      <skeleton-loader
        class="latest-list-item__to"
        width="100%"
        :height="16"
        pill
        shimmer
      />
    </div>
    <div class="latest-list-item__right">
      <skeleton-loader
        class="latest-list-item__amount"
        width="100%"
        :height="42"
        pill
        shimmer
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.latest-list-item {
  padding-bottom: 2.4rem;
  display: grid;
  grid: auto/minmax(7rem, 0.5fr) minmax(7rem, 1fr) minmax(10rem, 0.5fr);
  align-items: center;
  gap: 1.5rem;
  border-bottom: 0.1px solid var(--clr__input-border);

  &:last-child {
    padding-bottom: 0;
    border-bottom: none;
  }
}

.latest-list-item__left {
  width: 100%;
  min-width: 8rem;
  max-width: 14rem;
  display: grid;
  grid-template-columns: 4.2rem auto;
  align-items: center;
  gap: 0 0.8rem;
  @include ellipsis();
}

.latest-list-item__name {
  min-width: 2rem;
  max-width: 9rem;
  margin-bottom: 1.2rem;
  grid-row-start: 1;
  grid-row-end: 2;

  a {
    color: var(--clr__action);
    text-decoration: none;
  }
}

.latest-list-item__time {
  min-width: 2rem;
  max-width: 9rem;
  display: flex;
  align-items: center;
  grid-row-start: 2;
  grid-row-end: 3;
  color: var(--clr__text-muted);
  font-size: 1.2rem;
}

.latest-list-item__label {
  width: 4.2rem;
  height: 4.2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  grid-row-start: 1;
  grid-row-end: 3;
  background: var(--clr__input-border);
  border-radius: 0.4rem;
  font-size: 2rem;
  line-height: 2.5rem;
}

.latest-list-item__center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.2rem;
}

.latest-list-item__validator,
.latest-list-item__to {
  width: 100%;
  display: flex;
  gap: 0.8rem;
}

.latest-list-item__right {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--clr__text);
  @include ellipsis();
}

.latest-list-item__amount {
  width: 100%;
  height: 3.6rem;
  min-width: 10rem;
  max-width: 13.6rem;
  padding: 0.8rem;
  padding-left: 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: var(--clr__modal-field-bg);
  border-radius: 0.4rem;
}

@include respond-to(tablet) {
  .latest-list-item {
    grid: auto/ minmax(9.5rem, 0.5fr) minmax(8rem, 1fr);
    align-items: flex-start;
  }

  .latest-list-item__left {
    grid-template-columns: 1fr;
  }

  .latest-list-item__label {
    display: none;
  }

  .latest-list-item__right {
    justify-content: left;
  }
}
</style>
