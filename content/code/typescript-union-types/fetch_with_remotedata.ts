import { RemoteData, Success, Failure, Loading } from './RemoteData'

interface User {
  username: string
  email: string
}

export function main() {
  let userRequest: RemoteData<User, Error> = Loading

  fetchData()
    .then(response => {
      userRequest = Success(response)
    })
    .catch(error => {
      userRequest = Failure(error)
    })
}

function render(userRequest: RemoteData<User, Error>) {
  switch (userRequest.type) {
    case 'NotAsked':
      // Maybe we don't want to render anything until fetch has been triggered?
      return null

    case 'Loading':
      return 'Loading...'

    case 'Success':
      return `Hello, ${userRequest.data.username}`

    case 'Failure':
      return 'Could not fetch data!'
  }
}

// ...simulated fetch (no change)
function fetchData() {
  return new Promise<User>(resolve =>
    resolve({
      username: 'Tim Testuser',
      email: 'tim@example.com',
    })
  )
}
