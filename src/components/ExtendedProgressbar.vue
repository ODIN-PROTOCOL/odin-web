<template>
  <div class="progressbar__wrapper">
    <div class="progressbar__info">
      <span class="progressbar__info-value">{{ value }}</span>
      <span class="progressbar__info-records">
        {{ current }} {{ unit }} / {{ max }} {{ unit }}
      </span>
    </div>
    <div class="progressbar__track">
      <div
        class="progressbar__thumb"
        :style="`width: ${progress}%; background: ${color}`"
      >
        <span class="progressbar__percent">{{ progress }}%</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRef, computed } from 'vue'

export default defineComponent({
  props: {
    value: { type: String, required: true },
    unit: { type: String, required: true },
    max: { type: Number, required: true },
    current: { type: Number, required: true },
    color: { type: String },
  },
  setup: function (props) {
    const _current = toRef(props, 'current')
    const _max = toRef(props, 'max')

    const progress = computed(() => {
      if (_current.value >= _max.value) return 100
      if (_current.value <= 0) return 0

      return Math.round((_current.value / _max.value) * 100)
    })

    return { progress }
  },
})
</script>

<style lang="scss" scoped>
.progressbar {
  &__wrapper {
    max-width: 36.8rem;
  }

  &__info {
    display: flex;
    justify-content: space-between;

    &-value {
      font-weight: 600;
      text-transform: uppercase;
    }

    &-records {
      font-size: 1.2rem;
    }
  }

  &__track {
    width: 100%;
    height: 2.4rem;
    border-radius: 0.4rem;
    background: var(--clr__progressbar-track);
  }

  &__thumb {
    display: flex;
    justify-content: flex-end;
    min-width: 4.2rem;
    height: 100%;
    border-radius: 0.4rem;
    padding: 0 1.1rem;
    background: var(--clr__status-default);
    color: var(--clr__text-on-action);
  }
}
</style>
