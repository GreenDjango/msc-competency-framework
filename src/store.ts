import { type Updater, get, writable } from 'svelte/store'

import type { MyBehavior, StudentInfo, TrainingPath } from './lib/competencies'
import { loadBase64, removeLocalStorageItem, storeBase64 } from './lib/utils'

type Preference = { speId?: TrainingPath; projectId?: string }
function createPreference() {
  const storeKey = 'preference'
  const { subscribe, set, update } = writable<Preference | null>(null, (set) => {
    const data = loadBase64(storeKey)
    set(data)
  })

  return {
    subscribe,
    set: (value: Preference) => {
      set(value)
      storeBase64(storeKey, value)
    },
    update: (updater: Updater<Preference>) => {
      update(updater as Updater<Preference | null>)
      storeBase64(storeKey, get({ subscribe }))
    },
  }
}
export const preferenceStore = createPreference()

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
