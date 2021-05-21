export function readFile(
  file: File,
  readAs: 'arrayBuffer'
): Promise<ArrayBuffer | null>
export function readFile(
  file: File,
  readAs: 'uint8Array'
): Promise<Uint8Array | null>
export function readFile(
  file: File,
  readAs: 'dataUrl' | 'binaryString' | 'text'
): Promise<string | null>
export function readFile(
  file: File,
  readAs: 'arrayBuffer' | 'uint8Array' | 'dataUrl' | 'binaryString' | 'text'
): Promise<ArrayBuffer | Uint8Array | string | null> {
  return new Promise<ArrayBuffer | Uint8Array | string | null>(
    (resolve, reject) => {
      const reader = new FileReader()

      reader.onload = (event) => {
        const fr: FileReader | null = event.target
        if (!fr || !fr.result) {
          resolve(null)
        } else {
          const res =
            readAs === 'uint8Array'
              ? new Uint8Array(<ArrayBuffer>fr.result)
              : fr.result
          resolve(res)
        }
      }

      reader.onerror = (error) => {
        reject(error)
      }

      switch (readAs) {
        case 'uint8Array':
        case 'arrayBuffer':
          return reader.readAsArrayBuffer(file)
        case 'dataUrl':
          return reader.readAsDataURL(file)
        case 'binaryString':
          return reader.readAsBinaryString(file)
        case 'text':
          return reader.readAsText(file)
      }
    }
  )
}

export function getEventFile(event: Event | DragEvent | null): File | null {
  if (!event) return null

  let files = (event.target as HTMLInputElement)?.files
  if (!files) files = (event as DragEvent)?.dataTransfer?.files || null

  if (files === null || !files.length) {
    return null
  }

  return files[0]
}

export function selectImage(): Promise<File | null> {
  return _selectFile({ accept: 'image/png, image/jpeg' })
}

export function selectPdf(): Promise<File | null> {
  return _selectFile({ accept: 'application/pdf' })
}

export function onFileDialogCancel(callback: () => unknown): () => void {
  const callAndUnsub = () => {
    setTimeout(() => callback(), 350)
    unsub()
  }
  const unsub = () => {
    window.removeEventListener('focus', callAndUnsub)
    document.removeEventListener('mousemove', callAndUnsub)
    document.removeEventListener('touchstart', callAndUnsub)
  }
  window.addEventListener('focus', callAndUnsub)
  document.addEventListener('mousemove', callAndUnsub)
  document.addEventListener('touchstart', callAndUnsub)
  return unsub
}

function _selectFile(attributes?: Record<string, string>) {
  const input = _makeFakeImgInput(attributes)

  document.body.appendChild(input)
  input.click()

  const promise = _promisifyImgInputClick(input)
  promise.then(() => input.remove())

  return promise
}

function _makeFakeImgInput(attributes?: Record<string, string>) {
  const input = document.createElement('input')
  input.setAttribute('style', 'display: none;')
  input.setAttribute('type', 'file')

  if (attributes) {
    Object.entries(attributes).forEach(([attr, value]) => {
      input.setAttribute(attr, value)
    })
  }

  return input
}

function _promisifyImgInputClick(input: HTMLInputElement) {
  return new Promise<File | null>((resolve) => {
    const resolveNull = () => setTimeout(() => resolveFile(null), 100)

    const resolveFile = (event: Event | null) => {
      input.removeEventListener('change', resolveFile)
      fileDialogCancelUnsub()
      resolve(getEventFile(event))
    }

    input.addEventListener('change', resolveFile)
    const fileDialogCancelUnsub = onFileDialogCancel(resolveNull)
  })
}
