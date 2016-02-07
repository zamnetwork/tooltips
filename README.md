# XIVDB Tooltips

XIVDB tooltips are still very fresh and in development. There may be issues on your site, I am working with developers to get all kinks sorted out :) I hugely recommend using the tooltip code hosted at XIVDB rather than downloading it as it will help keeping the code up to date a lot easier, for everyone!

## Examples:

- All content types: http://xivdb.com/dev/tooltips/embed/example
- Set to German: http://xivdb.com/dev/tooltips/embed/language
- Full screen test: http://xivdb.com/dev/tooltips/embed/fullscreen
- Codepen example: http://codepen.io/viion/full/mVzYRQ/


## Issues:

- Old XIVDB links may not convert properly.
- Icons don't show properly for: Leves, Placenames, Shops, NPCs, Enemy, titles and some quests


## Embeds
- You can find the XIVDB tooltips code at: `http://xivdb.com/tooltips.min.js`
- If you have any issues, please use the non minified one to debug: `http://xivdb.com/tooltips.js`

## Tooltip Settings

### Javascript Global Settings

Here are the Javascript global settings, each one lists its "default" state. Include this somewhere
in your code if you wish to change any of the options. You don't need to include all options, just
the ones you want to change.

```js
var xivdb_tooltips =
{
    // the XIVDB server to query (this will be https soon)
    xivdb: 'http://xivdb.com',

    // the language the tooltips should be
    language: 'en',

    // tooltips require JQuery and "check" it, this can add a half a second delay
    // if you have jquery already on your site, set this false
    jqueryEmbed: true,

    // tooltips use font awesome, similiar to jquery it will add it if it does not exist
    // if you already have font awesome on your site, set this false
    fontAwsomeEmbed: true,

    // whether the name of links should be replaced, for example:
    // http://xivdb.com/item/12122/Curtana+Nexus+Replica > "Curtana Nexus Replicate"
    seturlname: true,

    // whether the name of links should be colored based on rarity, for example:
    // Curtana Nexus Replicate is a Purple item and would color: `#ba68c8`
    seturlcolor: true,

    // if your site is dark, then set this true and rarity colors will
    // be a bit ligher and more readable
    seturlcolorDarken: true,

    // whether to include the content icon next to the link
    seturlicon: true,

    // the size of the content icon to use.
    iconSize: 20,

    // if the content icones should be circular
    iconCircle: true,

    // (depreciated) if the tooltip should be fixed and not follow mouse
    tooltipFixed: false,
    tooltipFixedBottom: false,

    // (depreciated) if links should always open in a new tab
    targetBlank: true,

    // whether to also parse hidden links (not visible on the DOM)
    // if you have a lot of hidden links, please consider setting this false
    // and instead calling XIVDBTooltips.get() when you make them visible.
    includeHiddenLinks: true,

    // whether to include "xivdb.com" credit on tooltips, if you don't like it
    // remove it :) i dont mind.
    includeCredits: true,

    // whether to include the shadow on tooltips.
    includeFrameShadow: false,

    // whether to include local links, normally you'd have this
    // false... unless you're working on XIVDB!
    includeLocalLinks: false,

    // by default the tooltips set a 100% height on the <html> tag
    // so that absolute positions are correct, you can disable
    // this if you'd like
    preventHtmlHeight: false,

    // the container tooltips should position relative to
    container: window,

    // if you only want links within a specific div to convert, enter it here.
    linkContainer: 'body',

    // (depreciated) - Parent for tooltip, instead use the data attribute: data-xivdb-parent=".someclass"
    parentTooltipAttribute: 'data-xivdb',
    parentTooltip: true,

    // (disabled) an element to "watch" and if any DOM changes occur, it will trigger
    // an Tooltip call. This is not enabled right now.
    watch: '.search-content',
    watchDelay: 750,

    // Tooltips can't really load on mobile, so they're disabled, if you
    // would like to enable them, set this true to stop ignoring mobile.
    mobileIgnore: false,
    mobileWidth: 720,

    // If you want to call some function once tooltips have loaded, you can
    // assign a function to call here.
    event_tooltipsLoaded: null
};
```

### Data Attributes

XIVDB injects into the attribute: `data-xivdb-tooltip`, and will also attach an `data-xivdb-key` attribute to identify links specifically. So don't manually use this, for some reason :O they will be overwritten.

Sometimes, you want specific links to act differently than the global setting, here are some data attributes you can use in your `a` tags.

**Ignore tooltips on a specific link**
```html
<a href="..." data-xivdb-ignore="1">
```

**Attach tooltip to a parent element**
```html
<div class="wrapper">
    <a href="..." data-xivdb-parent=".wrapper">
</div>
```

**Enable/Disable: injecting of the content name**
```html
<a href="..." data-xivdb-seturlname="0">
```

**Enable/Disable: changing link color to match the content rarity**
```html
<a href="..." data-xivdb-seturlcolor="0">
```

**Enable/Disable: adding an icon to the url**
```html
<a href="..." data-xivdb-seturlicon="0">
```







