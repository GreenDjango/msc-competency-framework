import { writable } from 'svelte/store'

import { loadBase64, storeBase64 } from './lib/utils'
import type { Competencie, StudentInfo } from './lib/competencies'

function createCompetencies() {
  const { subscribe, set } = writable<Competencie>(null, (set) => {
    const data = loadBase64('competencies')
    set(data)
  })

  return {
    subscribe,
    set: (value: Competencie) => {
      set(value)
      storeBase64('competencies', value)
    },
  }
}
export const competencies = createCompetencies()

function createStudentInfo() {
  const { subscribe, set } = writable<StudentInfo>(null, (set) => {
    const data = loadBase64('student')
    set(data)
  })

  return {
    subscribe,
    set: (value: StudentInfo) => {
      set(value)
      storeBase64('student', value)
    },
  }
}
export const studentInfo = createStudentInfo()
