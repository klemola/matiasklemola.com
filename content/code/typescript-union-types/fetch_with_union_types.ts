interface User {
  username: string
  email: string
}

type Data =
  | {
      type: 'Loading'
    }
  | {
      type: 'Success'
      data: User
    }
  | {
      type: 'Failure'
      error: Error
    }

export function main() {
  let userRequest: Data = { type: 'Loading' }

  fetchData()
    .then(response => {
      userRequest = { type: 'Success', data: response }
    })
    .catch(error => {
      userRequest = { type: 'Failure', error }
    })
}

function render(userRequest: Data) {
  switch (userRequest.type) {
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
