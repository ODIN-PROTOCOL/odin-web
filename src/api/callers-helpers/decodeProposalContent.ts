import { Any } from '@provider/codec/google/protobuf/any'
import { ParameterChangeProposal } from '@provider/codec/cosmos/params/v1beta1/params'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function decodeProposalContent(content?: Any) {
  if (!content) {
    return content
  }
  if (content.typeUrl === '/cosmos.params.v1beta1.ParameterChangeProposal') {
    return ParameterChangeProposal.decode(content.value)
  }
}
