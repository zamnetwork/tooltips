let xivdb_tooltips_default =
{
    //
    // Settings
    //

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
}

let xivdb_tooltips_valid_types = [
    'item', 'achievement', 'action', 'gathering', 'instance', 'leve',
    'enemy', 'emote', 'placename', 'status', 'title', 'recipe',
    'quest', 'shop', 'npc', 'minion', 'mount', 'weather', 'fate',
    //'huntinglog', 'character',
];

let XIVDBTooltips = new XIVDBTooltipsClass(),
    XIVDBTooltipsDOM = new XIVDBTooltipsDOMClass(),
    XIVDBTooltipsLinks = new XIVDBTooltipsLinksClass(),
    XIVDBTooltipsHolder = new XIVDBTooltipsHolderClass(),
    XIVDBTooltipsDependency = new XIVDBTooltipsDependencyClass();


// start XIVDB Tooltips
document.addEventListener("DOMContentLoaded", (event) => {
    XIVDBTooltips
        .setOptions(typeof xivdb_tooltips !== 'undefined' ? xivdb_tooltips : xivdb_tooltips_default)
        .init();
});
