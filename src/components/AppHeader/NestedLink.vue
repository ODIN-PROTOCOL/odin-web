<template>
  <div class="nested-link" :class="{ ['nested-link--active']: isDropdownOpen }">
    <span class="nested-link__title-container">
      <span class="nested-link__title">{{ list.name }}</span>
      <ArrowIcon class="nested-link__arrow" />
    </span>
    <transition name="fade">
      <div class="nested-link__list">
        <template v-for="link in list.links" :key="link.name">
          <router-link
            class="nested-link__list-item"
            :data-text="link.text"
            :to="{ name: link.name }"
            @click="isRedirect()"
          >
            <span>{{ link.text }}</span>
          </router-link>
        </template>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { ArrowIcon } from '@/components/icons'
import { LinkList } from '@/helpers/Types'

enum EVENTS {
  redirect = 'redirect',
}

defineProps<{
  list: LinkList
  isDropdownOpen: boolean
}>()

const emit = defineEmits<{
  (e: EVENTS.redirect): void
}>()

const isRedirect = () => {
  emit(EVENTS.redirect)
}
</script>

<style lang="scss" scoped>
.nested-link {
  position: relative;
  white-space: nowrap;
}

.nested-link__title-container {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.nested-link__title {
  margin-right: 0.4rem;
}

.nested-link__arrow {
  fill: var(--clr__header-nav-txt);
}

.nested-link__list {
  min-width: 16.7rem;
  display: none;
  flex-direction: column;
  position: absolute;
  top: 100%;
  left: 0;
  background-color: var(--clr__dropdown-bg);
  border-radius: 0 0 0.8rem 0.8rem;
  box-shadow: 0 0.4rem 2.4rem rgba(8, 87, 172, 0.12);
  z-index: 99;

  .nested-link__list-item {
    padding: 0.8rem 1.2rem;
    color: var(--clr__dropdown);
    text-decoration: none;

    &:last-child {
      border-end-start-radius: 0.8rem;
      border-end-end-radius: 0.8rem;
    }

    &.router-link-exact-active,
    &:hover {
      background-color: var(--clr__dropdown-active-bg);
      color: var(--clr__dropdown-active);
      font-weight: 600;
    }
  }
}

@include respond-to(tablet) {
  .nested-link {
    width: 100%;
    padding: 0.8rem 0;
  }

  .nested-link__title-container {
    padding: 1.6rem 1.2rem;
    justify-content: space-between;
  }

  .nested-link__title {
    font-weight: 600;
  }

  .nested-link__list {
    padding: 0;
    position: relative;
    top: initial;
    gap: 0;
    box-shadow: none;

    .nested-link__list-item {
      padding: 1.2rem 2.8rem;

      &:last-child {
        border-radius: 0;
      }

      &:hover {
        background: inherit;
      }
    }
  }

  .nested-link--active {
    .nested-link__title {
      color: var(--clr__action);
    }

    .nested-link__arrow {
      fill: var(--clr__action);
      transform: rotate(180deg);
    }

    .nested-link__list {
      display: flex;
    }
  }
}

@include respond-above(tablet) {
  .nested-link:hover {
    .nested-link__title {
      color: var(--clr__secondary);
    }

    .nested-link__arrow {
      fill: var(--clr__secondary);
      transform: rotate(180deg);
    }

    .nested-link__list {
      display: flex;
    }
  }
}
</style>
