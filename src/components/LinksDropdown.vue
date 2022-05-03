<template>
  <div class="links-dropdown">
    <span
      class="links-dropdown__wrapper"
      :class="{ 'links-dropdown__wrapper--active': isActive }"
    >
      <span class="links-dropdown__wrapper-name">{{ list.name }}</span>
      <ArrowIcon
        :height="12"
        :width="12"
        class="links-dropdown__arrow-icon"
        :class="{ 'links-dropdown__arrow-icon--active': isActive }"
      />
    </span>
    <transition name="fade">
      <div class="links-dropdown__modal">
        <template v-for="link in list.links">
          <router-link
            v-if="link.to"
            class="links-dropdown__link"
            :key="link.to"
            :data-text="link.text"
            :to="{ name: link.to }"
          >
            <span>{{ link.text }}</span>
          </router-link>
          <router-link
            v-else
            class="links-dropdown__link"
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
.links-dropdown__arrow-icon {
  fill: var(--clr__text);
  transform: translate(0.3rem, -0.1rem) rotate(270deg);
}
.links-dropdown__arrow-icon--active {
  fill: var(--clr__action);
}
.links-dropdown {
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

  :last-child {
    border-end-start-radius: 0.8rem;
    border-end-end-radius: 0.8rem;
  }
  &:hover {
    .links-dropdown__modal {
      display: flex;
    }
    .links-dropdown__arrow-icon {
      transform: translate(-0.1rem, 0.3rem) rotate(90deg);
    }
  }
}
.links-dropdown__wrapper {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.links-dropdown__wrapper--active {
  .links-dropdown__wrapper-name {
    color: var(--clr__action);
    font-weight: bold;
  }
}
.links-dropdown__modal {
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
  box-shadow: 0 0.4rem 2.4rem var(--clr__dropdown-shadow);
  min-width: 16rem;
}
.links-dropdown__link {
  margin: 0;
  text-decoration: none;
  color: inherit;
  width: 100%;
  padding: 0.8rem 1.2rem;
  &:hover {
    background: var(--clr__dropdown-link);
    color: var(--clr__action);
  }
}

@media (max-width: 768px) {
  .links-dropdown {
    width: 100%;
  }
  .links-dropdown__modal {
    position: relative;
    box-shadow: none;
    top: initial;
    padding: 0;
    gap: 0;

    :last-child {
      border-radius: 0;
    }
  }
  .links-dropdown__link {
    width: 100%;
    padding: 2.4rem 1.2rem 2.4rem 4.8rem;
    border-bottom: 0.1rem solid var(--clr__input-border);
    &:hover {
      background: var(--clr__dropdown-link);
    }
  }
  .links-dropdown__wrapper {
    text-align: center;
    justify-content: space-between;
    width: 100%;
    padding: 2.4rem 1.2rem;
    border-bottom: 0.1rem solid var(--clr__input-border);
  }
}
</style>
