---
Title: Take control of unexpected data at runtime with TypeScript
Date: 2020-01-02 00:00
Status: published
Category: Articles
Tags: typescript, advanced-types, error-handling, functional-programming
Slug: typescript-runtime-safety
Cover: covers/typescript-runtime-safety.png
Sourcecode: https://github.com/klemola/matiasklemola.com/tree/master/content/code/typescript-runtime-safety
Summary: Learn how to use TypeScript type definitions to get better guarantees for runtime safety.
Audience: Folks who are looking to prevent runtime exceptions and to explore various strategies for error handling.
Publication: LogRocket blog
Origin: https://blog.logrocket.com/using-typescript-to-stop-unexpected-data-from-breaking-your-app
---

In this article, we’ll explore how to use TypeScript type definitions to get better guarantees for runtime safety. I’ll show you how [runtypes] and [io-ts] libraries are used and explain why they exist in the first place.

The TypeScript compiler is a powerful friend. It will help you understand what kind of data you are dealing with — function parameters, return types, constants, library definitions, and so on. You can avoid surprising values and find common mistakes with minimal configuration. The compiler will save you from having to validate everything with tests, or manually in a UI, which saves time. Libraries tend to have decent type definitions these days, and many are written in TypeScript. With additional flags, you can turn the (type) quality of the code up:

- `strict` (recommended - includes `noImplicitThis`, `noImplicitAny`, enforces types)
- `noEmitOnError` (all emitted code should be checked)
- `noImplicitReturns`
- `noFallthroughCasesInSwitch`

With a strict config and extensive typing, can your app compile and still break? Yes it can!

## Runtime safety

TypeScript provides compile time safety. If you refer to a familiar value in a wrong way in the code, you’ll get compile errors. Typo in an attribute name? A compile error. What about runtime safety? Runtime exceptions are a feature of JavaScript, and therefore of Typescript. For example, `JSON.parse` throws an exception if it encounters non-JSON data. `foo.bar()` throws a `ReferenceError` if `foo` doesn’t exist. These can be caught with `try {…} catch (e) {…}`, or handled as Promise rejections. That is all well and good, but we can do even better.

Usually, when an unexpected exception is thrown, the culprit is the data that flows in and out of the application. Given that you can near-perfectly define how a TypeScript app deals with data that conforms to known `interface`s, how can it happen? Declaring an interface is like stating that “this is what my data looks like; enforce it please.” Well, you can lie — or just be wrong.

I’ll show how to deal with unexpected data during runtime with three distinct examples.

## Exploring the unknown

I’ve concluded that no existing static site generator will do, so I decided to build my own. After a lot of hard work, I came up with this:

{% include_code typescript-runtime-safety/site-generator/site_generator.ts lang:typescript %}

Being a seasoned developer, I am wary of exceptions thrown by `fs` and `JSON.parse` . My app compiles. But when I run it, I see this:

```
$ node site_generator.js

🚧 Generating "undefined"
...
```

Looks like I have a typo in my config file. It spells “sitename” instead of “siteName.” This is a simple example of how essentially all data that comes into your app is technically unknown. Luckily, there’s a way to deal with unknown data at runtime. I introduced the [runtypes] library to my app.

{% include_code typescript-runtime-safety/site-generator/site_generator_safe.ts lang:typescript %}

The app looks almost the same. The difference is that I’ve declared `Config` using the types provided by `runtypes`. The term [record] and the related term “field” are similar to what people refer to as “objects” and “attributes,” but since objects in JavaScript can be just about anything, (`window`, `Array`, etc.), the distinction is useful. Think of records as rows in a spreadsheet — they’re “just” data. The runtime object that `runtypes` builds from the record has methods such as `check` and `guard` that validate that some data is compatible with the actual type definition that I declared (line 11).

You might have used some form validation library before to do something similar. In a form, we validate the values. Here, we validate the structure (“fields” and their values). You can add extra validation [constraints] that narrow down the valid values too. This is great for validating incoming payloads in API handlers.

This might seem like a lot to take in. Let’s run the new version with the same faulty config file before I explain the implications of all of this (you can try it [in CodeSandbox][codesandbox-node]).

```
$ node site_generator_safe.js

Something went wrong! ValidationError: Expected string, but was undefined
    at new ValidationError (./node_modules/runtypes/lib/errors.js:19:28)
    at Object.check (./node_modules/runtypes/lib/runtype.js:23:15)
    < some stack frames omitted >
    at Function.Module.runMain (internal/modules/cjs/loader.js:1047:10)
    at internal/main/run_main_module.js:17:11 {
  key: 'siteName',
  name: 'ValidationError'
}
```

