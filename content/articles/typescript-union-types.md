---
Title: Union types in Typescript: get rid of complex boolean logic
Date: 2019-05-01 00:00
Category: Articles
Tags: typescript, advanced-types
Slug: typescript-union-types
Summary: Get familiar with union types in Typescript with practical examples. Your colleagues will thank you later.
Audience: Folks who are somewhat familiar with Typescript, and willing to learn about advanced types. I use some patterns analogous to React, so it helps if you've seen React code before.
---

In my time of being a professional software developer I've seen people tripping up on logic involving multiple boolean values. It has happened to me too! Dynamic languages (eg. JavaScript) offer limited choices for modeling multiple outcomes. One could use weak enums (bunch of possible string values in a list), but it's still possible to use invalid values via typos. If that wasn't enough, inline boolean values are not named and might not communicate intention clearly. Now that Typescript is gaining traction, I'd like to show you how I've modeled multiple logical outcomes using union types.

## Example: Fetching data

Most common example of multi-boolean logic that I have observed is related to fetching remote data, often inside a React component's lifecycle methods. It's ideal to show some kind of temporary view while data is on it's way (eg. a spinner), at least if it's likely that getting said data will take a while.

In the example below you'll find a combination of an asynchronous operation in `main` and intermediate loading state in `render`. The example is written in a way that is typical for many front-end codebases. Take a moment to consider the logic. We'll improve on this example afterwards.

{% include_code typescript-union-types/fetch_with_booleans.ts lang:typescript %}

### Introducing union types

You might have noticed that we are dealing with multiple possible combinations of booleans and data that might be absent (`null`). Even with just two variables, `isLoading`and `data`, we have four possible combinations. Rendering logic is definitely missing some of the possible combinations. Logical outcome for output is to render

- Nothing (implicitly - there's no `else` condition)
- A loading message
- User data (once it's present)
- An error message

Ignoring the first option for now, let's model these possible outcomes in an union type.

{% include_code typescript-union-types/fetch_with_union_types.ts lang:typescript lines:6-17 %}

Now we have solid names for different outcomes. They should explain what we _want_ to model. We also have extra information associated with `Success` and `Failure` types, and that will be useful later.

Notice that we have a `type` attribute in all of the type definitions. `Data` is a [tagged union](https://en.wikipedia.org/wiki/Tagged_union), also known as a discriminated union. We need some kind of way to tell different options apart (a tag or discriminator), and in Typescript that can be achieved by using literal string values as types. You might have seen this pattern already if you have written actions in `redux`.

How does this help? See another example below:

{% include_code typescript-union-types/fetch_with_union_types.ts lang:typescript lines:19-42 %}

Nice, right? Creating `Data` values is not terribly ergonomic, but look at `render`! It's super clean compared to the first example. Furthermore, Typescript knows exactly what type we are dealing with once we have determined the current value of `Data` using a `switch` statement. That's why we don't have to test for presence of the data anymore. This only gets better and better if there's more than one piece of data that we want to retrieve. `render` now always returns something meaningful.

But wait! There's still room for improvement...

### RemoteData

One of the nicest abstractions I've come across is `RemoteData`. I encountered it while working on a semi-large Elm project. Our `Data` type is already pretty close to how `RemoteData` [is defined](https://package.elm-lang.org/packages/krisajenkins/remotedata/latest/RemoteData) (hats off to Kris Jenkins!).

`RemoteData` includes a `NotAsked` variant. It's realistic, since unless a fetch is started immediately upon application initialization, data is not loading. If data is fetched immediately when a component is mounted, one can safely start from `Loading`, like we did before. I've been including a Typescript version of the library in recent work projects, because I don't want to model fetching data in any other way anymore. Here it is:

{% include_code typescript-union-types/RemoteData.ts lang:typescript lines:1-19 %}

The type is defined using [generics](https://www.typescriptlang.org/docs/handbook/generics.html), since who knows what kind of data someone is fetching, and what exactly can go wrong? Let's apply `RemoteData` to the example code.

{% include_code typescript-union-types/fetch_with_remotedata.ts lang:typescript lines:1-34 %}

It's not very different to what we had before, but now all realistic outcomes are modeled. You might have also noticed that I've included some values and helper functions that make it easy to create `RemoteData` instances.

{% include_code typescript-union-types/RemoteData.ts lang:typescript lines:21-31 %}

It's probable that you still need to test which variant of `RemoteData` is present (eg. you might only care if a value is `Success`), and that can be done easily using some helpers. Using `switch` is not mandatory!

{% include_code typescript-union-types/RemoteData.ts lang:typescript lines:32-54 %}
