import {
  RemoteData,
  Success,
  Failure,
  Loading,
  isSuccess,
  isLoading,
  isFailure,
} from './RemoteData'

interface User {
  username: string
  email: string
}

type Translations = { [key: string]: string }

export function main() {
  let userRequest: RemoteData<User, Error> = Loading
  let translationsRequest: RemoteData<Translations, Error> = Loading

  fetchUser()
    .then(response => {
      userRequest = Success(response)
    })
    .catch(error => {
      userRequest = Failure(error)
    })

  fetchTranslations()
    .then(response => {
      translationsRequest = Success(response)
    })
    .catch(error => {
      translationsRequest = Failure(error)
    })
}

function render(
  userRequest: RemoteData<User, Error>,
  translationsRequest: RemoteData<Translations, Error>
) {
  if (isLoading(userRequest) || isLoading(translationsRequest)) {
    return 'Loading...'
  } else if (isSuccess(userRequest) && isSuccess(translationsRequest)) {
    const { username } = userRequest.data
    const { greeting } = translationsRequest.data
    return `${greeting}, ${username}`
  } else if (isFailure(userRequest) || isFailure(translationsRequest)) {
    return 'Could not initialize the application!'
  } else {
    return null
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
      appTitle: 'TypeScript union types example',
      greeting: 'Hello',
    })
  )
}