The undefined value was recognized. The application stopped before it had a chance to use the bad config. As you might imagine, a somewhat more advanced app would benefit from giving up early on, rather than halfway through a long process. Slightly incorrect config could wreak havoc in a script that, for example, bills customers monthly.

In the result above, my app threw an exception with `ValidationError` when it checked bad config. That’s how the `check` method works: it brings unexpected data into the realm of things you can manage by catching it. There is a way to deal with bad data without using exceptions — we’ll get to that shortly. First, let’s talk about the reliability of web APIs.

## What if an API lies?

Few web or mobile applications are useful without external data. In 2019, most apps get their data from cloud-based REST or GraphQL APIs. These APIs are often versioned and hopefully come with some kind of documentation that states what kind of data you can expect to receive (or should send). The documentation can be interactive — [Swagger][swagger] is a nice tool for that.

Errors from questionable design, like returning HTML-formatted error responses with OK (200) status from JSON APIs, can be caught in the JSON parsing phase. If you’re lucky enough to have solid TypeScript code on both the backend and the frontend, you can share type definitions and, at best, guarantee that both sides truly understand each other. The reality is that you often end up hoping that developers on the other side know what they are doing. Thoughtful devs use integration tests, versioning, and frozen schemas to provide guarantees for their API. You might still make errors on your side when writing type definitions.

Changes in the APIs you rely on and any weird behavior can be caught with `runtypes` during testing and QA. You can build integration tests on your side that only validate that the API responses are up to date with your assumptions (or the other way around) using runtime type checking. An app that is running in production might not have a reasonable way to recover from type errors. You can still get a descriptive error message or crash report. An infinite (restart) loop can also be avoided.

I’ll show you how this works in practice.

## Fetch me a type-safe record, will you?

The static site generator proved to be too big an undertaking, so I’m going to build a to-do app instead. Let’s start by retrieving data from the API using [fetch]. We’ll see that having `runtypes` validate incoming data brings other benefits too.

{% include_code typescript-runtime-safety/fetch/fetch_safe.ts lang:typescript lines:2-20 %}

The `getTodo` function fetches some data, parses the JSON response, and then type checks the result in separate steps. Any errors in type checking will be caught, along with connection and JSON parsing-related errors, in the `.catch` handler. After the type is checked, you can work with the contents of a `Todo` without an explicit type annotation. This will clean up the code in cases where TypeScript can’t infer the type of essentially unknown data.

If I add a new field called “priority” with type `Number` to the Todo record (not present in the API), a call to `getTodo` results in `ValidationError: Expected number, but was undefined`. I can specify less fields than the API provides if I don’t need all of them in the app.

!!! note "On nullable values"

    Fields that can be `null` in the API response are supported. They look like this: `priority: Number.Or(Null)`. Note the capital N in Null. It’s defined by `runtypes`.

The to-do app is using a Promise-based flow. Had I used `async / await`, `getTodo` would look like this:

{% include_code typescript-runtime-safety/fetch/fetch_safe.ts lang:typescript lines:22-34 %}

It’s up to you to decide which format works better for your use case. `runtimes` doesn’t limit the options for the application design. In fact, now is a good time to discuss how we can avoid type checking-related exceptions altogether.

## Errors as data

I’m personally not a fan of the idea of runtime exceptions. I much prefer to use a language or library that gives me a chance to work with failures as data instead of a [GOTO-like control flow][gotos]. What does failure as data look like? Many are familiar with the NodeJS convention for callback parameters `(err, data)` , which are sometimes used as function return values.

```ts
const [err, data] = myFunction('foo', 'bar')
```

This format can prevent exceptions, but it is still cumbersome. You have to check for the presence of `err` or `data` (the idea is that one of them is always `null`, not guaranteed). This design can be thought to have boolean logic — an action results in err or data. A more sophisticated approach is to use a union type.

{% include_code typescript-runtime-safety/fetch/Result.ts lang:typescript %}

The snippet above is from `runtypes` source code (I’ve removed export statements and comments). A successful operation is presented as a record with an associated `value`. A failure (error) describes the error with a `message`. This idea is not unique to `runtypes`; it’s found in many programming languages, such as Rust, Elm, Haskell and Swift. It’s also similar to Option/Maybe in its duality. Let’s see how using this idea changes the `getTodo` function.

{% include_code typescript-runtime-safety/fetch/fetch_safe.ts lang:typescript lines:53-69 %}

