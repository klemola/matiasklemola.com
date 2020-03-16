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

export type RemoteData<T, E> = NotAsked | Loading | Success<T> | Failure<E>

export const NotAsked: NotAsked = { type: 'NotAsked' }
export const Loading: Loading = { type: 'Loading' }
export const Success = <T>(data: T): Success<T> => ({
  type: 'Success',
  data,
})
export const Failure = <E>(error: E): Failure<E> => ({
  type: 'Failure',
  error,
})

export function isNotAsked<T, E>(
  remoteData: RemoteData<T, E>
): remoteData is NotAsked {
  return remoteData.type === 'NotAsked'
}

export function isLoading<T, E>(
  remoteData: RemoteData<T, E>
): remoteData is Loading {
  return remoteData.type === 'Loading'
}

export function isSuccess<T, E>(
  remoteData: RemoteData<T, E>
): remoteData is Success<T> {
  return remoteData.type === 'Success'
}

export function isFailure<T, E>(
  remoteData: RemoteData<T, E>
): remoteData is Failure<E> {
  return remoteData.type === 'Failure'
}

export function mapSuccess<T, U>(
  fn: (data: T) => U,
  remoteData: Success<T>
): Success<U> {
  return {
    ...remoteData,
    data: fn(remoteData.data),
  }
}
