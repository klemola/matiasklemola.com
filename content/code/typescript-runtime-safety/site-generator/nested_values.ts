import { String, Number, Record, Array } from 'runtypes'

const Example = Record({
  fizz: String,
  foo: Record({
    bar: Number,
    another: Record({
      hello: String
    }),
    things: Array(String)
  })
})

const data: unknown = {
  fizz: 'buzz',
  foo: {
    bar: 1,
    another: {
      hello: 'world'
    },
    things: ['one', 'two', 'three']
  }
}

try {
  const example = Example.check(data)

  console.log('Valid', {
    hello: example.foo.another.hello
  })

  for (const thing of example.foo.things) {
    console.log(`Thing ${thing}`)
  }
} catch (e) {
  console.error('Something went wrong!', e)
}