For those familiar with generics in TypeScript, the function return type makes sense. If it looks weird for others, don’t be alarmed! It’s just a specific kind of data inside a different kind of data. You can work with the `result` in the function’s promise chain if you want to, but I have chosen to move the logic out of the function. This way, `Todo`s can be fetched and validated, and you can do whatever you want with the results.

!!! note "On fetch and Results"

    Regarding the `.catch` handler above, if `fetch` worked with `Result`s out of the box, it would be possible to chain it with our validation logic. You can build a wrapper that catches exceptions and returns a `Result`. That’s outside the scope of this article. Some languages have a Result-like type baked into their standard library, and it’s used by everything that can fail, making things much safer and convenient than in the TS/JS ecosystem by default.

If you’ve made it this far, awesome! Now you have a new tool at your disposal that can greatly improve the quality of an app. You can play around with this version [in CodeSandbox][codesandbox-fetch-runtypes]. If I can still have your attention, I have something to show.

## No alarms and no surprises, please

Think about the proposition that if your app compiles, it works. If you can rely on that, you’ll only have to fix any compile errors and you’ll have an app that is completely predictable. Then you only have to make sure your algorithms are valid and that you haven’t forgotten to render some results. This enables you to work without the usual anxiety and doubt.

The [Elm programming language][elm] is known for promising zero runtime exceptions. It’s a big promise to make. Consider third-party libraries: how in the world can you be sure that code authored by someone else is completely safe, so to speak? That’s only possible if the programming language authors carefully choose a limited set of operations that everybody adheres to. Curious about how Elm makes this possible? All libraries are pure Elm, retrieved from a central package registry that enforces the following:

- Semantic versioning — a library will not compile if the semantic version is wrong.
- Safety — libraries are written in Elm, so everybody’s code is equally safe from exceptions.
- Any ultimate `Result`s in a library function will be handled by you — a lib can’t cause mayhem. You can also disregard any errors in the library, if it pleases you.

Elm has a runtime of its own that requires you to encode/decode (validate) all data that flows in an out of the application. Being a pure functional language, all functions in an app and libs deal only with values provided as their parameters and can only return descriptions of [side-effects], not trigger them. Every function has to have a meaningful return value.

I am a big fan of Elm. Whenever I choose to use TypeScript (or can’t use Elm), I try to keep Elm’s lofty goal in mind. Though Elm is not as popular as TypeScript, it’s very influential. That’s why you’ll find libraries in the JavaScript ecosystem that straight-up imitate Elm’s features. The most popular one might be Redux, which is an approximation of Elm’s state management. Let me introduce you to [io-ts] which is an FP/Elm-flavored alternative to `runtypes`.

## Either way, no runtime exceptions

Take a look at another version of the fetch example.

{% include_code typescript-runtime-safety/fetch/fetch_safe_io-ts.ts lang:typescript lines:2-30 %}

At a glance, the structure of this example resembles the `Result` version of the `runtypes` example. Same guarantees, no type-related exceptions. Even the way I defined the Todo record is very similar to previous work.

Notice the `fp-ts` import? It’s a collection of common data types from the world of functional programming. `io-ts` builds upon it. There’s an [ecosystem of libraries][fp-ts] that share the core types. If you take the time to understand concepts like [Task][task] in relation to what folks normally use with TypeScript (Promises), you can learn advanced functional programming in the context of a familiar language. To truly immerse yourself in functional programming, I recommend that you at least try Elm.

The `Result`-like `Either` type is split into the left and right sides. By convention, the left side denotes an error, and the right side denotes a valid value. If this naming convention seems hard to remember, I don’t blame you; I prefer the naming in `Result` myself. You can remind yourself by saying to yourself, “Seems like I have the `Right` data.” The type definition is as follows.

{% include_code typescript-runtime-safety/receipt/Either.ts lang:typescript %}

There are some benefits of `runtypes`' `Result`. The `E` value on left side allows other representations for errors than just strings — remember `message`s? Having strings instead of booleans as tags makes it more compatible with other [tagged unions] (strings allow more than two possible values in a union).

So far, the only tangible benefits of using `io-ts` over `runtypes` seems to be related to naming and compatibility. Other benefits become apparent if we take a step back and use our validated data as part of a chain of operations. Forget about the to-do app — the next example has actual business logic.

I want to print out a receipt like this from the summary of a purchase:

```
Receipt
========
Date: 2019-12-01T12:21:28.478Z
Total: 12.80€
Tax: 3.07€
```

Once I am comfortable with the data types of `fp-ts` and their operations, the app comes naturally.

{% include_code typescript-runtime-safety/receipt/receipt.ts lang:typescript %}

