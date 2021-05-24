<template>
  <span class="tally" :title="title">{{ translated || 'N/A' }}</span>
</template>

<script lang="ts">
import { useVoteProgress } from '@/composables/useVoteProgress'
import { translateTally, translateTallyShort } from '@/helpers/translators'
import { TallyResult } from '@provider/codec/cosmos/gov/v1beta1/gov'
import { computed, defineComponent, PropType, toRef } from 'vue'

// TODO: translate
export default defineComponent({
  props: {
    tally: { type: Object as PropType<TallyResult>, required: true },
    isTitled: { type: Boolean, default: false },
    isShort: { type: Boolean, default: false },
  },
  setup(props) {
    const tally = toRef(props, 'tally')
    const _yes = useVoteProgress(tally, 'yes')
    const _abstain = useVoteProgress(tally, 'abstain')
    const _no = useVoteProgress(tally, 'no')
    const _veto = useVoteProgress(tally, 'noWithVeto')
    const _getTallyProgress = () => ({
      yes: _yes.value,
      abstain: _abstain.value,
      no: _no.value,
      noWithVeto: _veto.value,
    })

    const _getLong = () => translateTally(_getTallyProgress())
    const _getShort = () => translateTallyShort(_getTallyProgress())

    const translated = computed(() => {
      if (!props.tally) return 'N/A'
      return props.isShort ? _getShort() : _getLong()
    })

    const title = computed(() => {
      if (!props.tally || !props.isTitled) return null
      return _getLong()
    })

    return { translated, title }
  },
})
</script>

<style scoped></style>
