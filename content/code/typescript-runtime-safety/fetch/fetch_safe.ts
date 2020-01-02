import fetch from 'node-fetch'
import { String, Number, Boolean, Record, Static, Result } from 'runtypes'

const Todo = Record({
  userId: Number,
  id: Number,
  title: String,
  completed: Boolean
})

type Todo = Static<typeof Todo>

function getTodo(id: number) {
  fetch(`https://jsonplaceholder.typicode.com/todos/${id}`)
    .then(response => response.json())
    .then(todo => Todo.check(todo))
    // todo is now verified to be a Todo and you can safely access the attributes
    .then(todo => console.log(`Todo: #${todo.id}: ${todo.title}`))
    .catch(e => console.error(e))
}

async function getTodo_await(id: number) {
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/todos/${id}`
    )
    const data = await response.json()
    const todo = Todo.check(data)

    console.log(`Todo: #${todo.id}: ${todo.title}`)
  } catch (e) {
    console.error(e)
  }
}

// Non-throwing version (not included in the article)
// Read more: https://github.com/pelotom/runtypes#type-guards
function getTodo_guard(id: number) {
  fetch(`https://jsonplaceholder.typicode.com/todos/${id}`)
    .then(response => response.json())
    .then(todo => {
      if (Todo.guard(todo)) {
        console.log(`Todo: #${todo.id}: ${todo.title}`)
      } else {
        console.error('Expected Todo, got something else', todo)
      }

      return
    })
}

// Result
function getTodo_result(id: number): Promise<Result<Todo>> {
  return fetch(`https://jsonplaceholder.typicode.com/todos/${id}`)
    .then(response => response.json())
    .then(Todo.validate)
}

getTodo_result(1)
  .then(result => {
    if (result.success) {
      console.log(`Todo: #${result.value.id}: ${result.value.title}`)
    } else {
      // result is Failure
      console.error(result.message)
    }
  })
  // the request or JSON parsing can still fail
  .catch(e => console.error(e))

getTodo(2)
getTodo_await(3)
getTodo_guard(4)
