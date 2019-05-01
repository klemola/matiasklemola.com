interface User {
  username: string
  email: string
}

export function main() {
  let isLoading = true
  let fetchFailed = false
  let data: User

  fetchData()
    .then(response => {
      isLoading = false
      data = response
    })
    .catch(error => {
      isLoading = false
      fetchFailed = false
    })
}

function render(isLoading, data, fetchFailed) {
  if (isLoading) {
    return 'Loading...'
  } else if (!isLoading && data) {
    return `Hello, ${data.username}`
  } else if (fetchFailed) {
    return 'Could not fetch data!'
  }
}

// simulated fetch
function fetchData() {
  return new Promise<User>(resolve =>
    resolve({
      username: 'Tim Testuser',
      email: 'tim@example.com',
    })
  )
}
