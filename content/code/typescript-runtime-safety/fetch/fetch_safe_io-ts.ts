import fetch from 'node-fetch'
import * as t from 'io-ts'
import { Either, isRight } from 'fp-ts/lib/Either'

const Todo = t.type({
  userId: t.number,
  id: t.number,
  title: t.string,
  completed: t.boolean
})

type Todo = t.TypeOf<typeof Todo>

function getTodo(id: number): Promise<Either<t.Errors, Todo>> {
  return fetch(`https://jsonplaceholder.typicode.com/todos/${id}`)
    .then(response => response.json())
    .then(Todo.decode)
}

getTodo(1)
  .then(result => {
    // Success
    if (isRight(result)) {
      console.log(`Todo: #${result.right.id}: ${result.right.title}`)
      // Failure
    } else {
      console.error(result.left)
    }
  })
  .catch(e => console.error(e))

// io-ts-promise version (not included in the article)
// Read more: https://github.com/aeirola/io-ts-promise

import * as tPromise from 'io-ts-promise'

function getTodo_tPromise(id: number) {
  fetch(`https://jsonplaceholder.typicode.com/todos/${id}`)
    .then(response => response.json())
    .then(tPromise.decode(Todo))
    .then(todo => console.log(`Todo: #${todo.id}: ${todo.title}`))
    .catch(e => console.error(e))
}

getTodo_tPromise(2)
