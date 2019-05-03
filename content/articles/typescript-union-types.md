---
Title: Union types in Typescript: modeling state
Date: 2019-05-02 00:00
Status: published
Category: Articles
Tags: typescript, advanced-types
Slug: typescript-union-types
Sourcecode: https://github.com/klemola/matiasklemola.com/tree/master/content/code/typescript-union-types
Summary: Get familiar with union types in Typescript with practical examples. Using union types to model state will rid your application of complex and buggy boolean logic. Your colleagues will thank you later.
Audience: Folks who are somewhat familiar with Typescript, and willing to learn about advanced types. I use some patterns analogous to React, so it helps if you've seen React code before.
---

In my time of being a professional software developer I've seen people tripping up on logic involving multiple boolean values. It has happened to me too! Dynamic languages (e.g. JavaScript) offer limited choices for modeling multiple outcomes. One could use weak enums (bunch of possible string values in a list), but it's still possible to use invalid values via typos. If that wasn't bad enough, inline boolean values are not named and might not communicate intention clearly. Now that Typescript is gaining traction, I'd like to show you how I've modeled multiple logical outcomes using union types.

## Example: Fetching data

Most common example of multi-boolean logic that I have observed is related to fetching remote data, often inside a React component's lifecycle methods. It's ideal to show some kind of temporary view while data is on it's way (e.g. a spinner), at least if it's likely that getting said data will take a while.

In the example below you'll find a combination of an asynchronous operation in `main` and intermediate loading state in `render`. The example is written in a way that is typical for many front-end codebases. Take a moment to consider the logic. We'll improve on this example afterwards.

{% include_code typescript-union-types/fetch_with_booleans.ts lang:typescript %}

### Introducing union types

You might have noticed that we are dealing with multiple possible combinations of booleans and data that might be absent (`null`). Even with just two variables, `isLoading`and `data`, we have four possible combinations. Rendering logic is definitely missing some of the possible combinations. Logical outcome for output is to render

