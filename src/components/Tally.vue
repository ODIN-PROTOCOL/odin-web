<template>
  <span class="tally" :title="title">{{ translated || 'N/A' }}</span>
</template>

<script setup lang="ts">
import { useVoteProgress } from '@/composables/useVoteProgress'
import { translateTally, translateTallyShort } from '@/helpers/translators'
import { TallyResult } from '@provider/codec/cosmos/gov/v1beta1/gov'
import { computed, toRef } from 'vue'

const props = withDefaults(
  defineProps<{
    tally: TallyResult
    isTitled?: boolean
    isShort?: boolean
    onlyYes?: boolean
  }>(),
  {
    isTitled: false,
    isShort: false,
    onlyYes: false,
  },
)
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
  if (props.onlyYes) return _getTallyProgress().yes
  return props.isShort ? _getShort() : _getLong()
})

const title = computed(() => {
  if (!props.tally || !props.isTitled) return null
  return _getLong()
})
</script>

<style scoped></style>
