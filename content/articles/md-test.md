---
Title: Markdown test
Date: 2019-04-12 00:00
Modified: 2019-04-22 00:00
Category: Articles
Status: draft
Tags: test, pelican
Slug: markdown-test
Summary: This article demonstrates some of what Markdown is capable of doing.
---

## Basic formatting

Paragraphs can be written like so. A paragraph is the basic block of Markdown. A paragraph is what text will turn into when there is no reason it should become anything else.

Paragraphs must be separated by a blank line. Basic formatting of _italics_ and **bold** is supported. This _can be **nested** like_ so.

## Lists

### Ordered list

1. Item 1
2. A second item
3. Number 3
4. Ⅳ

_Note: the fourth item uses the Unicode character for [Roman numeral four][2]._

### Unordered list

-   An item
-   Another item
-   Yet another item
-   And there's more...

## Tables

Here's a table:

| Tables   |              Are               |     Cool | Extra column | Another extra |
| -------- | :----------------------------: | -------: | ------------ | ------------- |
| col 1 is |          left-aligned          |   \$1600 | Some         | Foo           |
| col 2 is |            centered            |     \$12 | Stuff        | Bar           |
| col 3 is |         right-aligned          |      \$1 | Here         | Baz           |
| text     | something that is a bit longer | 1000000€ | more text    | null          |

## Paragraph modifiers

### Code block

Some code:

```python
def calculate_readtime(content_object):
    if content_object._content is not None:
        content = content_object._content  # get the content html from Pelican

        text = strip_tags(content)  # strip tags and get long sentence
        # split the long sentence into list of words
        words = re.split(r'[^0-9A-Za-z]+', text)

        num_words = len(words)  	# count the words
        minutes = int(math.ceil(num_words / WPM))  # calculate the minutes

        # set minimum read time to 1 minutes.
        if minutes == 0:
            minutes = 1

        content_object.readtime = {
            "minutes": minutes,
        }
```

```typescript
type Config = {
    onSuccess?: (registration: ServiceWorkerRegistration) => void
    onUpdate?: (registration: ServiceWorkerRegistration) => void
}

export function register(config?: Config) {
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
        // The URL constructor is available in all browsers that support SW.
        const publicUrl = new URL(
            (process as { env: { [key: string]: string } }).env.PUBLIC_URL,
            window.location.href
        )
        if (publicUrl.origin !== window.location.origin) {
            // Our service worker won't work if PUBLIC_URL is on a different origin
            // from what our page is served on. This might happen if a CDN is used to
            // serve assets; see https://github.com/facebook/create-react-app/issues/2374
            return
        }

        window.addEventListener('load', () => {
            const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`

            if (isLocalhost) {
                // This is running on localhost. Let's check if a service worker still exists or not.
                checkValidServiceWorker(swUrl, config)

                // Add some additional logging to localhost, pointing developers to the
                // service worker/PWA documentation.
                navigator.serviceWorker.ready.then(() => {
                    console.log(
                        'This web app is being served cache-first by a service ' +
                            'worker. To learn more, visit http://bit.ly/CRA-PWA'
                    )
                })
            } else {
                // Is not localhost. Just register service worker
                registerValidSW(swUrl, config)
            }
        })
    }
}
```

```elm
updateEnvironment : Board -> Board
updateEnvironment board =
    -- Room for improvement: consider moving traffic light state from tiles to SharedState
    -- in order to make Tiles passive
    let
        updateTrafficLight tl =
            if tl.timeRemaining == 0 then
                TrafficLight.new (TrafficLight.advanceLight tl.kind) tl.facing

            else
                TrafficLight.advanceTimer tl

        updateTile tile =
            case tile of
                Intersection (Signal trafficLights) shape ->
                    let
                        next =
                            trafficLights
                                |> List.map updateTrafficLight
                                |> Signal
                    in
                    Intersection next shape

                _ ->
                    tile
    in
    Dict.map (\_ tile -> updateTile tile) board
```

```rust
#[macro_use]
extern crate prettytable;

mod cli;
mod machine_status;
mod models;
mod watch;

use clap::ArgMatches;
use cli::get_matches;
use machine_status::{get_client, list_and_handle_result, save_and_handle_result};
use std::error::Error;

fn main() -> Result<(), Box<Error>> {
    let table_name = String::from("machine-status");
    let client = get_client();
    let matches = get_matches();

    let status_command = |sub_matches: &ArgMatches| match sub_matches.subcommand_name() {
        Some("list") => list_and_handle_result(&client, &table_name),

        Some("save") => save_and_handle_result(&client, &table_name),

        _ => println!("{:}", sub_matches.usage()),
    };

    match matches.subcommand() {
        ("watch", _) => watch::start(&client, &table_name),

        ("status", Some(sub_matches)) => {
            status_command(&sub_matches);
            Ok(())
        }

        _ => {
            println!("{:}", matches.usage());
            Ok(())
        }
    }
}
```

You can also make `inline code` to add code into other things.

### Quote

> Here is a quote. What this is should be self explanatory. Quotes are automatically indented when they are used.

## Headings

There are six levels of headings. They correspond with the six levels of HTML headings. You've probably noticed them already in the page. Each level down uses one more hash character.

### Headings _can_ also contain **formatting**

### They can even contain `inline code`

Of course, demonstrating what headings look like messes up the structure of the page.

I don't recommend using more than three or four levels of headings here, because, when you're smallest heading isn't too small, and you're largest heading isn't too big, and you want each size up to look noticeably larger and more important, there there are only so many sizes that you can use.

## URLs

URLs can be made in a handful of ways:

-   A named link to [MarkItDown][3]. The easiest way to do these is to select what you want to make a link and hit `Ctrl+L`.
-   Another named link to [MarkItDown](http://www.markitdown.net/)
-   Sometimes you just want a URL like <http://www.markitdown.net/>.

## Horizontal rule

A horizontal rule is a line that goes across the middle of the page.

---

It's sometimes handy for breaking things up.

## Images

Markdown can also contain images.

<div class="article-content__image">
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Skeletons_dancing._Etching_by_R._Stamper_after_C._Sharp._Wellcome_V0042216.jpg/ 1280px-Skeletons_dancing._Etching_by_R._Stamper_after_C._Sharp._Wellcome_V0042216.jpg" alt="Example image"/>
</div>

## Finally

There's actually a lot more to Markdown than this. See the official [introduction][4] and [syntax][5] for more information. However, be aware that this is not using the official implementation, and this might work subtly differently in some of the little things.

[1]: http://daringfireball.net/projects/markdown/
[2]: http://www.fileformat.info/info/unicode/char/2163/index.htm
[3]: http://www.markitdown.net/
[4]: http://daringfireball.net/projects/markdown/basics
[5]: http://daringfireball.net/projects/markdown/syntax
