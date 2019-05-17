import * as React from 'react'
import { render } from 'react-dom'

import { RemoteData, Success, Failure, Loading, isSuccess } from './RemoteData'
import {
  User,
  Translations,
  AppState,
  Ready,
  Initializing,
  Failing,
} from './AppState'

interface State {
  userRequest: RemoteData<User, Error>
  translationsRequest: RemoteData<Translations, Error>
  appState: AppState
}

const initialState: State = {
  userRequest: Loading,
  translationsRequest: Loading,
  appState: Initializing,
}

class Example extends React.Component<{}, State> {
  state = initialState

  componentDidMount() {
    this.setState(initialState)

    this.fetchUser()
      .then(response => {
        let userRequest = Success(response)
        let translationsRequest = this.state.translationsRequest

        this.setState({
          userRequest,
          appState:
            isSuccess(userRequest) && isSuccess(translationsRequest)
              ? Ready(userRequest.data, translationsRequest.data)
              : this.state.appState,
        })
      })
      .catch(error => {
        this.setState({
          userRequest: Failure(error),
          appState: Failing(error),
        })
      })

    this.fetchTranslations()
      .then(response => {
        let userRequest = this.state.userRequest
        let translationsRequest = Success(response)

        this.setState({
          translationsRequest,
          appState:
            isSuccess(userRequest) && isSuccess(translationsRequest)
              ? Ready(userRequest.data, translationsRequest.data)
              : this.state.appState,
        })
      })
      .catch(error => {
        this.setState({
          translationsRequest: Failure(error),
          appState: Failing(error),
        })
      })
  }

  fetchUser() {
    return new Promise<User>(resolve =>
      setTimeout(
        () =>
          resolve({
            username: 'Tim Testuser',
            email: 'tim@example.com',
          }),
        1000
      )
    )
  }

  fetchTranslations() {
    return new Promise<Translations>(resolve =>
      setTimeout(
        () =>
          resolve({
            appTitle: 'TypeScript union types example',
            greeting: 'Hello',
          }),
        500
      )
    )
  }

  render() {
    const { appState } = this.state
    switch (appState.type) {
      case 'Initializing':
        return 'Loading...'

      case 'Ready':
        const { appTitle, greeting } = appState.translations
        return (
          <div className="app">
            <h1>{appTitle}</h1>
            <p>{`${greeting}, ${appState.user.username}`}</p>
          </div>
        )

      case 'Failing':
        return 'Could not initialize the application!'
    }
  }
}

render(<Example />, document.getElementById('root'))
