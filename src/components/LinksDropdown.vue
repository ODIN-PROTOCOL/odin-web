<template>
  <div class="nav__dropdown">
    <span
      class="nav__dropdown-wrapper"
      :class="{ 'nav__dropdown-wrapper_active': isActive }"
    >
      <span class="nav__dropdown-wrapper-name">{{ list.name }}</span>
      <ArrowIcon :class="{ 'nav__dropdown-wrapper-arrow_active': isActive }" />
    </span>
    <transition name="fade">
      <div class="nav__dropdown-modal">
        <template v-for="link in list.links">
          <router-link
            v-if="link.to"
            class="nav__dropdown-link"
            :key="link.to"
            :data-text="link.text"
            :to="{ name: link.to }"
          >
            <span>{{ link.text }}</span>
          </router-link>
          <router-link
            v-else
            class="nav__dropdown-link"
            :key="link.url"
            :data-text="link.text"
            :to="link.url"
          >
            <span>{{ link.text }}</span>
          </router-link>
        </template>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ArrowIcon from '@/components/icons/ArrowIcon.vue'

export default defineComponent({
  name: 'linksDropdown',
  components: { ArrowIcon },
  props: {
    isActive: { type: Boolean, default: false },
    list: { type: Object, required: true },
  },
})
</script>

<style scoped lang="scss">
.nav__dropdown {
  position: relative;
  display: grid;
  grid-template-columns: 100%;
  text-decoration: none;
  white-space: nowrap;
  color: inherit;
  font-weight: 400;
  line-height: 2.4rem;
  font-size: 1.6rem;
  cursor: pointer;
  &-wrapper {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    &_active {
      .nav__dropdown-wrapper-name {
        color: var(--clr__action);
        font-weight: bold;
      }
    }
    &-arrow {
      fill: #212529;
      transform: translate(3px, -6px) rotate(270deg);
      &_active {
        fill: var(--clr__action);
      }
    }
  }
  &-modal {
    display: none;
    flex-direction: column;
    align-items: flex-start;
    position: absolute;
    top: 100%;
    left: 0;
    border-end-start-radius: 0.8rem;
    border-end-end-radius: 0.8rem;
    background: var(--clr__main-bg);
    z-index: 1;
    box-shadow: 0 0.4rem 2.4rem rgba(8, 87, 172, 0.12);
    min-width: 16rem;
  }
  &-link {
    margin: 0;
    text-decoration: none;
    color: inherit;
    width: 100%;
    padding: 0.8rem 1.2rem;
    &:hover {
      background: rgba(204, 228, 255, 0.4);
      color: var(--clr__action);
    }
  }
  :last-child {
    border-end-start-radius: 0.8rem;
    border-end-end-radius: 0.8rem;
  }
  &:hover {
    .nav__dropdown {
      &-modal {
        display: flex;
      }
      &-wrapper {
        &-arrow {
          transform: translate(-11px, 9px) rotate(90deg);
        }
      }
    }
  }
}

.nav__link {
  display: grid;
  grid-template-columns: 100%;
  text-decoration: none;
  white-space: nowrap;
  color: inherit;
  font-weight: 400;
  line-height: 2.4rem;
  font-size: 1.6rem;
  cursor: pointer;

  &:hover {
    color: var(--clr__action);
  }

  &::before {
    content: attr(data-text);
    font-weight: 900;
    opacity: 0;
    grid-column: 1;
    grid-row: 1;
  }
  > span {
    text-align: center;
    grid-column: 1;
    grid-row: 1;
    transition: color 0.5s ease, font-weight 0.5s ease;
  }
  &.router-link-exact-active > span {
    font-weight: bold;
    color: var(--clr__action);
  }
}
@media (max-width: 768px) {
  .nav {
    display: none;
    background: #fff;
    position: absolute;
    top: calc(100% + 0.1rem);
    width: 100%;
    z-index: 9999;
    height: 100vh;
    &__wrap-cont {
      flex-direction: column;
      padding: 0 1.6rem;
      gap: 0;
    }
    &__dropdown {
      width: 100%;
    }
    &__dropdown-modal {
      position: relative;
      box-shadow: none;
      top: initial;
      padding: 0;
      gap: 0;

      :last-child {
        border-radius: 0;
      }
    }
    &__dropdown-link {
      width: 100%;
      padding: 2.4rem 1.2rem 2.4rem 4.8rem;
      border-bottom: 0.1rem solid #ced4da;
      &:hover {
        background: rgba(204, 228, 255, 0.4);
      }
    }
    &__dropdown-wrapper {
      text-align: center;
      justify-content: space-between;
      width: 100%;
      padding: 2.4rem 1.2rem;
      border-bottom: 0.1rem solid #ced4da;
    }
    &__link {
      width: 100%;
      padding: 2.4rem 1.2rem;
      border-bottom: 0.1rem solid #ced4da;
      > span {
        text-align: left;
      }
      &:hover {
        background: rgba(204, 228, 255, 0.4);
      }
      &:first-child {
        padding: 2.4rem 1.2rem;
      }
    }
  }
  .nav-mob {
    display: block;
  }
}
</style>
