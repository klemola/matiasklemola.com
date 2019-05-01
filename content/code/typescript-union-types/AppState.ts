export interface User {
  username: string
  email: string
}

export type Translations = { [key: string]: string }

interface Initializing {
  type: 'Initializing'
}

interface Ready {
  type: 'Ready'
  user: User
  translations: Translations
}

interface Failing {
  type: 'Failing'
  error: Error
}

export type AppState = Initializing | Ready | Failing

export const Initializing: Initializing = { type: 'Initializing' }
export const Ready = (user: User, translations: Translations): Ready => ({
  type: 'Ready',
  user,
  translations,
})
export const Failing = (error: Error): Failing => ({
  type: 'Failing',
  error,
})
