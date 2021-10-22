<template>
  <div class="nav" :class="{ 'nav-mob': isOpen }">
    <div class="nav__wrap-cont">
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
      <LinksDropdown :isActive="isDropdownActive" :list="ValidatorsList" />
      <router-link class="nav__link" data-text="Rewards" to="/">
        <span>Rewards</span>
      </router-link>
      <router-link class="nav__link" data-text="Governance" to="/">
        <span>Governance</span>
      </router-link>
      <!-- Voting page not ready -->
      <!--      <router-link class="nav__link" :to="{ name: 'Voting' }">-->
      <!--        Voting-->
      <!--      </router-link>-->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import LinksDropdown from '@/components/LinksDropdown.vue'

export default defineComponent({
  components: { LinksDropdown },
  emits: ['changeRoute'],
  props: {
    isOpen: { type: Boolean, default: false },
  },
  setup(props, { emit }) {
    const ValidatorsList = {
      name: 'Validators',
      links: [
        {
          to: 'Validators',
          text: 'Validators',
        },
        {
          to: 'OracleValidators',
          text: 'Oracle validators',
        },
      ],
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
    const urls = ['/validators', '/oracle-validators']
    const handleDropdownActive = () => {
      isDropdownActive.value = urls.indexOf(route.path) > -1
    }

    return {
      isDropdownActive,
      handleDropdownActive,
      ValidatorsList,
    }
  },
})
</script>

<style scoped lang="scss">
.nav {
  &__wrap-cont {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    align-items: center;
    gap: 2.4rem;
  }

  &__link {
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
