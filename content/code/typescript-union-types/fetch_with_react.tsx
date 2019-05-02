import * as React from 'react'
import { render } from 'react-dom'

import { RemoteData, Success, Failure, Loading } from './RemoteData'

interface User {
  username: string
  email: string
}

interface State {
  userRequest: RemoteData<User, Error>
}

class Example extends React.Component<{}, State> {
  componentWillMount() {
    this.setState({ userRequest: Loading })

    this.fetchData()
      .then(response => {
        this.setState({ userRequest: Success(response) })
      })
      .catch(error => {
        this.setState({ userRequest: Failure(error) })
      })
  }

  fetchData() {
    return new Promise<User>(resolve =>
      setTimeout(
        () =>
          resolve({
            username: 'Tim Testuser',
            email: 'tim@example.com',
          }),
        2000
      )
    )
  }

  render() {
    const { userRequest } = this.state
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
}

render(<Example />, document.getElementById('root'))
