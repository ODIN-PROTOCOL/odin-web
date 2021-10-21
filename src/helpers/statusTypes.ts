export const requestStatusType = {
  1: { name: 'Ok', status: 'success' },
  2: { name: 'Failure', status: 'error' },
  3: { name: 'Expired', status: 'pending' },
}

export const proposalStatusType = {
  1: { name: 'In progress', status: 'progress' },
  2: { name: 'Pending', status: 'pending' },
  3: { name: 'Approved', status: 'success' },
  4: { name: 'Rejected', status: 'error' },
}
