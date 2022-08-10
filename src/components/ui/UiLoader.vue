<template>
  <div class="ui-loader" :class="{ 'ui-loader--center': positionCenter }">
    <div class="ui-loader__animation" />
    <h5 v-if="message" class="ui-loader__message">
      {{ message }}
    </h5>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    positionCenter?: boolean
    message?: string
  }>(),
  {
    positionCenter: true,
  },
)
</script>

<style lang="scss" scoped>
.ui-loader {
  display: flex;
  align-items: center;

  &--center {
    justify-content: center;
  }
}

.ui-loader__message {
  margin-left: 2rem;
  color: var(--clr__light-gray);
  font-weight: 600;
  text-align: center;
  font-size: 3.2rem;
  &:after {
    content: ' .';
    animation: dots 1.2s steps(5, end) infinite;
  }
}

.ui-loader__animation {
  width: 7rem;
  height: 7rem;
  border-radius: 50%;
  position: relative;

  &:after,
  &:before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    width: 5rem;
    height: 5rem;
    border: 0.5rem solid transparent;
    border-bottom: 0.5rem solid var(--clr__light-gray);
    border-radius: 50%;
    animation: rotate 1s linear infinite;
  }

  &:before {
    width: 6rem;
    height: 6rem;
    animation-direction: reverse;
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes dots {
  0%,
  20% {
    color: transparent;
    text-shadow: 0.25em 0 0 transparent, 0.5em 0 0 transparent;
  }
  40% {
    color: var(--clr__light-gray);
    text-shadow: 0.25em 0 0 transparent, 0.5em 0 0 transparent;
  }
  60% {
    text-shadow: 0.25em 0 0 var(--clr__light-gray), 0.5em 0 0 transparent;
  }
  80%,
  100% {
    text-shadow: 0.25em 0 0 var(--clr__light-gray),
      0.5em 0 0 var(--clr__light-gray);
  }
}
</style>
