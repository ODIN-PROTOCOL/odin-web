<template>
  <div class="nav" :class="{ 'nav-mob': isOpen }">
    <div class="nav__wrap-cont">
      <!-- TODO: temp. hidden all but validators -->
      <router-link
        class="nav__link"
        data-text="Data Sources"
        :to="{ name: 'DataSources' }"
      >
        <span>Data Sources</span>
      </router-link>
      <router-link
        class="nav__link"
        data-text="Oracle Scripts"
        :to="{ name: 'OracleScripts' }"
      >
        <span>Oracle Scripts</span>
      </router-link>
      <router-link
        class="nav__link"
        data-text="Requests"
        :to="{ name: 'Requests' }"
      >
        <span>Requests</span>
      </router-link>
      <div
        @click.stop="dropdown.show()"
        class="nav__dropdown"
        :class="{ 'nav__dropdown-wrapper--open': dropdown.isShown.value }"
      >
        <span
          class="nav__dropdown-wrapper"
          :class="{ 'nav__dropdown-wrapper_active': isDropdownActive }"
        >
          <span class="nav__dropdown-wrapper-name"> Validators </span>
          <ArrowIcon
            :className="
              dropdown.isShown.value ? 'nav__dropdown-wrapper-arrow--open' : ''
            "
          />
        </span>
        <transition name="fade">
          <div
            class="nav__dropdown-modal"
            ref="dropdownEl"
            v-show="dropdown.isShown.value"
          >
            <div class="nav__dropdown-item">
              <router-link
                class="nav__dropdown-link"
                data-text="Validators"
                :to="{ name: 'Validators' }"
              >
                <span>Validators</span>
              </router-link>
            </div>
            <div class="nav__dropdown-item">
              <router-link
                class="nav__dropdown-link"
                data-text="Oracle validators"
                :to="{ name: 'Validators' }"
              >
                <span>Oracle validators</span>
              </router-link>
            </div>
          </div>
        </transition>
      </div>
      <router-link class="nav__link" data-text="Rewards" to="/">
        <span>Rewards</span>
      </router-link>
      <router-link class="nav__link" data-text="Governance" to="/">
        <span>Governance</span>
      </router-link>
      <!--      <router-link class="nav__link" :to="{ name: 'Voting' }">-->
      <!--        Voting-->
      <!--      </router-link>-->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import { useDropdown } from '@/composables/useDropdown'
import { showExchangeFormDialog } from './modals/ExchangeFormModal.vue'
import { showFaucetFormDialog } from './modals/FaucetFormModal.vue'
import ArrowIcon from '@/components/icons/ArrowIcon.vue'

export default defineComponent({
  components: { ArrowIcon },
  emits: ['changeRoute'],
  props: {
    isOpen: { type: Boolean, default: false },
  },
  setup(props, { emit }) {
    const exchange = () => {
      showExchangeFormDialog()
    }

    const faucet = () => {
      showFaucetFormDialog()
    }

    const route = useRoute()
    watch(
      () => route.path,
      () => {
        emit('changeRoute')
        handleDropdownActive()
      }
    )

    const isDropdownActive = ref(false)
    const urls = ['/validators']
    const handleDropdownActive = () => {
      isDropdownActive.value = urls.indexOf(route.path) > -1
    }

    const dropdownEl = ref<HTMLElement>()
    const dropdown = useDropdown(dropdownEl)
    return {
      exchange,
      faucet,
      dropdown,
      dropdownEl,
      isDropdownActive,
      handleDropdownActive,
    }
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
  font-size: 16px;
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
    &_active {
      color: var(--clr__action);
      font-weight: 900;
      .nav__dropdown-wrapper-arrow {
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
    border-radius: 0 0 0.8rem 0.8rem;
    background: var(--clr__main-bg);
    z-index: 1;
    box-shadow: 0px 4px 24px var(--clr__dropdown-shadow);
    min-width: 20rem;
  }
  &-item {
    width: 100%;
    padding: 0.8rem 1.2rem;
    &:hover {
      background: var(--clr__dropdown-link);

      .nav__dropdown-link {
        color: var(--clr__action);
        font-weight: 600;
      }

      &:last-child {
        border-radius: 0 0 0.8rem 0.8rem;
      }
    }
  }
  &-link {
    margin: 0;
    text-decoration: none;
    color: inherit;
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
  font-size: 16px;
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
</style>
