![XIVDB Tooltips](http://i.imgur.com/UxS5nVf.png)

# XIVDB Tooltips

The XIVDB tooltips script *(3.2kb JS / 1.8kb CSS)* allows you to load Final Fantasy XIV game content on your site, all data is obtained from XIVDB, hosted on a US Server.

## Examples:

- XIVDB: http://xivdb.com/dev/tooltips
- Codepen: http://codepen.io/viion/full/mVzYRQ/
- Codepen French: http://codepen.io/viion/full/VaZNbp/
- Codepen German: http://codepen.io/viion/full/gwjQXv/
- Codepen Japanese: http://codepen.io/viion/full/PGBxOR/

## Getting Started

- Embed the script: http://xivdb.com/tooltips.js anywhere in your code.
eg:

```html
<html>
    <head>
        ...
    </head>
    <body>
        ...
        <script src="http://xivdb.com/tooltips.js"></script>
    </body>
</html>
```

And that is all there is to it!

## Requirements

The tooltips require jQuery, if you do not have this on your site then the script will attempt to embed it for you, which should work.

## Tooltip Settings

### Javascript Global Settings

Here are the JavaScript global settings, each one lists its "default" state. Include this somewhere in your code **if you wish to change any of the options**. You don't need to include all of the options, just the ones you want to change.

```js
var xivdb_tooltips =
{
    // Where to get tooltips from.
    source: 'http://xivdb.com',

    // Language the tooltips should be in
    language: 'en',

    // Should tooltips attempt to replace the link?
    // if set to false: seturlname, seturlcolor and seturlicon will be skipped
    replace: true,

    // Should tooltips replace the name of the link?
    seturlname: true,

    // Should tooltips apply a rarity color? (eg: Relics set to Purple)
    seturlcolor: true,

    // If your site is white/bright, set this true
    seturlcolorDarken: true,

    // Should tooltips include an icon?
    seturlicon: true,

    // Should tooltips replace hidden links?
    includeHiddenLinks: false,

    // How long to wait until attempting to include jquery
    // if jquery still doesn't exist after this time, it will
    // be auto included
    jqueryCheckDelay: 500,

    // Minimum site width (pixels) to assume we're on a mobile,
    // tooltips should not be used on mobile sites.
    mobileMinimumWidth: 500,

    // Prevent this script from setting your sites html height to 100%
    // this helps with knowing mouse position.
    preventHtmlHeight: false,

    // How far the tooltip should be from the mouse
    tooltipDistanceX: 30,
    tooltipDistanceY: 30,

    //
    // EVENTS
    //

    // this is called once tooltips load, provides tooltip data,
    // eg: event_tooltipsLoaded: function(tooltips) { ... }
    event_tooltipsLoaded: null,
};
```

### Data attribute customisation

Sometimes you may want specific links to act differently than the global setting, here are some data attributes you can use in your `a` tags.

**Here is an example**
```html
<!-- Tooltip attached to .wrapper div -->
<div class="wrapper" data-xivdb-seturlicon="0">
    <a href="..." data-xivdb-parent=".wrapper">...</a>
</div>

<!-- single link, tooltip doesn't change anything visually -->
<a href="..." data-xivdb-replace="0">...</a>
```

**Options:**

- `data-xivdb-ignore="1"` ignore this link (no tooltips appear)
- `data-xivdb-replace="0"` does not replace the link with any name/color/icons.
- `data-xivdb-seturlname="0"` do not replace the link with the content name
- `data-xivdb-seturlcolor="0"` do not change the colour of the link to match rarity
- `data-xivdb-seturlicon="0"` do not add an game icon next to the link

## Advanced functionality

Here are a few Javascript funky stuff:

```js
//
// Need to call a function once the tooltips load?
//
var xivdb_tooltips.event_tooltipsLoaded = function() {
    console.log('Tooltips loaded!');
};
```

```js
//
// Does your site contain dynamic content that
// is loaded in later? (eg AJAX), force the
// tooltips to re-scan for links.
//
XIVDBTooltips.get()

//
// if your dynamically loaded content is heavy
// (eg: search results, lots of html) then you
// can call a delayed method, which will wait.
// A bit smoother.
//
XIVDBTooltips.getDelayed();
```

```js
//
// Need to remove the tooltips, eg: Clicking
// a link that loads in another page?
//
XIVDBTooltips.hide();
```

## Have any issues?

If you run into any issues, it is really easy to contact me, either:

- XIVDB Feedback: http://xivdb.com/feedback
- Discord: https://discord.gg/6XT7FTJ
