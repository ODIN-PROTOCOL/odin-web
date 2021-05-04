class FallbackStorage implements Storage {
  private _storage: Record<string, string> = {}
  setItem(key: string, value: string): void {
    this._storage[key] = value
  }
  getItem(key: string): string | null {
    return this._storage[key] || null
  }
  removeItem(key: string): void {
    delete this._storage[key]
  }
  clear(): void {
    this._storage = {}
  }
  key(index: number): string | null {
    return Object.keys(this._storage)[index] || null
  }
  get length() {
    return Object.keys(this._storage).length
  }
}

const _storage: Storage = _getStorage('sessionStorage') || new FallbackStorage()

export function toStorage(key: string, value: string): void {
  _storage.setItem(_getStorageKey(key), value)
}

export function fromStorage(key: string): string | null {
  return _storage.getItem(_getStorageKey(key))
}

export function removeStorageItem(key: string): void {
  _storage.removeItem(_getStorageKey(key))
}

export function clearStorage(): void {
  _storage.clear()
}

function _getStorage(type: string): Storage | null {
  try {
    const storage: Storage = (<Record<string, Storage>>(<unknown>window))[type]
    const x = '__storage_test__'
    storage.setItem(x, x)
    storage.removeItem(x)
    return storage
  } catch (e) {
    return null
  }
}

const STORAGE_KEY_PREFIX = 'odin'
function _getStorageKey(key: string) {
  return `${STORAGE_KEY_PREFIX}_${key}`
}
