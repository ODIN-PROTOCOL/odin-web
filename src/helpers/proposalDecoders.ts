import { Any } from '@provider/codec/google/protobuf/any'
import { Proposal } from '@provider/codec/cosmos/gov/v1beta1/gov'
import { ParameterChangeProposal } from '@provider/codec/cosmos/params/v1beta1/params'
import { SoftwareUpgradeProposal } from 'cosmjs-types/cosmos/upgrade/v1beta1/upgrade'
import { Modify } from '@/shared-types'

export type ProposalDecoded = Modify<
  Proposal,
  { content?: ProposalContentDecoded }
>

export function decodeProposal(proposal: Proposal): ProposalDecoded {
  return {
    ...proposal,
    content: decodeProposalContent(proposal.content),
  }
}

export function decodeProposals(proposals: Proposal[]): ProposalDecoded[] {
  return proposals.map((proposal) => {
    return {
      ...proposal,
      content: decodeProposalContent(proposal.content),
    }
  })
}

export type ProposalContentDecoded =
  | ParameterChangeProposal
  | SoftwareUpgradeProposal
  | undefined
export function decodeProposalContent(content?: Any): ProposalContentDecoded {
  if (!content) {
    return content
  }
  if (content.typeUrl === '/cosmos.params.v1beta1.ParameterChangeProposal') {
    return ParameterChangeProposal.decode(content.value)
  }
  if (content.typeUrl === '/cosmos.upgrade.v1beta1.SoftwareUpgradeProposal') {
    return SoftwareUpgradeProposal.decode(content.value)
  }
}
