---
Title: Union types in TypeScript: modeling state
Date: 2019-05-02 00:00
Modified: 2020-03-16 00:00
Status: published
Category: Articles
Tags: typescript, advanced-types, refactoring
Slug: typescript-union-types
Sourcecode: https://github.com/klemola/matiasklemola.com/tree/master/content/code/typescript-union-types
Summary: Get familiar with union types in TypeScript with practical examples. You will get rid of of complex and buggy boolean logic by using union types to model the state of your application. Your colleagues will thank you later.
Audience: Folks who are somewhat familiar with TypeScript, and willing to learn about advanced types. I use some patterns analogous to React, so it helps if you've seen React code before.
---

People often trip up on logic involving boolean values. It has happened to me too! Dynamic languages (e.g. JavaScript) offer limited choices for modeling different outcomes. One could use weak enums (list of possible string values). It's still possible to use invalid values via typos. Inline boolean values are not named and might not communicate intention.

TypeScript provides a better alternative. I'd like to show you how I've modeled different logical outcomes using union types.

## Example: Fetching data

One of the most common examples of multi-boolean logic is fetching remote data. It's ideal to show e.g. a spinner while data is on it's way (if it might take a while).

In the example below you'll find a combination of an asynchronous operation in `main` and intermediate loading state in `render`. I wrote the example in a way that is typical for many front-end codebases. Take a moment to consider the logic. We'll improve on this example afterwards.

```ts
interface User {
    username: string
    email: string
}

function main() {
    let isLoading = true
    let fetchFailed = false
    let data: User

    fetchData()
        .then((response) => {
            isLoading = false
            data = response
        })
        .catch((error) => {
            isLoading = false
            fetchFailed = true
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
    return new Promise<User>((resolve) =>
        resolve({
            username: 'Tim Testuser',
            email: 'tim@example.com',
        })
    )
}
```

### Introducing union types

You might have noticed that we are dealing with many possible combinations of booleans and data that might be absent (`null`). Even with as few as two variables, `isLoading`and `data`, we have four possible combinations. Rendering logic is definitely missing some of the possible combinations. Logical outcome for output is to render

