<template>
  <aside class="app-sidebar" :class="open ? 'open' : 'close'">
    <div class="app-sidebar__app-logo">
      <router-link :to="{ name: $routes.app }" @click="closeSidebar">
        <app-logo-icon />
      </router-link>

      <div class="drawer-close">
        <CloseIcon @click="emit('toggleSidebar')" />
      </div>
    </div>

    <div v-if="!isLoggedIn" class="app-sidebar__divider"></div>

    <template v-if="!isLoggedIn">
      <div class="app-sidebar_connect-wallet">
        <router-link
          class="app-btn app-btn--small user-widget__connect-wallet-btn"
          :to="{ name: $routes.auth }"
          @click="closeSidebar"
        >
          Connect Wallet
        </router-link>
      </div>
    </template>

    <div v-if="!isLoggedIn" class="app-sidebar__divider"></div>

    <template v-for="nav in navs" :key="nav.to">
      <div
        class="app-sidebar__nav-link"
        :class="isActive(nav.to) ? 'active' : ''"
      >
        <router-link :to="nav.to" @click="closeSidebar">
          <component :is="nav.icon" class="nav-icon" />
          <span>{{ nav.title }}</span>
        </router-link>
      </div>

      <div v-if="nav.divider" class="app-sidebar__divider"></div>
    </template>
  </aside>
</template>

<script setup lang="ts">
import {
  AppLogoIcon,
  HomeIcon,
  CubeIcon,
  ListIcon,
  ArrowDown,
  CubeTransparentIcon,
  ShieldIcon,
  Bars3Icon,
  CodeIcon,
  DocumentIcon,
  CloseIcon,
} from '@/components/icons'
import { useAuthorization } from '@/composables/useAuthorization'
import { useRoute } from 'vue-router'

defineProps({
  open: {
    type: Boolean,
  },
})

const emit = defineEmits(['toggleSidebar'])
const route = useRoute()

const { isLoggedIn } = useAuthorization()

const navs = [
  {
    title: 'Overview',
    icon: HomeIcon,
    divider: true,
    to: '/',
  },
  {
    title: 'Validators',
    icon: ShieldIcon,
    divider: false,
    to: '/validators',
  },
  {
    title: 'Transactions',
    icon: ListIcon,
    divider: false,
    to: '/transactions',
  },
  {
    title: 'Blocks',
    icon: CubeIcon,
    divider: false,
    to: '/blocks',
  },
  {
    title: 'Proposals',
    icon: DocumentIcon,
    divider: true,
    to: '/governance',
  },
  {
    title: 'Data Sources',
    icon: Bars3Icon,
    divider: false,
    to: '/data-sources',
  },
  // {
  //   title: 'Oracle Scripts',
  //   icon: CodeIcon,
  //   divider: false,
  //   to: '/oracle-scripts',
  // },
  // {
  //   title: 'Requests',
  //   icon: ArrowDown,
  //   divider: true,
  //   to: '/requests',
  // },
  {
    title: 'IBCs',
    icon: CubeTransparentIcon,
    divider: true,
    to: '/ibc',
  },
]

const isActive = (to: string) => {
  if (to === '/') {
    return route.fullPath === '/'
  } else {
    return route.fullPath.startsWith(to)
  }
}

const closeSidebar = () => {
  if (window.innerWidth <= 1022) {
    emit('toggleSidebar')
  }
}
</script>

<style scoped lang="scss">
.app-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 24rem;
  background-color: var(--clr__header-bg);
  z-index: 999;
  border-right: 1px solid var(--clr__card-border);
  -webkit-transition: all 0.3s;
  -o-transition: all 0.3s;
  transition: all 0.3s;
  overflow-y: auto;
  height: 100vh;
}

.app-sidebar.open {
  left: 0;
}

.app-sidebar.close {
  left: -24rem;
}

.app-sidebar__app-logo {
  padding: 4rem 2rem;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;

  .drawer-close {
    display: none;
    cursor: pointer;
  }

  @include respond-to(medium) {
    .drawer-close {
      display: block !important;
    }
  }
}

.app-sidebar__divider {
  margin: 1.5rem 0;
  border-bottom: 2px solid var(--clr__card-border);
}

.app-sidebar__nav-link {
  a {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    gap: 1.8rem;
    padding: 1rem 1.5rem;
    color: var(--clr__text-muted);
    text-decoration: none;
    border-left: 4px solid transparent;
    -webkit-transition: all 0.2s;
    -o-transition: all 0.2s;
    transition: all 0.2s;

    span {
      display: block;
    }

    .nav-icon {
      width: 2.3rem;
      color: var(--clr__text-muted);
    }
  }
}

.app-sidebar__nav-link:hover,
.app-sidebar__nav-link.active {
  a {
    background-color: var(--clr__card-border);
    border-color: var(--clr__action);
  }
  a,
  .nav-icon {
    color: var(--clr__action) !important;
  }
}

.app-sidebar_connect-wallet {
  display: none;
  padding: 1rem 1.5rem;
}

.user-widget__connect-wallet-btn {
  text-decoration: none;
}

@include respond-to(tablet) {
  .app-sidebar_connect-wallet {
    display: block;
  }
}
</style>
