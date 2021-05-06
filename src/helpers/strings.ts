export function cropAddress(value: string): string {
  return `${value.slice(0, 4)}…${value.slice(-4)}`
}