What’s so great about using a functional approach? See the `pipe`lines I’ve built? As long as the return value of an operation is a valid parameter to the next, the operations compose. Since values with types like `Either` are structurally the same, they can be transformed using common functions. There are two transformation pipelines:

1. Calculating a sum of items’ prices (`purchaseToReceipt`)
2. Transforming unknown `data` into a summary string

You are probably familiar with how good ol’ `Array`s can be transformed with operations like `items.filter(fn)`. Those are operations bound to an array instance. Here, you can use values from anywhere and compose them as you like.

I’ve only scratched the surface of what you can do with the `fp-ts` family. If this felt like your thing, go ahead and build your own apps using (only) these new concepts. You can also try the example in [CodeSandbox][codesandbox-receipt]. Now let’s wrap up what we have done during this journey.

## Conclusion

We started by discussing runtime exceptions and building a working but unreliable static site generator. We added `runtypes` definitions to the generator and had it stop early if the configuration was off.

Then we moved into the frontend and tried to fetch some to-dos. We noticed that runtime type checking helps to recognize differences between our expectations and API responses. Our app was still throwing exceptions around, so we tried a different way using errors as data: `Result`s.

We then compared `runtypes` to `io-ts` to see if this `Result` thing was any good (under the name `Either`). Once it seemed like there was a good reason to use this two-sided pattern, we explored how things look if we immerse ourselves in the `fp-ts` ecosystem. Functional programming had a chance to show its strength in a receipt generating script. We applied operations on the the results of other operations in a clear way.

Which one of these different flavors of runtime type checking should you use? It depends on what kind of application you are building. A simple top-down script might be fine if it just crashes when an exception is thrown. A long-running app, such as a mobile app, might benefit from recovering from exceptions or, better yet, work with errors as data. Catching exceptions and working with errors gives you the freedom to choose whether you need a user interaction or should retry the thing that just failed. Some minor things can even be ignored in a controlled fashion. In any case, you’ll likely end up with a more reliable app.

!!! note "Additional safety measures"

    I have focused on validating completely external data. Apps create data from user input too. A TypeScript-based form library such as [Formik][formik] understands your interfaces. It can help you handle possible errors that stem from unreliable user input. This is different from API calls because the application determines how the data is gathered. You can use `runtypes` and `io-ts` for form validation using either [constraints] or [encoders]. It might be more ergonomic to use whatever the form library uses. Formik uses [yup].

    In addition to input and output, apps often have internal state of a UI. You can validate your app’s logic by using a state machine. State machines define controlled runtime state transitions and document your intention. They can also trigger side-effects. See: [XState][xstate], written in TypeScript.

There. You've made it to the end of the article! Maybe it's time to [tweet about it][twitter-intent]?

Still craving for more? Check out ["Union types in TypeScript: modeling state"][ts-union-types].

[runtypes]: https://github.com/pelotom/runtypes
[io-ts]: https://gcanti.github.io/io-ts
[fp-ts]: https://gcanti.github.io/fp-ts/introduction/ecosystem
[formik]: https://jaredpalmer.com/formik
[yup]: https://github.com/jquense/yup
[xstate]: https://github.com/davidkpiano/xstate
[codesandbox-node]: https://codesandbox.io/s/ts-runtime-safety-node-70dx2
[codesandbox-fetch-runtypes]: https://codesandbox.io/s/merhk?fontsize=14&hidenavigation=1&theme=dark
[codesandbox-receipt]: https://codesandbox.io/s/dw1me?fontsize=14&hidenavigation=1&theme=dark
[record]: https://en.wikipedia.org/wiki/record_(computer_science)
[constraints]: https://github.com/pelotom/runtypes#constraint-checking
[encoders]: https://github.com/gcanti/io-ts#the-idea
[swagger]: https://swagger.io
[fetch]: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
[gotos]: https://softwareengineering.stackexchange.com/questions/189222/are-exceptions-as-control-flow-considered-a-serious-antipattern-if-so-why
[elm]: https://elm-lang.org
[side-effects]: https://jrsinclair.com/articles/2018/how-to-deal-with-dirty-side-effects-in-your-pure-functional-javascript/
[task]: https://gcanti.github.io/fp-ts/modules/Task.ts
[tagged unions]: https://mariusschulz.com/blog/tagged-union-types-in-typescript
[twitter-intent]: https://twitter.com/intent/tweet?url=https%3A%2F%2Fmatiasklemola.com%2Ftypescript-runtime-safety&via=matiasklemola&text=Learn%20how%20to%20use%20TypeScript%20type%20definitions%20to%20get%20better%20guarantees%20for%20runtime%20safety.
[ts-union-types]: /typescript-union-types
