export default class WebStorage {
  static get (storage: Storage, key: string) {
    let valueStr = storage.getItem(key)
    try {
      if (valueStr === null) {
        return null
      } else {
        return JSON.parse(valueStr)
      }

    } catch (e) {
      return valueStr
    }
  }
  static set (storage: Storage, key: string, value: any) {
    let valueStr = JSON.stringify(value)
    return storage.setItem(key, valueStr)
  }
  static remove (storage: Storage, key: string) {
    storage.removeItem(key)
  }
  static removeAll (storage: Storage) {
    storage.clear()
  }
}
Object.freeze(WebStorage)
