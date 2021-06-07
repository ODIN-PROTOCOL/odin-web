async function fallbackTextToClipboard(text: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const textArea = document.createElement('textarea')
    textArea.value = text

    // Avoid scrolling to bottom
    textArea.style.top = '0'
    textArea.style.left = '0'
    textArea.style.position = 'fixed'

    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()

    try {
      const successful = document.execCommand('copy')
      if (successful) {
        resolve()
      } else {
        reject(new Error('Failed to copy text to clipboard'))
      }
    } catch (err) {
      reject(err)
    }

    document.body.removeChild(textArea)
  })
}

export async function textToClipboard(text: string): Promise<void> {
  if (!navigator.clipboard) {
    fallbackTextToClipboard(text)
    return
  }

  return navigator.clipboard.writeText(text)
}
