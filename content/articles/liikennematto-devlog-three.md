---
Title: Liikennematto devlog #3: lots to do
Date: 2021-03-16 00:00
Status: published
Category: Journal
Tags: programming, gamedev, elm, liikennematto
Slug: liikennematto-devlog-three
Summary: Liikennematto now comes with lots and buildings. Big changes ahead!
Cover: covers/liikennematto-devlog-three.png
---

!!! note "Liikennematto devlog series"

    1.  [Prototyping traffic simulation with Elm][devlog-one]
    2.  [Build your own roundabout!][devlog-two]
    3.  Lots to do _(this post)_

Howdy! Welcome to the third Liikennematto devlog. It's been more than six months since the last one. I went back to work from paternity leave right after posting it, and life's been busy ever since. Between work and family life, I've had a couple of hours per week to work on Liikennematto.

_Recap:_ Liikennematto is a tiny traffic simulation inspired by kids' traffic mats. It's written in the Elm programming language. So far it has basic traffic rules and a map editor.

This devlog covers one of the two new major features: **lots, as in foundation for buildings**. The other feature, gradual car movement, has changed almost everything in the prototype. It's nearing completion, and definitely deserves a separate entry in the devlog when it's done.

---

A traffic mat is not very fun without buildings. In Cities Skylines and many other city builders the player draws residential, industrial and commercial areas next to roads. The areas are then filled by random buildings. The buildings are drawn from a limited pool, and neighborhoods often look alike due to repeated building models. "Unique buildings" in these games are something like the Eiffel Tower. I've wanted to have truly unique buildings in Liikennematto from the very start.

The buildings should come with a resident or a purpose. Two residential buildings should look different and be a home for specific citizens and their cars. Commercial buildings, such as a restaurant, might have a delivery car. That's my vision.

![Here's the first lots sketch from last summer]({static}/images/liikennematto-devlog-three/lots_sketch.jpg)

Buildings have to be placed on something. Lots provide an area for one or more buildings to build on. Lots come in different sizes, and the size is based on cells. One cell has an equal area to a road tile. The width and height of a lot don't have to match.

Adding new buildings tooling to the map editor was my original goal. After some time, though, I felt placing individual buildings would be quite tedious. It would be great if the player could focus on building the road network and setting traffic rules, while lots and their buildings would be procedurally placed next to the roads. This way the world comes alive on it's own. This is emphasized by a major change — each car on the traffic mat originates from a lot. Without lots there's no traffic.

![Placeholder graphics in Figma. Each residential building is color-coded by the resident's car. Some larger lots included]({static}/images/liikennematto-devlog-three/lots_placeholder.png)

Whether a lot is placed procedurally or by the player, it's crucial to check if a location works with the size and orientation of a lot. Each lot has an entry point in one of the surrounding cells. I call this cell the _anchor_ of a lot. Given the lot anchor, entry direction and dimensions, the simulation is left with enough information to verify certain cell(s) have space for the lot.

The cell inside the lot right next to the anchor doubles as a driveway. This cell (and possibly the neighbors) are compared against other lots and the road network, to see if there are conflicts. If the check fails, the lot construction is cancelled and reattempted with a different anchor.

Lots and their residents are removed if the player builds a road right through them. The map editor highlights this destructive intent, so it shouldn't come as a surprise.

The lots are generated on an interval. They're randomly drawn from a list of unique lots. I started with a fixed interval, but that felt quite flat. Variable intervals to the rescue! This was maybe the most curious part code-wise. Given that Liikennematto is programmed in Elm, which is a pure functional language, randomness in a side-effect (delay) means double side-effect. First a random integer `randomMillis` is generated, and then used to delay execution by sleeping `randomMillis` milliseconds. Here's the side-effect combo:

```elm
prepareGenerationAfterRandomDelay : Cmd Msg
prepareGenerationAfterRandomDelay =
    let
        randomMillis =
            Random.int 1000 3500
    in
    Time.now
        |> Task.map
            (Time.posixToMillis
                >> Random.initialSeed
                >> Random.step randomMillis
                >> Tuple.first
            )
        |> Task.andThen (toFloat >> Process.sleep)
        |> Task.perform PrepareGeneration
```

Why not just use `Random.generate` to get a random `Int`, you say? Sadly it's a `Cmd` (_a complete request for the Elm runtime to do something dirty_) instead of a `Task` (_a side-effect description that may become a `Cmd`_), so it can't be chained with `Process.sleep`. The `Random.step` function can be used in a static way to generate random values throughout an Elm application. Otherwise random generation uses entropy, which triggers a side-effect. Using static random generation, the other side-effect is the way a seed is acquired: asking for a timestamp.

Putting all of this together, here's the procedural generation in action:

<figure>
    <video autoplay muted loop playsinline>
        <source src="https://giant.gfycat.com/AdmiredHarmlessArrowcrab.mp4" type="video/mp4">
    </video>
    <figcaption>Lots popping up all around the map</figcaption>
</figure>

> You can try this version yourself: [demo]

## Reflection

Lots certainly bring life to Liikennematto. This is the groundwork for the big plans I have, and there's a lot of work left. Liikennematto needs plenty of different building types that you usually find in a traffic mat: a police station, restaurant, hospital, gas station (or car wash), and so on.

Currently the buildings are tied to their lot, both logically and visually. They could be separated, so that lots can be created as construction sites. I would like to animate buildings when they are constructed, too. I will eventually replace the current dummy graphics with something better. Last but not least, I'd like to add decorations such as trees into empty cells (once enough buildings have been constructed).

It's early to say whether procedural generation of lots is a better choice than giving the player the tooling to place lots manually. Time will tell.

Work on lots was interrupted by the effort to make cars move around gradually. The change breaks the core idea of everything happening on the scale of cells. I'll tell you all about it on the next devlog. Got a little teaser for ya!

<figure>
    <video autoplay muted loop playsinline>
        <source src="https://giant.gfycat.com/EvergreenFrequentFirecrest.mp4" type="video/mp4">
    </video>
    <figcaption>Can you spot the difference?</figcaption>
</figure>

Until the next time!

---

[Check out my tweets] to see what's coming next.

[Liikennematto Github repository][liikennematto]

[check out my tweets]: https://twitter.com/MatiasKlemola
[liikennematto]: https://github.com/klemola/liikennematto
[devlog-one]: /liikennematto-dev-blog-one
[devlog-two]: /liikennematto-devlog-two
[demo]: http://apps.butsku.com/liikennematto/
