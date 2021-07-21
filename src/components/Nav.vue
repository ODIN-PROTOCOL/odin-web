<template>
  <div class="nav">
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
      <div @click.stop="dropdown.show()" class="nav__dropdown">
        <span class="nav__dropdown-wrapper">
          <span>Validators</span>
          <svg
            class="nav__dropdown-wrapper-arrow"
            :class="{
              'nav__dropdown-wrapper-arrow--open': dropdown.isShown.value,
            }"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16.59 8.59L12 13.17L7.41 8.59L6 10L12 16L18 10L16.59 8.59Z"
            />
          </svg>
        </span>
        <transition name="fade">
          <div
            class="nav__dropdown-modal"
            ref="dropdownEl"
            v-show="dropdown.isShown.value"
          >
            <router-link
              class="nav__dropdown-link"
              data-text="Validators and Delegates"
              :to="{ name: 'Validators' }"
            >
              <span>Validators and Delegates</span>
            </router-link>
            <router-link
              class="nav__dropdown-link"
              data-text="Oracle validators"
              :to="{ name: 'Validators' }"
            >
              <span>Oracle validators</span>
            </router-link>
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
import { defineComponent, ref } from 'vue'
import { useDropdown } from '@/composables/useDropdown'
import { showExchangeFormDialog } from './modals/ExchangeFormModal.vue'
import { showFaucetFormDialog } from './modals/FaucetFormModal.vue'

export default defineComponent({
  setup() {
    const exchange = () => {
      showExchangeFormDialog()
    }

    const faucet = () => {
      showFaucetFormDialog()
    }

    const dropdownEl = ref<HTMLElement>()
    const dropdown = useDropdown(dropdownEl)
    return { exchange, faucet, dropdown, dropdownEl }
  },
})
</script>

<style scoped lang="scss">
.nav__wrap-cont {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  align-items: center;
  gap: 24px;
}

.nav__dropdown {
  position: relative;
  display: grid;
  grid-template-columns: 100%;
  text-decoration: none;
  white-space: nowrap;
  color: inherit;
  font-weight: 400;
  line-height: 24px;
  font-size: 16px;
  cursor: pointer;
  &-wrapper {
    display: flex;
    align-items: center;
    gap: 4px;
    &-arrow {
      fill: #212529;
      transition: all 0.5s ease;
      &--open {
        transform: rotate(180deg);
        fill: var(--clr__action);
      }
    }
  }
  &-modal {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    position: absolute;
    top: calc(100% + 1rem);
    left: 0;
    border-radius: 0.8rem;
    background: var(--clr__main-bg);
    padding: 0.8rem;
    z-index: 1;
    box-shadow: 0 0 1rem 1rem var(--clr__dropdown-shadow);
    min-width: 16rem;
  }
  &-link {
    margin: 0;
    text-decoration: none;
    color: inherit;
    &:hover {
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
  line-height: 24px;
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
</style>
