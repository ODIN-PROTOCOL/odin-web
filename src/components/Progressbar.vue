<template>
  <div class="progressbar__wrapper">
    <div class="progressbar__info" v-if="isForValidators">
      <span class="progressbar__info-item">{{ current }} %</span>
    </div>
    <div class="progressbar__info" v-else>
      <span class="progressbar__info-item">Min {{ min }}</span>
      <span class="progressbar__info-item">{{ current }} of {{ max }}</span>
    </div>
    <div class="progressbar__track">
      <div
        class="progressbar__thumb"
        :class="
          progress > 60
            ? 'progressbar__thumb_positive'
            : 'progressbar__thumb_negative'
        "
        :style="`width: ${progress}%`"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRef, computed } from 'vue'

export default defineComponent({
  props: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    current: { type: Number, required: true },
    isForValidators: { type: Boolean, default: false },
  },
  setup: function (props) {
    const _min = toRef(props, 'min')
    const _max = toRef(props, 'max')
    const _current = toRef(props, 'current')

    const progress = computed(() => {
      if (_current.value >= _max.value) return 100
      if (_current.value <= _min.value) return 5

      return Math.round((_current.value / _max.value) * 100)
    })
    return { progress }
  },
})
</script>

<style lang="scss" scoped>
.progressbar {
  &__wrapper {
    width: 16.8rem;
  }

  &__info {
    display: flex;
    justify-content: space-between;
  }

  &__info-item {
    font-size: 1.2rem;
    line-height: 1.6rem;
    text-transform: uppercase;
  }

  &__track {
    width: 100%;
    height: 0.8rem;
    border-radius: 0.4rem;
    background: var(--clr__progressbar-track);
  }

  &__thumb {
    width: 20%;
    height: 100%;
    border-radius: 0.4rem;

    &_positive {
      background: var(--clr__progressbar-positive);
    }

    &_negative {
      background: var(--clr__progressbar-negative);
    }
  }
}
</style>
