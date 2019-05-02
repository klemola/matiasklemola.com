import { RemoteData, Success, Failure, Loading, isSuccess } from './RemoteData'
import {
  User,
  Translations,
  AppState,
  Ready,
  Initializing,
  Failing,
} from './AppState'

export function main() {
  let userRequest: RemoteData<User, Error> = Loading
  let translationsRequest: RemoteData<Translations, Error> = Loading
  let appState: AppState = Initializing

  fetchUser()
    .then(response => {
      userRequest = Success(response)

      if (isSuccess(userRequest) && isSuccess(translationsRequest)) {
        appState = Ready(userRequest.data, translationsRequest.data)
      }
    })
    .catch(error => {
      userRequest = Failure(error)
      appState = Failing(error)
    })

  fetchTranslations()
    .then(response => {
      translationsRequest = Success(response)

      if (isSuccess(userRequest) && isSuccess(translationsRequest)) {
        appState = Ready(userRequest.data, translationsRequest.data)
      }
    })
    .catch(error => {
      translationsRequest = Failure(error)
      appState = Failing(error)
    })
}

function render(appState: AppState) {
  switch (appState.type) {
    case 'Initializing':
      return 'Loading...'

    case 'Ready':
      const { username } = appState.user
      const { greeting } = appState.translations
      return `${greeting}, ${username}`

    case 'Failing':
      return 'Could not initialize the application!'
  }
}

/* ...simulated fetch functions */

function fetchUser() {
  return new Promise<User>(resolve =>
    resolve({
      username: 'Tim Testuser',
      email: 'tim@example.com',
    })
  )
}

function fetchTranslations() {
  return new Promise<Translations>(resolve =>
    resolve({
      appTitle: 'Typescript union types example',
      greeting: 'Hello',
    })
  )
}
