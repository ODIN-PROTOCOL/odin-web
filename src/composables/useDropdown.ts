import { AnyFn } from '@/shared-types'
import { ref, readonly, Ref, DeepReadonly, unref } from 'vue'

type OnHideCb = (isClickOut: boolean) => unknown
export function useDropdown(
  clickOutTarget: HTMLElement | undefined | Ref<HTMLElement | undefined>
): {
  isShown: DeepReadonly<Ref<boolean>>
  toggle: () => void
  show: () => void
  hide: () => void
  onShow: (cb: AnyFn) => void
  onHide: (cb: OnHideCb) => void
  destroy: () => void
} {
  const isShown = ref(false)

  let _unlistenOuterClick: () => void = () => undefined
  let _onShowSubs: Array<AnyFn> = []
  let _onHideSubs: Array<OnHideCb> = []
  const _unsubs: Array<() => void> = []

  const toggle = () => {
    isShown.value ? hide() : show()
  }

  const show = () => {
    isShown.value = true
    _unlistenOuterClick = _onClickOut(clickOutTarget, () => hide(true))
    _onShowSubs.forEach((cb) => cb())
  }

  const hide = (isClickOut = false) => {
    isShown.value = false
    _unlistenOuterClick()
    _onHideSubs.forEach((cb) => cb(isClickOut))
  }

  const onShow = (cb: AnyFn) => {
    _onShowSubs.push(cb)
    _unsubs.push(() => {
      _onShowSubs = _onShowSubs.filter((el) => el !== cb)
    })
  }

  const onHide = (cb: OnHideCb) => {
    _onHideSubs.push(cb)
    _unsubs.push(() => {
      _onHideSubs = _onHideSubs.filter((el) => el !== cb)
    })
  }

  const destroy = () => {
    _unlistenOuterClick()
    _unsubs.forEach((unsub) => unsub())
  }

  return {
    isShown: readonly(isShown),
    toggle,
    show,
    hide,
    onShow,
    onHide,
    destroy,
  }
}

function _onClickOut(
  element: HTMLElement | undefined | Ref<HTMLElement | undefined>,
  onClickOut: AnyFn
) {
  const handler = (e: Event) => {
    const el = unref(element)
    if (el && !el.contains(e.target as Node | null)) onClickOut()
  }

  document.addEventListener('click', handler, false)
  return () => {
    document.removeEventListener('click', handler, false)
  }
}
