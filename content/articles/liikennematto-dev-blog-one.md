---
Title: Liikennematto dev blog #1: Prototyping traffic simulation with Elm
Date: 2020-04-20 00:00
Status: draft
Category: Journal
Tags: programming, games, gamedev, elm
Slug: liikennematto-dev-blog-one
Summary: I've been prototyping traffic simulation for a game in Elm. In this post I go through the development so far and demo the results.
Cover: covers/liikennematto-dev-blog-one.png
---

I've spent hundreds of hours playing Cities Skylines in the past few years. It's a superb city builder with a [rich community][cs subreddit]. You can rather easily design a 100k population city with decent traffic flow and variety of options for public transportation. Mods and custom assets improve the experience and provide even more ways to build your dream city.

I'm not aware of many city builders with a smaller scale. Sure you can design a village or a small town in Cities Skylines, but it's not an ideal solution. City builders tend to have complex mechanics and can get stressful. I found some results for a "village builder" in the App Store, but the games seem to be riddled with microtransaction and all look alike. There's [Banished] for PC, and apparently it's great, though the setting is medieval. There should be room for a different take on town building in a contemporary setting.

## Inspiration

Do you know those things called "traffic rugs" or "road carpets"? I loved those as a kid, and I've been playing on one with my sister-in-laws's kid recently. They have a rather small scale, but provide tons of fun (with some imagination). What if a game was build to match that scale?

!["Liikennematto" from Etola online store]({static}/images/liikennematto-dev-blog-one/liikennematto.jpg)

[Liikennematto] (Finnish for a "traffic mat/rug") is my attempt at building something like that. I've consciously set out to build the thing in phases and over a long period of time.

I don't know much about game development or simulation. The goal is to get something working as a prototype using familiar metaphors. Then I'll realistically build it again, possibly with a different language/platform and with a reasonable architecture. It would be terrific to some day have an iPad game that my own child can play (with).

Liikennematto should play like the real-life counterpart. You can have a small number of vehicles on a network of two-lane roads, with intersections, bridges, parking spaces and buildings. The vehicles roam around and make the environment lively. I'm not intending to include highways, four+-lane roads or anything that can support heavy traffic.

## First steps

I considered the Rust programming language and one [of the several 2D game libs available][coffee], but eventually chose [Elm] as the prototyping tool. I'm rather familiar with Elm and it's great for building interactive browser apps or games.

The only game I've built before is a Tetris clone in Elm. It's based on [tutorial videos] and uses `elm-graphics`, a lib that makes it easy to create, align, scale and rotate geometric shapes. Tetris is naturally a grid-based game with a "board" that the Tetronimos are overlaid on. The Liikennematto prototype uses the `elm-collage` lib to draw things, which is directly influenced by `elm-graphics`. I didn't use any gamedev related packages. The standard library gave me everything that I needed to write the logic.

The prototype works like a board game. Cars take turns to move on a 2D grid-based game board that has a network of blocky roads. Like in real-life board games, there are rules that cars have to follow: basic traffic rules. The cars have to acknowledge each other to avoid collisions.

The metaphor made it easy for me to get started. Car movement is naturally not smooth with this approach, but on the other hand it's easier to see what kind of decisions cars make. I kept the decision tree completely deterministic for a long time and any bugs were easy to reproduce. Cars eventually fell into repetitive patterns, following each other or driving back and forth on the same road.

Version 0.1. 'Tis ugly, but I was happy to see things moving.

<div id="shitty-version-demo"></div>

## Intersections, traffic lights, textures

Once cars were not crashing into each other, I worked on intersections. I implemented logic for intersections that use either signals (traffic lights), stop signs or yield rules. Signal intersections periodically cycle the traffic lights. They start from different points in the cycle on different traffic directions. Yielding is based on traffic that goes in the cross-direction of the car that approaches an intersection. Stop sign works like a yield sign, but cars skip a round - in terms of the board game. The logic is not that complicated and I did simplify things a bit, but now I had a working toy traffic simulation. This was probably the highlight of the development so far.

The SVG based presentation was ugly as a sin, so I applied some textures on the prototype. [Kenney] has a nice selection of free game assets. I used the "Road Textures" and "Racing Pack" collections. What a difference that made! The prototype now looked like something with a purpose, instead of a geometric accident.

Cars were logically moving on two-lane roads from the start, but it did not look like that. I was too lazy to draw lanes or align cars to them, but once the textures were in place it had to be done. I also had cars rotate when they were turning, to provide a visual cue.

## Randomness and debugging

Determinism was getting boring. I took some shortcuts with the logic of cars making turns. Using deterministic logic, cars made turning decisions based on the following priority:

1. "Can I go on? Am I in an intersection, is there a road in front of me?"
2. "Okay, I have to turn. Can I turn left?"
3. "Okay, I can't turn left. Can I turn right?"
4. "Shoot. I can't go on, guess I have to turn around."

In the random version possible directions are shuffled after each round. At the same time a metaphorical coin is tossed. True randomness often feels wrong, so the coin toss is weighed slightly (60/40). The coin toss determines if a car will turn, if turning is a valid move.

