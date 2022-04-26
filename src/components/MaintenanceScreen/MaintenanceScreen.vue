<template>
  <div class="maintenance-screen">
    <div class="maintenance-screen__elements">
      <GearElement />
      <div class="screwdriver-wrapper">
        <ScrewdriverElement />
      </div>
      <div class="wrench-wrapper">
        <WrenchElement />
      </div>
      <div class="screw-wrapper screw-wrapper_1">
        <ScrewElement />
      </div>
      <div class="screw-wrapper screw-wrapper_2">
        <ScrewElement />
      </div>
      <div class="screw-wrapper screw-wrapper_3">
        <ScrewElement />
      </div>
      <BoltElement />
    </div>
    <div class="maintenance-screen__title">Sorry! We're under maintenance</div>
    <div class="maintenance-screen__info">
      <span class="maintenance-screen__info-msg"
        >Hang on till we get the error fixed</span
      >
      <span class="maintenance-screen__info-msg"
        >You may refresh the page or try again later</span
      >
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import BoltElement from '@/components/MaintenanceScreen/AnimationElement/BoltElement.vue'
import ScrewElement from '@/components/MaintenanceScreen/AnimationElement/ScrewElement.vue'
import WrenchElement from '@/components/MaintenanceScreen/AnimationElement/WrenchElement.vue'
import ScrewdriverElement from '@/components/MaintenanceScreen/AnimationElement/ScrewdriverElement.vue'
import GearElement from '@/components/MaintenanceScreen/AnimationElement/GearElement.vue'

export default defineComponent({
  name: 'MaintenanceScreenView',
  components: {
    GearElement,
    ScrewdriverElement,
    WrenchElement,
    ScrewElement,
    BoltElement,
  },
})
</script>

<style lang="scss">
@import '~@/styles/root.scss';
@import '~@/styles/font.scss';
html {
  font-size: 10px;
}
#app {
  width: 100%;
  height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: auto;
}
.maintenance-screen {
  font-family: 'SF Display', Helvetica, Arial, sans-serif;
  text-align: center;
  opacity: 0.9;
  position: absolute;
  top: 45%;
  left: 50%;
  margin-right: -50%;
  transform: translate(-50%, -50%);
  &__info {
    display: flex;
    flex-direction: column;
  }
  &__title {
    font-size: 3.2rem;
    font-weight: 400;
    line-height: 4.8rem;
    color: var(--clr__action);
    margin-bottom: 2rem;
  }
  &__info-msg {
    font-size: 2rem;
    font-weight: 400;
    line-height: 2.4rem;
    color: var(--clr__text);
  }
  &__elements {
    width: 29.6rem;
    height: 20.8rem;
    position: relative;
    display: flex;
    margin: 2rem auto;
    .gear-element,
    .screwdriver-wrapper,
    .wrench-wrapper {
      position: absolute;
      top: 6rem;
      right: 0;
      bottom: 0;
      left: 0;
      margin: auto;
    }
    .gear-element {
      animation: 16s infinite rotation linear;
      width: 12.8rem;
      height: 10.8rem;
    }
    .wrench-element {
      height: 17rem;
    }
    .screwdriver-element {
      height: 17rem;
    }
    .screw-element {
      width: 2.5rem;
      height: 2.5rem;
    }
    .bolt-element {
      width: 2.5rem;
      height: 2.5rem;
    }
    .screwdriver-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 32rem;
      opacity: 0;
      transform: translate3d(8rem, 8rem, 0);

      animation: 1.3s forwards screwdriver-wrapper;

      & > svg {
        transform: rotateZ(-45deg);
      }
    }
    .wrench-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 32rem;
      opacity: 0;
      transform: translate3d(-8rem, 8rem, 0);

      animation: 1.3s forwards wrench-wrapper;

      & > svg {
        transform: rotateZ(45deg);
      }
    }
    .bolt-element {
      position: absolute;
      bottom: 1rem;
      right: 5rem;
    }
    .screw-wrapper {
      position: absolute;
      margin: auto;
      width: 4rem;
      aspect-ratio: 1;
      animation: infinite 7s ease-in-out floating;

      &_1 {
        top: 2rem;
        left: 0;
        right: 0;
        // padding-left: 4.8rem;
      }
      &_2 {
        top: 8rem;
        bottom: 0;
        left: 4rem;
        // padding-top: 4.8rem;
        animation-delay: -7s;
        animation-duration: 12s;
      }
      &_3 {
        top: 2rem;
        bottom: 0;
        right: 3rem;
        // padding-bottom: 4.8rem;
        animation-delay: -4s;
        animation-duration: 10s;
      }
    }
  }
}

@keyframes rotation {
  from {
    transform: rotateZ(0);
  }
  to {
    transform: rotateZ(360deg);
  }
}
@keyframes screwdriver-wrapper {
  from {
    opacity: 0;
    transform: translate3d(8rem, 8rem, 0);
  }
  50% {
    opacity: 0.8;
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@keyframes wrench-wrapper {
  from {
    opacity: 0;
    transform: translate3d(-8rem, 8rem, 0);
  }
  50% {
    opacity: 0.8;
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@keyframes floating {
  from {
    transform: translateY(0);
  }
  50% {
    transform: translateY(2.5rem);
  }
  to {
    transform: translateY(0);
  }
}
@include respond-to(small) {
  .maintenance-screen {
    // top: 23%;
    &__title {
      font-size: 2rem;
      line-height: 3rem;
      margin-bottom: 1rem;
    }
    &__info-msg {
      font-size: 1.6rem;
      line-height: 2.4rem;
    }
    &__elements {
      width: 24rem;
      height: 22rem;
      margin: 1rem auto;
      .wrench-element {
        height: 14rem;
      }
      .screwdriver-element {
        height: 14rem;
      }
      .gear-element {
        width: 10rem;
        height: 10rem;
      }
      .screw-element {
        width: 1.5rem;
        height: 1.5rem;
      }
      .bolt-element {
        right: 4rem;
        bottom: 3rem;
        width: 1.5rem;
        height: 1.5rem;
      }
      .screw-wrapper {
        &_1 {
          top: 4.5rem;
        }
        &_2 {
          left: 3.5rem;
          top: 7rem;
        }
        &_3 {
          top: 3.5rem;
          right: 3rem;
        }
      }
    }
  }
}
</style>
