import { decode, encode } from 'js-base64'

export function findId<T extends { id: B }, B>(array: T[] | undefined, id: B) {
  return array?.find((val) => val.id === id)
}

export function cleanDOMString(str: string) {
  return str.replaceAll('\n', '').replaceAll(/\s+/g, ' ').trim()
}

export function storeBase64(key: string, value: any) {
  const encodedValue = encode(JSON.stringify(value))
  globalThis.localStorage.setItem(key, encodedValue)
}

export function loadBase64(key: string) {
  const rawValue = globalThis.localStorage.getItem(key)

  if (!rawValue) return null
  try {
    return JSON.parse(decode(rawValue))
  } catch (err) {
    console.error(`loadBase64: value=${rawValue}`, err)
    return null
  }
}

export function removeLocalStorageItem(key: string) {
  globalThis.localStorage.removeItem(key)
}