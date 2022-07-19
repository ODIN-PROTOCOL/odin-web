<template>
  <div class="progressbar">
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
          progress >= 60
            ? 'progressbar__thumb--positive'
            : 'progressbar__thumb--negative'
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
    const _max = toRef(props, 'max')
    const _current = toRef(props, 'current')

    const progress = computed(() => {
      if (_current.value >= _max.value) return 100
      if (_current.value === 0) return 5

      return Math.round((_current.value / _max.value) * 100)
    })
    return { progress }
  },
})
</script>

<style lang="scss" scoped>
.progressbar {
  width: 16.8rem;
}

.progressbar__info {
  display: flex;
  justify-content: space-between;
}

.progressbar__info-item {
  font-size: 1.2rem;
  line-height: 1.6rem;
  text-transform: uppercase;
}

.progressbar__track {
  width: 100%;
  height: 0.8rem;
  border-radius: 0.4rem;
  background: var(--clr__progressbar-track);
}

.progressbar__thumb {
  width: 20%;
  height: 100%;
  border-radius: 0.4rem;

  &--positive {
    background: var(--clr__progressbar-positive);
  }

  &--negative {
    background: var(--clr__progressbar-negative);
  }
}
</style>
