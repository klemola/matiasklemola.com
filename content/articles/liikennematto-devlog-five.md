---
Title: Liikennematto devlog #5: renovation and release
Date: 2024-05-15 00:00
Status: published
Category: Journal
Tags: programming, gamedev, elm, liikennematto
Slug: liikennematto-devlog-five
Summary: A wrap-up of several years of development and the alpha release of Liikennematto.
Cover: covers/liikennematto-devlog-five.png
---

!!! note "Liikennematto devlog series"

    1.  [Prototyping traffic simulation with Elm][devlog-one]
    2.  [Build your own roundabout!][devlog-two]
    3.  [Lots to do][devlog-three]
    4.  [Hello real-time traffic simulation][devlog-four]
    5.  Renovation and release _(this post)_

> Liikennematto is a tiny simulation game for children and grown-ups alike. The gameplay is simple: you only build the roads! Lots, buildings and their residents pop up after.

I used to keep a somewhat regular devlog for Liikennematto. The previous entries appeared 6-12 months apart, but since July 2021 the devlog has been on pause. I didn't stop working on the game, though (in fact the time I could have spent writing devlogs went to development instead). This belated entry then sums up nearly 3 years of development!

Last time I described Liikennematto's transformation to a real-time traffic simulation. Here's where I left you.

<figure>
    <video controls autoplay muted loop playsinline>
        <source src="{static}/videos/liikennematto/realtime_busy_intersection.mp4" type="video/mp4">
    </video>
    <figcaption>Liikennematto circa mid-2021</figcaption>
</figure>

## New visuals and sounds

I prototyped Liikennematto using premade assets from [Kenney] and some crude lot placeholders of my own. In 2022 I completely overhauled the assets. I spent a lot of time on selecting a bright and lively palette that works with the children's traffic mat metaphor.

Inspired by the traffic mat art style, I've drawn buildings and objects in various perspectives. Some of them are fake 3D and some are just flat sprites. The cars and roads follow a top-down perspective for simplicity's sake.

The trees, flowers and other organic objects are hand-drawn and traced to vector format. Buildings, roads and cars are digital vector drawings. I like the contrast between geometric man-made structures and the free-flowing nature.

I started with some obvious lots (school, café, fire station, low and high density residential). I intend to keep the lots unique, so that they only appear once. Car models and decorations re-appear in various colors.

<figure>
    <video class="video--small" controls autoplay muted loop playsinline>
        <source src="{static}/videos/liikennematto/gameplay_2024.mp4" type="video/mp4">
    </video>
    <figcaption>Liikennematto gameplay in 2024</figcaption>
</figure>

I've used Figma as the vector drawing tool. Game asset creation is not really what Figma is usually used for, but I'm familiar with the app from work and it gets the job done. The biggest drawback is a lack of a gamedev-specific asset pipeline. I have a manual process where I adjust the SVG content to work with the game. With a low amount of assets it works, despite the labor. Maybe I'll automate the process later.

I also added some sound effects. For instance, placing a road tile triggers a sound that reinforces the action. A bit later a slightly higher pitched version of the sound plays when the road has been built. Both sounds are synced with the animation. Sound effects have a playful marimba-like timbre that complements the visuals. I've created the sounds using Ableton Live. I intend to add some light music to the game later.

## UI overhaul

Liikennematto doesn't need much of an UI for the core gameplay in terms of panels and widgets. Most of the UI consists of debug tools and controls for starting a new game. The previous placeholder UI with emoji icons is gone. I've drawn custom icons for the UI and added a zoom control with three levels. The UI follows the palette of the game graphics.

I spent a good while making Liikennematto fun to play on touch devices and various screen sizes. You can now effortlessly pan and zoom around the tilemap. You can build roads with a click or tap, and remove them with a right-click or long press. The latter wasn't trivial to get right, as there's a fine line between swiping and tapping the screen. The action is triggered after a small delay and is visualized with a progress bar. Once the progress bar is full, releasing the long press will remove the road tile.

