import { writable } from 'svelte/store'

import type { MyBehavior, StudentInfo } from './lib/competencies'
import { loadBase64, removeLocalStorageItem, storeBase64 } from './lib/utils'

function createMyBehaviors() {
  const storeKey = 'my_behaviors'
  const { subscribe, set } = writable<MyBehavior[] | null>(null, (set) => {
    const data = loadBase64(storeKey)
    set(data)
  })

  return {
    subscribe,
    set: (value: MyBehavior[]) => {
      set(value)
      storeBase64(storeKey, value)
    },
    reset: () => {
      set(null)
      removeLocalStorageItem(storeKey)
    },
  }
}
export const myBehaviorsStore = createMyBehaviors()

function createStudentInfo() {
  const storeKey = 'student'
  const { subscribe, set } = writable<StudentInfo | null>(null, (set) => {
    const data = loadBase64(storeKey)
    set(data)
  })

  return {
    subscribe,
    set: (value: StudentInfo) => {
      set(value)
      storeBase64(storeKey, value)
    },
    reset: () => {
      set(null)
      removeLocalStorageItem(storeKey)
    },
  }
}
export const studentInfoStore = createStudentInfo()
