export const copyValue = (text: string): void => {
  window.navigator.clipboard.writeText(text)
}