- Nothing (implicitly - there's no `else` condition)
- A loading message
- User data (once it's present)
- An error message

Ignoring the first option for now, let's model these possible outcomes in a union type.

{% include_code typescript-union-types/fetch_with_union_types.ts lang:typescript lines:6-17 %}

Now we have solid names for different outcomes. They should explain what we _want_ to model. We also have extra information associated with `Success` and `Failure` types, and that will be useful later.

Notice that we have a `type` attribute in all of the type definitions. `Data` is a [tagged union](https://en.wikipedia.org/wiki/Tagged_union), also known as a discriminated union. We need some kind of way to tell different options apart (a tag or discriminator), and in Typescript that can be achieved by using literal string values as types. You might have seen this pattern already if you have written actions in `redux`.

How does this help? See another example below:

{% include_code typescript-union-types/fetch_with_union_types.ts lang:typescript lines:19-42 %}

Nice, right? Creating `Data` values is not terribly ergonomic, but look at `render`! It's super clean compared to the first example. `render` now always returns something meaningful. Furthermore, Typescript knows exactly what type we are dealing with once we have determined the current value of `Data` using a `switch` statement. That's why we don't have to test for the presence of the data anymore. With the `noFallthroughCasesInSwitch` option enabled in Typescript you can ensure that all possible variations are taken into account.

But wait! There's still room for improvement...

### RemoteData

One of the nicest abstractions I've come across is `RemoteData`. I encountered it while working on a semi-large Elm project. Our `Data` type is already pretty close to how `RemoteData` [is defined](https://package.elm-lang.org/packages/krisajenkins/remotedata/latest/RemoteData) (hats off to Kris Jenkins!).

`RemoteData` includes a `NotAsked` variant. It's realistic, since unless a fetch is started immediately upon application initialization, data is not being loaded. If data is fetched immediately upon initialization, one can safely start from `Loading`, like we did before. I've included a Typescript version of the library in recent work projects, because I don't want to model data fetching in any other way (anymore). Here's `RemoteData` in Typescript:

{% include_code typescript-union-types/RemoteData.ts lang:typescript lines:1-19 %}

The type is defined using [generics](https://www.typescriptlang.org/docs/handbook/generics.html), since who knows what kind of data someone is fetching and exactly what can go wrong? Let's use `RemoteData` in the example.

{% include_code typescript-union-types/fetch_with_remotedata.ts lang:typescript lines:1-35 %}

It's not very different to what we had before, but now all realistic outcomes are modeled. You might have also noticed that I've included some values and helper functions that make it easy to create `RemoteData` instances.

{% include_code typescript-union-types/RemoteData.ts lang:typescript lines:21-31 %}

You probably occasionally still need to test which variant of `RemoteData` is present (e.g. you might only care if a value is `Success`), and that can be done easily using some helpers. Using `switch` is not mandatory!

{% include_code typescript-union-types/RemoteData.ts lang:typescript lines:32-54 %}

### Live example with React

So far the `render` function has only served as an example and has not been used. [Here's a live example](https://codesandbox.io/s/j3wxq7q073?fontsize=14&view=preview) (with React) that actually renders something.

## Advanced example: Initializing an application

Single page applications often require some data to be available for all (sub)components. For example, many logical parts of an application might need to be translated. What if we fetched translations in addition to the user data?

Let's find out if we can design a solid application initialization logic. Consider the example below:

{% include_code typescript-union-types/app_init_take_one.ts lang:typescript  lines:11-37 %}

We are using `RemoteData` with two requests. I advise you to take a moment to figure out all of the logical outcomes for these concurrent requests. You might want to write the rendering logic yourself as an exercise. In any case, you'll find a naive solution below.

{% include_code typescript-union-types/app_init_take_one.ts lang:typescript  lines:39-56 %}

I'm back to using boolean logic for selecting what to render. At least the helper functions are improving readability. Maybe your solution is better?

Three of the many possible outcomes are interesting. Either we are still loading something, have received all the data, or something went wrong. Not that different from previous examples, huh?

### Modeling app state

Here's a model for app state in the fashion of `RemoteData`.

{% include_code typescript-union-types/AppState.ts lang:typescript  lines:8-23 %}

Some of the types include data, just like in `RemoteData`. It's quite handy - a reference to `Ready` will always contain user data and translations for the lifecycle of the whole application.

Time to improve on the previous example.

{% include_code typescript-union-types/app_init_take_two.ts lang:typescript  lines:11-41 %}

{% include_code typescript-union-types/app_init_take_two.ts lang:typescript  lines:43-56 %}

`main` function updates app state when necessary. There is still the need for a boolean check to see if we have all the required data after one piece of data is loaded. Translations might arrive before user data, or vice versa. Other logic remains the same.

`render` is (once again) cleaner and all app state are taken into account.

[Here's another live example with React](https://codesandbox.io/s/03wv5vpo6l?fontsize=14&view=preview).

### "Your app initialization example is contrived!"

Some of the possible logical outcomes could be avoided if one used `Promise.all` in `main` and had the application wait until all of the data is loaded (or for the first failure). Nothing would really change for the worse, and there would be less code to maintain. Sure.

The reason why I went with this example was that I wanted you to see that something as tricky as race conditions between simultaneous jobs can be managed with proper planning. You might not always have this level of control over when an asynchronous job starts!

I was recently tasked with having key search results show immediately if they finish loading before some of the other results. The pattern used above works in a case like that. Something like `KeyResultsReady` is a valid option for `SearchState`, just as `AllResultsReady` is. Possible flows are then `Loading` -> `KeyResultsReady` -> `AllResultsReady` and `Loading` -> `AllResultsReady` (barring failures).

### Conclusion

Key benefits of using union types for modeling state are

- having to think about all logical possibilities
- naming the states (exhibits intention, works as documentation)
- absent values for data are not required anymore
- cleaner code when using data from the state

There are some tradeoffs. One has to write all the interfaces and helper functions. It takes some time to figure out decent names for different values. There's some learning curve involved.

I would say, though, that this kind of premeditation is useful. The general benefit of adding types is to avoid bugs and to verify that your code does what you think it does. This is why you probably are using Typescript anyway!

Thanks for reading.
