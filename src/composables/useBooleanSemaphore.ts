import { computed, ComputedRef, ref } from 'vue'

export function useBooleanSemaphore(
  initialCounter = 0
): [isLocked: ComputedRef<boolean>, lock: () => void, unlock: () => void] {
  const _counter = ref(initialCounter)
  const isLocked = computed(() => _counter.value !== 0)

  const lock = () => {
    _counter.value += 1
  }
  const release = () => {
    _counter.value -= 1
  }

  return [isLocked, lock, release]
}
