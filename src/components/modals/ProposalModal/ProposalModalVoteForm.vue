<template>
  <form
    class="proposal-modal-vote-form app-form load-fog"
    :class="{ 'load-fog_show': isLoading }"
    @submit.prevent
  >
    <div class="app-form__field">
      <label class="app-form__field-lbl fs-wb"> Your vote </label>
      <select
        class="app-form__field-input"
        name="vote-option"
        v-model="form.vote"
        :disabled="isLoading || isProcessing || isLoadingVote"
      >
        <option v-for="opt in voteOptions" :key="opt" :value="opt">
          {{ $tVote(opt) }}
        </option>
      </select>
      <p v-if="form.amountErr" class="app-form__field-err">
        {{ form.amountErr }}
      </p>
    </div>

    <div class="app-form__footer">
      <button
        class="app-btn"
        type="button"
        @click="submit"
        :disabled="isLoading || isProcessing || isLoadingVote || !form.isValid"
      >
        <template v-if="isProcessing"> Voting… </template>
        <template v-else> Vote </template>
      </button>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue'
import { VoteOption } from '@provider/codec/cosmos/gov/v1beta1/gov'
import { useForm, validators } from '@/composables/useForm'
import { callers } from '@/api/callers'
import { handleError } from '@/helpers/errors'
import { notifySuccess } from '@/helpers/notifications'
import { wallet } from '@/api/wallet'
import { ProposalDecoded } from '@/helpers/proposalDecoders'

export default defineComponent({
  emits: ['update:isLoading', 'submitted'],
  props: {
    proposal: { type: Object as PropType<ProposalDecoded>, required: true },
    isLoading: { type: Boolean, required: true },
  },
  setup(props, { emit }) {
    const form = useForm({ vote: ['', validators.required] })
    const voteOptions: VoteOption[] = [
      VoteOption.VOTE_OPTION_YES,
      VoteOption.VOTE_OPTION_ABSTAIN,
      VoteOption.VOTE_OPTION_NO,
      VoteOption.VOTE_OPTION_NO_WITH_VETO,
    ]

    const isProcessing = ref(false)
    watch(isProcessing, (v) => emit('update:isLoading', v))

    const submit = async () => {
      if (props.isLoading || isProcessing.value) return

      isProcessing.value = true
      try {
        await callers.proposalVote({
          proposalId: props.proposal.proposalId,
          voter: wallet.account.address,
          option: Number(form.vote.val()),
        })

        emit('submitted')
        notifySuccess('Vote submitted')
      } catch (error) {
        handleError(error)
      }
      isProcessing.value = false
    }

    const isLoadingVote = ref(false)
    const _tryLoadMyVote = async () => {
      isLoadingVote.value = true
      try {
        const response = await callers.getProposalVote(
          props.proposal.proposalId,
          wallet.account.address
        )
        if (!response?.vote) return

        form.vote.val(response.vote.option.toString())
      } catch (error) {
        // noop
      }
      isLoadingVote.value = false
    }

    _tryLoadMyVote()

    return {
      form: form.flatten(),
      voteOptions,
      isLoadingVote,
      isProcessing,
      submit,
    }
  },
})
</script>

<style lang="scss" scoped></style>
