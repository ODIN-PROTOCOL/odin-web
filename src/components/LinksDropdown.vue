<template>
  <div
    class="links-dropdown"
    @click="dropdownOpen"
    :class="{
      ['links-dropdown--open']: isDropdownOpen,
      ['links-dropdown--active']: isActive,
    }"
  >
    <span class="links-dropdown__title-wrapper">
      <span class="links-dropdown__title">{{ list.name }}</span>
      <ArrowIcon
        :height="12"
        :width="12"
        class="links-dropdown__arrow"
        :class="{ ['links-dropdown__arrow-icon--active']: isActive }"
      />
    </span>
    <transition name="fade">
      <div class="links-dropdown__modal" ref="dropdownEl">
        <template v-for="link in list.links">
          <router-link
            v-if="link.to"
            class="links-dropdown__modal-link"
            @click="isRedirect"
            :key="link.to"
            :data-text="link.text"
            :to="{ name: link.to }"
          >
            <span>{{ link.text }}</span>
          </router-link>
          <router-link
            v-else
            class="links-dropdown__modal-link"
            @click="isRedirect"
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
import ArrowIcon from '@/components/icons/ArrowIcon.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'linksDropdown',
  emits: ['redirect'],
  components: { ArrowIcon },
  props: {
    list: { type: Object, required: true },
    isDropdownOpen: { type: Boolean, required: true },
    isActive: { type: Boolean, default: false },
  },
  setup(_, { emit }) {
    const isRedirect = () => {
      emit('redirect')
    }
    return { isRedirect }
  },
})
</script>

<style scoped lang="scss">
.links-dropdown--active {
  .links-dropdown__title {
    color: var(--clr__action);
    font-weight: bold;
  }
}
.links-dropdown__arrow-icon--active {
  fill: var(--clr__action);
}
.links-dropdown {
  position: relative;
  white-space: nowrap;

  @media screen and (min-width: 768px) {
    &:hover {
      .links-dropdown__title {
        font-weight: 600;
        color: var(--clr__action);
      }
      .links-dropdown__arrow {
        fill: var(--clr__action);
        transform: translate(0.1rem, 0.3rem) rotate(90deg);
      }
      .links-dropdown__modal {
        display: flex;
      }
    }
  }
}
.links-dropdown__title-wrapper {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.links-dropdown__title {
  margin-right: 0.4rem;
}

.links-dropdown__arrow {
  fill: var(--clr__text);
  transform: translate(0.3rem, -0.1rem) rotate(270deg);
}

.links-dropdown__modal {
  display: none;
  flex-direction: column;
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 16.7rem;
  background: var(--clr__main-bg);
  box-shadow: 0 0.4rem 2.4rem rgba(8, 87, 172, 0.12);
  border-radius: 0 0 0.8rem 0.8rem;
  z-index: 99;
}

.links-dropdown__modal-link {
  padding: 0.8rem 1.2rem;
  text-decoration: none;
  color: inherit;

  &:last-child {
    border-end-start-radius: 0.8rem;
    border-end-end-radius: 0.8rem;
  }

  &:hover {
    background: rgba(204, 228, 255, 0.4);
    color: var(--clr__action);
    font-weight: 600;
  }
}

@include respond-to(tablet) {
  .links-dropdown {
    width: 100%;
    border-bottom: 0.1rem solid var(--clr__input-border);
    padding: 0.8rem 0;
    &--open {
      .links-dropdown__title {
        color: var(--clr__action);
        font-weight: 600;
      }
      .links-dropdown__arrow {
        fill: var(--clr__action);
        transform: translate(0.3rem, -0.1rem) rotate(270deg);
      }
      .links-dropdown__modal {
        display: flex;
      }
    }
  }
  .links-dropdown__title-wrapper {
    padding: 1.6rem 1.2rem;
    justify-content: space-between;
  }

  .links-dropdown__modal {
    position: relative;
    box-shadow: none;
    top: initial;
    padding: 0;
    gap: 0;
  }

  .links-dropdown__modal-link {
    padding: 1.2rem 2.8rem;

    &:last-child {
      border-radius: 0;
    }

    &:hover {
      background: inherit;
    }
  }
}
</style>
