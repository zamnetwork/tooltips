var xivdb_tooltips_default = {
    xivdb: 'http://xivdb.com',
    language: 'en',
    jqueryEmbed: true,
    fontAwsomeEmbed: true,

    seturlname: true,
    seturlcolor: true,
    seturlcolorDarken: true,
    seturlicon : true,

    iconSize: 20,
    iconCircle: true,

    tooltipFixed: false,
    tooltipFixedBottom: false,

    targetBlank: true,
    includeHiddenLinks: true,
    includeCredits: true,
    includeFrameShadow: false,
    includeLocalLinks: false,

    preventHtmlHeight: false,

    container: window,
    linkContainer: 'body',
    parentTooltipAttribute: 'data-xivdb',
    parentTooltip: true,
    watch: '.search-content',
    watchDelay: 750,

    mobileIgnore: false,
    mobileWidth: 720,

    event_tooltipsLoaded: null,
}

var xivdb_tooltips_valid_types = [
    'item', 'achievement', 'action', 'gathering', 'instance', 'leve',
    'enemy', 'emote', 'placename', 'status', 'title', 'recipe',
    'quest', 'shop', 'npc', 'minion', 'mount', 'weather', 'fate',
];

// initialize classes
var XIVDBTooltips = new XIVDBTooltipsClass(),
    XIVDBTooltipsDevice = new XIVDBTooltipsDeviceClass(),
    XIVDBTooltipsUrls = new XIVDBTooltipsUrlsClass(),
    XIVDBTooltipsQuery = new XIVDBTooltipsQueryClass(),
    XIVDBTooltipsDependency = new XIVDBTooltipsDependencyClass(),
    XIVDBTooltipsDOM = new XIVDBTooltipsDOMClass();

// start XIVDB Tooltips
document.addEventListener("DOMContentLoaded", function(event) {
    XIVDBTooltips.setOptions(typeof xivdb_tooltips !== 'undefined' ? xivdb_tooltips : xivdb_tooltips_default);
    XIVDBTooltips.initialize();
});