<div class="widget-container--static">
    <iframe class="widget-container__widget" title="vimeo-player" src="https://player.vimeo.com/video/770462933?h=66b9203b72" width="320" height="569" frameborder="0" allowfullscreen></iframe>
</div>

## Parking

Possibly the biggest new feature since 2021 is the fully-featured parking system. Lots come with parking areas that have one or more parking spots. For each spot, I've defined a path to the lot entrance using a "parking lane" that influences the curve of the path. The paths vary a lot, since parking areas have different sizes and orientations. This path connects to the road network graph, where the car's route truly begins.

I didn't want the lots to be huge and neither are the parking areas. With the limited space, only one car may (un)park at a time. The lots have a parking lock that enforces the rule. While a car is moving in the parking area, the lock remains. Any other car willing to unpark or enter the lot will have to wait for their turn. Parking in the tiny areas is pretty fast, so the queue doesn't grow too long.

Some parking spots are reserved for the lot residents, or because of the role of a vehicle (a spot for a fire truck at a fire station). The residents prefer these spots, leaving free spots for guests.

Getting all of this to work was satisfying. I built new debug tools to visualize the state of the parking area, which was time well spent, because it revealed subtle bugs in the system.

<figure>
    <video class="video--small" controls autoplay muted loop playsinline>
        <source src="{static}/videos/liikennematto/parking_2024.mp4" type="video/mp4">
    </video>
    <figcaption>Parking in action, with the parking debug overlay</figcaption>
</figure>

## A\* pathfinding

Liikennematto has a road network graph built from the road tiles. The graph is used for routing cars around the map. The original routing algorithm simply started from a point in the graph (like an intersection entry) and navigated the graph using random directions from nodes until the route was long enough. This resulted in completely random routes with no sensible goal.

Now the routes are generated with the standard [A\* pathfinding algorithm][astar], which finds a short path from a graph node to another node using distance to the goal as a heuristic. I looked up an example of the algorithm in Python and manually translated it into functional Elm code. With the small maps of Liikennematto, my optimised Elm implementation of the A\* is capable of creating ~18 000 routes per second on an average machine using just one thread. That's fast enough to allow dynamic rerouting of cars on tilemap change. For example, a car that is waiting for a green traffic light may turn into a different direction from the intersection that it was about to just milliseconds before! It's fun to watch the routes adjust to the updated tilemap.

The most common route is from one lot to another lot. Sometimes the cars choose to just enjoy a short drive with no destination.

## Game architecture and data flow

The Liikennematto codebase has grown over time. When I started out, I didn't have a clear plan for the game architecture. Now that I can see what the main parts are, I've refactored the Elm modules into four namespaces; `Tilemap`, `Simulation`, `Render` and `UI`.

This follows the way things build on top of each other:

-   the tilemap is the base that the simulation runs on
-   the simulation works with the road network graph, and listens to tilemap changes to (re)build it
-   the tilemap and simulated entities, like cars, are then rendered separately
-   on top of all of that, the UI triggers tilemap changes and enables debug tools

With this separation of concerns the code modules found their natural place. The namespaces interact via two interfaces: the Elm event loop and the `World` module, which contains the game state. `Render` and `UI` only read from the `World` interface, while `Simulation` and `Tilemap` may update it as well.

![Liikennematto game architecture. Grey blue denotes interface, bright blue denotes namescape]({static}/images/liikennematto-devlog-five/liikennematto_architecture_2024.png)

The data flow inside the tilemap and simulation layers has changed as well. There's a lot of state to keep track of, and entities go through various state changes. Updates to the tilemap and entities have side-effects (sounds, re/despawn, rebuilding of lookup data structures, etc.).

The Elm Architecture and its event based updates help to some extent, yet I've implemented a custom event queue for fine-grained control of the data flow. The simulation and tilemap update process accumulate events that are then flushed once per frame to change things instantly (for later steps in the update flow), or scheduled for later.

Some examples of delayed events include cars spawning on lots and updates to car paths when the road network changes. The delay is also used to spread events over time to add some randomness to the simulation. Sometimes an event cannot be processed with the current state of the simulation. The custom event queue allows retry and if enough retries fail, the event may be discarded and a recovery strategy might then despawn related entities.

