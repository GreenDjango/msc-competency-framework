import { encode, decode } from 'js-base64'

export function cleanDOMString(str: string) {
  return str.replaceAll('\n', '').replaceAll(/\s+/g, ' ').trim()
}

export function storeBase64(key: string, value: any) {
  const encodedValue = encode(JSON.stringify(value))
  globalThis.localStorage.setItem(key, encodedValue)
}

export function loadBase64(key: string) {
  const rawValue = globalThis.localStorage.getItem(key)
  if (!rawValue) return rawValue
  return JSON.parse(decode(rawValue))
}
