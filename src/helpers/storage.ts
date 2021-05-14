class StorageWrapper {
  constructor(private _storage: Storage, private _prefix: string) {}

  set(key: string, value: string): void {
    this._storage.setItem(this._key(key), value)
  }

  get(key: string): string | null {
    return this._storage.getItem(this._key(key))
  }

  remove(key: string): void {
    this._storage.removeItem(this._key(key))
  }

  clear(): void {
    this._storage.clear()
  }

  private _key(str: string) {
    return `${this._prefix}_${str}`
  }
}

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

export const storage = new StorageWrapper(
  _getStorage('sessionStorage') || new FallbackStorage(),
  'odin'
)

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
