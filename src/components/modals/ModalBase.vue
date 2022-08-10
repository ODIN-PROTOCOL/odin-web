<template>
  <div class="modal-base" :class="modalBaseScheme">
    <div class="modal-base__backdrop" @click="emitClose()"></div>
    <div class="modal-base__content">
      <div class="modal-base__content-head fx-row">
        <slot name="title"></slot>
        <button
          class="modal-base__close-btn app-ico-btn fx-sae"
          type="button"
          @click="emitClose()"
        >
          <img src="~@/assets/icons/close.svg" alt="Close" />
        </button>
      </div>

      <slot name="main"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

enum SCHEMES {
  noMarginTitle = 'no-margin-title',
  paddingContent31px = 'padding-content-31px',
}

enum EVENTS {
  close = 'close',
}

const emit = defineEmits<{
  (e: EVENTS.close): void
}>()

const props = withDefaults(
  defineProps<{
    scheme?: string
  }>(),
  {
    scheme: '',
  },
)

if (document.activeElement) {
  const activeEl = document.activeElement as HTMLElement
  activeEl.blur()
}

const modalBaseScheme = computed(() => {
  const scheme = props.scheme as SCHEMES
  if (!Object.values(SCHEMES).includes(scheme)) return ''
  return scheme ? `modal-base--${scheme}` : ''
})

const emitClose = () => emit(EVENTS.close)
</script>

<style lang="scss">
.modal-base {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.6rem;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  &--no-margin-title {
    & .modal-base__content-head {
      margin-bottom: 0;
    }
  }
  &--padding-content-31px {
    & .modal-base__content {
      padding: 3.2rem 3.1rem;
    }
    & .modal-base__content-head {
      padding: 0 1rem;
    }
  }
}
.modal-base__backdrop {
  background: var(--clr__modal-backdrop-bg);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.4;
}

.modal-base__content {
  background: var(--clr__modal-content-bg);
  border-radius: 0.8rem;
  padding: 3.2rem 2.2rem 2.4rem 3.2rem;
  z-index: 1;
  width: 100%;
  max-width: 39.2rem;
  max-height: 100%;
  overflow: visible;
  box-shadow: 0 0.4rem 2.4rem var(--clr__modal-content-shadow);
}

.modal-base__content-head {
  margin-bottom: 2.4rem;
}

.modal-base--right {
  .modal-base__content {
    position: absolute;
    right: 0;
    top: 0;
    border-radius: 0;
    height: 100%;
    overflow: unset;
  }
}
body.dark {
  .modal-base__content {
    background: var(--d-clr__modal-content-bg);
    box-shadow: 0 0.4rem 2.4rem var(--clr__modal-content-shadow);
  }
}
</style>