I also built a finite state machine (FSM) library to formally specify how cars, traffic lights, tiles and even the game initialization phase transition from a state to another. I included some ideas from [AI for Games, Third Edition][ai-for-games], notably entry and exit actions for a state. FSMs are the backbone of many programs and games, because of their utility. Without FSM states and transitions are hidden, often accidental. Having a clear spec for these removes a whole class of potential bugs. In Liikennematto they also help to sync animations and sounds to key actions.

## Itch.io release

In November 2022 most of the changes were in place. Considering the small scope of the game, core features work well and what's missing is content. I decided then that it's time to release the game to early access. [itch.io][lm-itch] felt like a good place for that. Many fledging game developers use itch.io to preview and ship their games. itch.io is especially nice for games that can be played in a browser, like Liikennematto.

The release was a tiny success. In the first few months the game was played over 500 times and many itch.io users added the game to their collections. I also received positive feedback from the users.

In March 2023 I released a patch that added some variety to the content and improved the simulation. Around that time I also composed a review of the first three years of Liikennematto development in the form of the video below.

<div class="widget-container--static">
    <iframe class="widget-container__widget" title="vimeo-player" src="https://player.vimeo.com/video/805519521?h=41a03c8e32" width="640" height="360" frameborder="0" allowfullscreen></iframe>
</div>

## The future

Since early 2023 the development has slowed down quite a bit.

The last 12 months have been tough for me. Work became very stressful and I eventually changed jobs, for the better. In late 2023 I lost a friend to cancer, and recently another to a rare disease. I've been exhausted and I have grieved.

Hobby game development has offered me a way to channel my creative impulses to and escape from the negative aspects of daily life. Now I often have the time but not the energy for it. Our family is also about to grow, which itself is a wonderful thing, but the time for hobbies might become scarce. For this reason updates to Liikennematto have no timeline. Whatever time it may take, I still want to keep on developing Liikennematto to fulfill the vision that I have.

...

The next item on the roadmap is improved procedural generation of the lots and decorations. Despite slow and interrupted development, I've made some progress in implementing wave function collapse (WFC), a popular algorithm that fills a (portion of a) map with shapes that conform to constraints. With a tilemap-based game like Liikennematto, this means that each tile has multiple options (superposition) that might fit. When a tile option is picked (collapsed), the neighbor tiles' options are reduced to the point that the map resolves itself after several steps. WFC is often compared to sudoku, which has a similar solving process.

I've implemented complete map generation with multi-tile shapes and error handling. I'm now in the process of integrating WFC into the gameplay to achieve "driven WFC" - the player's decisions (road placement) drive the generation. This is quite a bit harder than generating maps without the player's input. Let's see how it goes - and how long it takes.

Here's a peek into WFC for Liikennematto:

<div class="widget-container--static">
    <iframe class="widget-container__widget" title="vimeo-player" src="https://player.vimeo.com/video/910696880?h=7a3cf1ed17" width="640" height="360" frameborder="0" allowfullscreen></iframe>
</div>

In the meantime, you can play the most recent version of Liikennematto over at [itch.io][lm-itch].

Next development updates and release announcements will be released on itch.io, marking this as the last devlog on this site. You can follow me on [Mastodon] for updates inbetween.

[Liikennematto Github repository][liikennematto]

[kenney]: https://kenney.nl/assets
[lm-itch]: https://yourmagicisworking.itch.io/liikennematto
[ai-for-games]: https://www.routledge.com/AI-for-Games-Third-Edition/Millington/p/book/9780367670566#
[astar]: https://www.redblobgames.com/pathfinding/a-star/introduction.html
[mastodon]: https://mastodon.gamedev.place/@yourmagicisworking
[liikennematto]: https://github.com/klemola/liikennematto
[devlog-one]: /liikennematto-dev-blog-one
[devlog-two]: /liikennematto-devlog-two
[devlog-three]: /liikennematto-devlog-three
[devlog-four]: /liikennematto-devlog-four
