import { get, writable } from 'svelte/store'

import type {
  // ImportInfo,
  MyBehavior,
  StudentInfo,
  TrainingPath,
} from './lib/competencies'
import { loadBase64, removeLocalStorageItem, storeBase64 } from './lib/utils'

function persistentStoreFactory<T>(storeKey: string) {
  const { subscribe, set, update } = writable<T | null>(null, (set) => {
    const data = loadBase64(storeKey)
    set(data)
  })

  return {
    subscribe,
    set: (value: T) => {
      set(value)
      storeBase64(storeKey, value)
    },
    update: (updater: (value: T | null) => T) => {
      update(updater)
      storeBase64(storeKey, get({ subscribe }))
    },
    reset: () => {
      set(null)
      removeLocalStorageItem(storeKey)
    },
  }
}

type Preference = { speId?: TrainingPath; projectId?: string }
export const preferenceStore = persistentStoreFactory<Preference>('preference')

export const myBehaviorsStore = persistentStoreFactory<MyBehavior[]>('my_behaviors')

export const studentInfoStore = persistentStoreFactory<StudentInfo>('student')

// export const lastImportInfoStore = persistentStoreFactory<ImportInfo>('import_info')
