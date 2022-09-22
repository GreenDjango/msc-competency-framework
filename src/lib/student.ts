import { derived } from 'svelte/store'

import { myBehaviorsStore, studentInfoStore } from '../store'

export function signOut() {
  studentInfoStore.reset()
  myBehaviorsStore.reset()
}

export const isSignIn = derived(studentInfoStore, ($student) => !!$student?.email)
