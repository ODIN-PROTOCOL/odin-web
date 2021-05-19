import { ResolveStatus } from '@provider/codec/oracle/v1/oracle'

export function translateRequestStatus(resolveStatus: ResolveStatus): string {
  switch (resolveStatus) {
    case ResolveStatus.RESOLVE_STATUS_OPEN_UNSPECIFIED:
      return 'Unspecified'
    case ResolveStatus.RESOLVE_STATUS_SUCCESS:
      return 'Success'
    case ResolveStatus.RESOLVE_STATUS_FAILURE:
      return 'Failure'
    case ResolveStatus.RESOLVE_STATUS_EXPIRED:
      return 'Expired'
    case ResolveStatus.UNRECOGNIZED:
    default:
      return 'Unrecognized'
  }
}
