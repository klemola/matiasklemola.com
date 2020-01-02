type Success<T> = {
  success: true
  value: T
}

type Failure = {
  success: false
  message: string
  key?: string
}

type Result<T> = Success<T> | Failure
