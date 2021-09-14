<template>
  <div class="nav" :class="{ 'nav-mob': isOpen }">
    <div class="nav__wrap-cont">
      <!-- TODO: temp. hidden all but validators -->
      <!-- <router-link class="nav__link" :to="{ name: 'DataSources' }">
        Data Sources
      </router-link>
      <router-link class="nav__link" :to="{ name: 'OracleScripts' }">
        Oracle Scripts
      </router-link>
      <router-link class="nav__link" :to="{ name: 'Requests' }">
        Requests
      </router-link>
      <router-link class="nav__link" :to="{ name: 'Voting' }">
        Voting
      </router-link> -->
      <router-link class="nav__link" :to="{ name: 'Validators' }">
        Validators
      </router-link>
      <UserWidget :isOpen="isOpen" class="fx-sae" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import UserWidget from '@/components/UserWidget.vue'

export default defineComponent({
  name: 'Nav',
  components: { UserWidget },
  props: {
    isOpen: { type: Boolean, default: false },
  },
})
</script>

<style scoped lang="scss">
.nav__wrap-cont {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  align-items: center;
  gap: 2.4rem;
}

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
    &--open {
      .nav__dropdown-wrapper-name {
        color: var(--clr__action);
        font-weight: 900;
      }
    }
    &-arrow {
      fill: #212529;
      transform: translate(3px, -6px) rotate(270deg);
      &--open {
        transform: translate(-11px, 9px) rotate(90deg);
        fill: var(--clr__action);
      }
    }
  }
  &-modal {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    position: absolute;
    top: calc(100% + 1rem);
    left: 0;
    border-radius: 0.8rem;
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
    left: 0;
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
    }
    &__dropdown-link {
      width: 100%;
      padding: 2.4rem 1.2rem;
      border-bottom: 0.1rem solid #ced4da;
      &:hover {
        background: rgba(204, 228, 255, 0.4);
      }
      &:first-child {
        padding: 2.4rem 1.2rem;
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

@media (max-width: 48rem) {
  .nav__wrap-cont {
    gap: 2rem;
  }
}
</style>
