<template>
  <ModalBase class="request-modal" @close="onClose()">
    <template #title>
      <h3>
        View request #{{ request.responsePacketData.requestId.toString() }}
      </h3>
    </template>

    <template #main>
      <div class="request-modal__section mg-b16">
        <p class="request-modal__section-lbl fs-14 fs-wb">Request</p>
        <pre class="request-modal__section-val">
          Oracle script ID: {{
            request.requestPacketData.oracleScriptId.toString()
          }}
          Client ID: {{ request.requestPacketData.clientId }}
          Prepare/Execute gas: {{
            $fNum(request.requestPacketData.prepareGas)
          }} / {{ $fNum(request.requestPacketData.executeGas) }}
          Min/Ask/Ans count: {{
            $fNum(request.requestPacketData.minCount)
          }} / {{ $fNum(request.requestPacketData.askCount) }} / {{
            $fNum(request.responsePacketData.ansCount)
          }}
          Requested at: {{ $fDate(request.responsePacketData.requestTime) }}
          Resolved at: {{ $fDate(request.responsePacketData.resolveTime) }}
          Status: <strong>{{ $tRequestStatus(request.responsePacketData.resolveStatus) }}</strong>
        </pre>
      </div>
      <div class="request-modal__section mg-b16">
        <p class="request-modal__section-lbl fs-14 fs-wb">Calldata</p>
        <pre class="request-modal__section-val">
          {{ request.requestPacketData.calldata }}
        </pre>
      </div>
      <div class="request-modal__section mg-b16">
        <p class="request-modal__section-lbl fs-14 fs-wb">Result</p>
        <pre class="request-modal__section-val">
          {{ request.responsePacketData.result }}
        </pre>
      </div>
    </template>
  </ModalBase>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { DialogHandler, dialogs } from '@/helpers/dialogs'
import ModalBase from './ModalBase.vue'
import { RequestResultDecoded } from '@/helpers/requestResultDecoders'

const ProposalModal = defineComponent({
  props: {
    request: {
      type: Object as PropType<RequestResultDecoded>,
      required: true,
    },
  },
  components: { ModalBase },
  setup() {
    const onClose = dialogs.getHandler('onClose')
    return { onClose }
  },
})

export default ProposalModal
export function showRequestDialog(
  callbacks: {
    onSubmit?: DialogHandler
    onClose?: DialogHandler
  },
  props: { request: RequestResultDecoded }
): Promise<unknown | null> {
  return dialogs.show(ProposalModal, callbacks, { props })
}
</script>

<style scoped lang="scss"></style>