-   Nothing (implicitly - there's no `else` condition)
-   A loading message
-   User data (once it's present)
-   An error message

Ignoring the first option for now, let's model these possible outcomes in a union type.

```ts
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
```

Now we have solid names for different outcomes. They should explain what we _want_ to model. We also have extra information associated with `Success` and `Failure` types. That will be useful later.

Notice that we have a `type` attribute in all the type definitions. `Data` is a [tagged union], also known as a discriminated union. We need some kind of way to tell different options apart - a tag or a discriminator. It is possible in TypeScript by using literal string values as types. You might have seen this pattern already if you have written actions in `redux`.

How does this help? See another example below:

```ts
function main() {
    let userRequest: Data = { type: 'Loading' }

    fetchData()
        .then((response) => {
            userRequest = { type: 'Success', data: response }
        })
        .catch((error) => {
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
```

Nice, right? Creating `Data` values is not very ergonomic, but look at `render`! It's super clean compared to the first example. `render` now always returns something meaningful. TypeScript knows exactly what type we are dealing with once we have determined the current value of `Data` using a `switch` statement. That's why we don't have to test for the presence of the data anymore. TypeScript can ensure that all possible variations are taken into account. You only have to enable the `noFallthroughCasesInSwitch` option in `tsconfig.json`.

But wait! There's still room for improvement...

### RemoteData

One of the nicest abstractions I've come across is `RemoteData`. I encountered it while working on a semi-large Elm project. Our `Data` type is already pretty close to how `RemoteData` [is defined][remote-data-elm] (hats off to Kris Jenkins!).

Data is often not loading upon application initialization. `RemoteData` includes a `NotAsked` variant for that case. If data is fetched immediately, one can start from `Loading` state, like we did before. I've included a TypeScript version of the library in recent work projects. It's been well-received. Here's `RemoteData` in TypeScript:

```ts
interface NotAsked {
    type: 'NotAsked'
}

interface Loading {
    type: 'Loading'
}

interface Success<T> {
    type: 'Success'
    data: T
}

interface Failure<E> {
    type: 'Failure'
    error: E
}

type RemoteData<T, E> = NotAsked | Loading | Success<T> | Failure<E>
```

The type is defined using [generics]. Folks fetch different shapes of data and things can go wrong in many ways. Let's use `RemoteData` in the example.

```ts
import { RemoteData, Success, Failure, Loading } from './RemoteData'

interface User {
    username: string
    email: string
}

function main() {
    let userRequest: RemoteData<User, Error> = Loading

    fetchData()
        .then((response) => {
            userRequest = Success(response)
        })
        .catch((error) => {
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
```

It's not very different to what we had before, but now all realistic outcomes are modeled. You might have also noticed that I've included some values and helper functions that make it easy to create `RemoteData` instances.

```ts
const NotAsked: NotAsked = { type: 'NotAsked' }
const Loading: Loading = { type: 'Loading' }
const Success = <T>(data: T): Success<T> => ({
    type: 'Success',
    data,
})
const Failure = <E>(error: E): Failure<E> => ({
    type: 'Failure',
    error,
})
```

Sometimes you still need to test which variant of `RemoteData` is present. E.g. you might only care if a value is `Success`, and for that you can use helpers below. Using `switch` is not mandatory!

```ts
function isNotAsked<T, E>(remoteData: RemoteData<T, E>): remoteData is NotAsked {
    return remoteData.type === 'NotAsked'
}

function isLoading<T, E>(remoteData: RemoteData<T, E>): remoteData is Loading {
    return remoteData.type === 'Loading'
}

function isSuccess<T, E>(remoteData: RemoteData<T, E>): remoteData is Success<T> {
    return remoteData.type === 'Success'
}

function isFailure<T, E>(remoteData: RemoteData<T, E>): remoteData is Failure<E> {
    return remoteData.type === 'Failure'
}
```

### Live example with React

So far the `render` function has only served as an example and is never called. [Here's a live example][demo-one] (with React) that actually renders something.

## Advanced example: Initializing an application

Single page applications often need some data to be available for all (sub)components. For example, many logical parts of an application might need to be translated. We have the user data. What if we fetched translations, too?

Let's find out if we can design a solid application initialization logic. Consider the example below:

```ts
interface User {
    username: string
    email: string
}

type Translations = { [key: string]: string }

function main() {
    let userRequest: RemoteData<User, Error> = Loading
    let translationsRequest: RemoteData<Translations, Error> = Loading

    fetchUser()
        .then((response) => {
            userRequest = Success(response)
        })
        .catch((error) => {
            userRequest = Failure(error)
        })

    fetchTranslations()
        .then((response) => {
            translationsRequest = Success(response)
        })
        .catch((error) => {
            translationsRequest = Failure(error)
        })
}
```

We are using `RemoteData` with two requests. You should take a moment to figure out all the logical outcomes for these concurrent requests. You might want to write the rendering logic yourself as an exercise. In any case, you'll find a naive solution below.

```ts
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
```

I'm back to using boolean logic for selecting what to render. At least the helper functions are improving readability. Maybe your solution is better?

Three of the many possible outcomes are interesting. Either we are still loading something, have received all the data, or something went wrong. Not that different from previous examples, huh?

### Modeling app state

Here's a model for app state in the fashion of `RemoteData`.

```ts
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

type AppState = Initializing | Ready | Failing
```

Some of the types include data, like in `RemoteData`. It's quite handy - a reference to `Ready` will always contain user data and translations. You can share that reference application-wide.

Time to improve on the previous example.

```ts
function main() {
    let userRequest: RemoteData<User, Error> = Loading
    let translationsRequest: RemoteData<Translations, Error> = Loading
    let appState: AppState = Initializing

    fetchUser()
        .then((response) => {
            userRequest = Success(response)

            if (isSuccess(userRequest) && isSuccess(translationsRequest)) {
                appState = Ready(userRequest.data, translationsRequest.data)
            }
        })
        .catch((error) => {
            userRequest = Failure(error)
            appState = Failing(error)
        })

    fetchTranslations()
        .then((response) => {
            translationsRequest = Success(response)

            if (isSuccess(userRequest) && isSuccess(translationsRequest)) {
                appState = Ready(userRequest.data, translationsRequest.data)
            }
        })
        .catch((error) => {
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
```

`main` function updates app state when necessary. There is still the need for a boolean check to see if we have all the required data after one piece of data is loaded. Translations might arrive before user data, or vice versa. Other logic remains the same.

`render` is (once again) cleaner and all app state are taken into account.

[Here's another live example with React][demo-two].

### "Your app initialization example is contrived!"

It would be simpler to use `Promise.all` in `main`. The application could wait until all the data is loaded, or for the first failure. Nothing would change for the worse, and there would be less code to maintain. Sure.

I chose the example for a reason. I wanted you to see that something as tricky as race conditions between simultaneous jobs can be managed with proper planning. You might not always have this level of control over when an asynchronous job starts!

I was recently tasked with having key search results show before some of the other results. It was because loading key results took one tenth of the time vs. other results. The pattern used above works in a case like that. Something like `KeyResultsReady` is a valid option for `SearchState`, just as `AllResultsReady` is. Possible flows (barring failures) are then

-   `Loading` -> `KeyResultsReady` -> `AllResultsReady`
-   `Loading` -> `AllResultsReady`

Again, this makes intentions clear.

## Conclusion

Key benefits of using union types for modeling state are

-   having to think about all logical possibilities
-   naming the states (exhibits intention, works as documentation)
-   absent values for data are not required anymore
-   cleaner code when using data from the state

There are some tradeoffs. One has to write all the interfaces and helper functions. It takes some time to figure out decent names for different values. There's some learning curve involved.

I would say, though, that this kind of premeditation is useful. The general benefit of adding types is to avoid bugs and to verify that your code does what you think it does. This is why you probably are using TypeScript anyway!

Thanks for reading.

---

Still craving for more? Check out ["Take control of unexpected data at runtime with TypeScript"][ts-runtime-safety].

[tagged union]: https://en.wikipedia.org/wiki/Tagged_union
[remote-data-elm]: https://package.elm-lang.org/packages/krisajenkins/remotedata/latest/RemoteData
[generics]: https://www.typescriptlang.org/docs/handbook/generics.html
[demo-one]: https://codesandbox.io/s/j3wxq7q073?fontsize=14&view=preview
[demo-two]: https://codesandbox.io/s/03wv5vpo6l?fontsize=14&view=preview
[ts-runtime-safety]: /typescript-runtime-safety