I initially chose to have all cars move on every tick/round and updated them at once. It wasn't viable after the change. Intersections especially became buggy and collisions happened. Two cars might make the same move and end up in the same "tile" in the grid. I gave cars true individual turns to guarantee that cars use the latest data on other cars to make decisions.

I don't know how familiar you are with Elm, but it comes with a pretty nice time-traveling debugger. Elm updates the game/app state based on events. You can use the debugger to browse previous states e.g. to see what cars did before they collided. The visuals update as you browse the states. I added some debugging tools of my own. You can see the state of each car and either pause the simulation or adjust simulation speed.

That's where Liikennematto is right now. I've used a couple of hours here and there over several months to develop it. Here's a demo:

<div id="latest-demo"></div>

Here's another version that has the time traveling debugger enabled (unoptimized). TODO

## Elm as a prototyping tool

It's been easy to get stuff done. During all of the development the project structure has followed the lines that [The Elm Architecture] suggests. Some modules don't have any state or visual presentation and are used just to organize code. The key modules like Game, Board and Tile define their state and update logic, as well as their views.

Elm development tools are nice too. Say you want to check out the code and run Liikennematto. If you have the Elm platform installed - which can be easily done via Homebrew, NPM and other means - just run `elm reactor` to build and run the project. If you make changes to the code, you can reload the page and get the results. If you mess something up, you'll be met with a clear error message instead. If you want to compile the project and ship it as a single HTML file, just run `elm make src/Main.elm`.

Building a game with a pure functional programming language felt rather easy. Immutable data structures, declarative logic and function composition are all helpful. The lack of side-effects makes it easy to track down bugs. I might have been able to find more optimal ways to iterate over the cars and other data in an imperative language, but at this scale it doesn't matter.

I used pattern matching and union types to model much of the logic. For instance, here's the `Tile` type:

```elm
type Tile
    = TwoLaneRoad RoadKind
    | Intersection IntersectionControl IntersectionShape
    | Terrain
    | Empty
```

And here it's used to figure out how to update a `Car`:

```elm
case nextTile of
    TwoLaneRoad _ ->
        if shouldTurnRandomly then
            changeDirection model.board model.randomDirections car

        else
            Car.update Move car

    Intersection (Signal trafficLights) _ ->
        if Tile.trafficLightsAllowEntry trafficLights car.direction then
            Car.update Move car

        else
            Car.update Wait car

    Intersection Yield _ ->
        applyYieldRules model.board nextCoords otherCars car

    Intersection Stop _ ->
        applyStopRules model.board nextCoords otherCars car

    _ ->
        changeDirection model.board model.randomDirections car
```

This pattern feels natural for me and I use it with other programming languages that support it, too. Elm enforces exhaustive pattern matching, so I had to take in account what really can happen in each case (no pun intended). That's a great way to spot mistakes in your logic.

The Elm ecosystem has some experimental game engines. It could be that using a game engine would have made all this much easier. I wanted to understand what kind of problem I'm dealing with before introducing complexity that any engine brings, though.

My naive implementation of the game rendering and `elm-collage` usage did cause some performance issues! With a 8x8 board things are fine. Even a 16x16 grid times two/three (the board, overlaid cars and other elements like the traffic lights) results in a large number of SVG elements. It seems like `elm-collage` uses CSS transforms for alignment even if nothing is aligned, too. Obviously with a `canvas` and WebGL one can achieve better performance. That being said, it's nice to be able to demo Liikennematto on the web, right here in this article.

## Next steps

Liikennematto is not much of a game right now. I want to add a map editor where one can design the road layout and add intersections of any type where applicable. A wise game developer might have built that early on. I just created an ideal road layout manually in the code (here ideal means one that uses all of the features but avoids showing the effects of shortcuts that I took).

I also want to give the "player" a chance to place buildings on the board. Cars (or the drivers?) could have a home building and occasionally park themselves there. The board should be a bit larger than now to allow more cars and buildings.

Right now stop and yield signs are only effective on the horizontal axis. That should be fixed.

## Conclusion

I reckon that I would have completely different results if I went down the path of realism - road network as a graph, cars not aligned to the grid but with more precise coordinates and velocity instead. A real game engine. That's probably gonna happen down the line. The playful board game approach should carry the development until I truly understand what kind of problem I'm dealing with. I've learned a lot so far.

I hope to make progress during the summer and post another dev blog after. See you next time!

---

"Liikennematto" image is from [Etola online store]. I don't have an explicit permission to use the image. Etola folks, please don't sue me.

[liikennematto]: https://github.com/klemola/liikennematto
[elm]: https://elm-lang.org/
[cs subreddit]: https://www.reddit.com/r/CitiesSkylines/
[banished]: http://www.shiningrocksoftware.com/game/
[coffee]: https://crates.io/crates/coffee
[kenney]: https://kenney.nl/assets
[etola online store]: https://www.etola.net/Tuote/lasten_maailma/ajoneuvo__ja_rakennuslelut/liikennematto
[tutorial videos]: https://www.youtube.com/watch?v=GMSXYnMH1gg
[the elm architecture]: https://guide.elm-lang.org/architecture/