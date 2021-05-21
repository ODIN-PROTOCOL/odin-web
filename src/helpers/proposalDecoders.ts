import { Any } from '@provider/codec/google/protobuf/any'
import { Proposal } from '@provider/codec/cosmos/gov/v1beta1/gov'
import { ParameterChangeProposal } from '@provider/codec/cosmos/params/v1beta1/params'

export type ProposalDecoded = Omit<Proposal, 'content'> & {
  content?: ProposalContentDecoded
}
export function decodeProposals(proposals: Proposal[]): ProposalDecoded[] {
  return proposals.map((proposal) => {
    return {
      ...proposal,
      content: decodeProposalContent(proposal.content),
    }
  })
}

export type ProposalContentDecoded = ParameterChangeProposal | undefined
export function decodeProposalContent(content?: Any): ProposalContentDecoded {
  if (!content) {
    return content
  }
  if (content.typeUrl === '/cosmos.params.v1beta1.ParameterChangeProposal') {
    return ParameterChangeProposal.decode(content.value)
  }
}
