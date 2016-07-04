var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

//
// XIVDB tooltips
//

var XIVDBTooltipsClass = (function () {
    function XIVDBTooltipsClass(options) {
        _classCallCheck(this, XIVDBTooltipsClass);

        this.version = '0.7';

        // Options passed
        this.options = options;

        // has the tooltips initialized?
        this.hasInitialized = false;

        // if window location is on xivdb, then remove credit
        if (window.location.href.indexOf(this.xivdb) > -1) {
            this.options.includeCredits = false;
        }
    }

    //
    // XIVDB tooltips
    //

    //
    // Start XIVDB tooltips
    //

    _createClass(XIVDBTooltipsClass, [{
        key: 'initialize',
        value: function initialize() {
            var _this = this;

            // Setup mobile detection
            XIVDBTooltipsDevice.setOptions({
                mobileIgnore: this.options.mobileIgnore,
                mobileWidth: this.options.mobileWidth
            });

            // If on mobile, don't initialize anything.
            if (XIVDBTooltipsDevice.isOnMobile()) {
                return;
            }

            // Ensure all options are set, fill in missing ones
            this.validateTooltipOptions();

            // run tooltips once dependencies pass
            XIVDBTooltipsDependency.passed(function () {
                // Handle responsiveness
                XIVDBTooltipsDevice.handleResponsive();

                // prepare the dom
                XIVDBTooltipsDOM.prepare();

                // we've initialized
                _this.hasInitialized = true;

                // get tooltips
                _this.get();
            });
        }

        //
        // Get version
        //
    }, {
        key: 'getVersion',
        value: function getVersion() {
            return this.version;
        }

        //
        // Get an option
        //
    }, {
        key: 'getOption',
        value: function getOption(setting) {
            return this.options[setting];
        }

        //
        // Verifies tooltips options and sets the default on missing ones
        //
    }, {
        key: 'validateTooltipOptions',
        value: function validateTooltipOptions() {
            for (var option in xivdb_tooltips_default) {
                if (typeof this.options[option] == 'undefined') {
                    this.options[option] = xivdb_tooltips_default[option];
                }
            }
        }

        // ------------------------------
        // Short functions intended for
        // public use!
        // ------------------------------

        //
        // Get tooltips
        //
    }, {
        key: 'get',
        value: function get() {
            if (!this.hasInitialized || XIVDBTooltipsDevice.isOnMobile()) {
                return;
            }

            // Begin
            XIVDBTooltipsUrls.parse();

            // get links, and verify its length
            if (links = XIVDBTooltipsUrls.getLinks()) {
                // get tooltips for the links
                XIVDBTooltipsQuery.get(links, function (tooltips) {
                    // inject tooltips into dom
                    XIVDBTooltipsDOM.inject(tooltips);

                    // tooltip completed event
                    if (CompletedEvent = XIVDBTooltips.getOption('event_tooltipsLoaded')) {
                        CompletedEvent();
                    }
                });
            }
        }

        //
        // Hide tooltips
        //
    }, {
        key: 'hide',
        value: function hide() {
            XIVDBTooltipsDOM.hide();
        }
    }]);

    return XIVDBTooltipsClass;
})();

var XIVDBTooltipsDependencyClass = (function () {
    function XIVDBTooltipsDependencyClass() {
        _classCallCheck(this, XIVDBTooltipsDependencyClass);

        // Version of jquery to include
        this.jquery = 'https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js';

        // Version of Font Awesome to include (they're used in the tooltip)
        this.fa = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.5.0/css/font-awesome.min.css';
    }

    //
    // When tooltips pass
    //

    _createClass(XIVDBTooltipsDependencyClass, [{
        key: 'passed',
        value: function passed(callback) {
            var _this2 = this;

            // check for jquery, if it does not exist this will
            // embed it into the head using the version above.
            this.checkForJquery();

            // if jquery has not loaded, delay initialize
            if (typeof $ === 'undefined') {
                return setTimeout(function () {
                    if (typeof $ === 'undefined') {
                        return console.error('jquery could not be embedded, tooltips cannot run');
                    }

                    // check for font awesome
                    _this2.checkForFontAwesome();

                    return callback();
                }, 500);
            }

            return callback();
        }

        //
        // Check for jquery
        //
    }, {
        key: 'checkForJquery',
        value: function checkForJquery() {
            if (typeof $ === 'undefined' || !window.jQuery) {
                var jq = document.createElement('script');
                jq.type = 'text/javascript';
                jq.src = this.jquery;
                document.getElementsByTagName('head')[0].appendChild(jq);
                return true;
            }

            // return true of false
            return $ ? true : false;
        }

        //
        // Check for font awesome
        //
    }, {
        key: 'checkForFontAwesome',
        value: function checkForFontAwesome() {
            // check for FA link
            if ($('link[href="' + this.fa + '"]').length == 0) {
                var AppendNewStyle = document.createElement('link');
                AppendNewStyle.setAttribute('href', this.fa);
                AppendNewStyle.setAttribute('rel', 'stylesheet');
                AppendNewStyle.setAttribute('type', 'text/css');
                $('head')[0].appendChild(AppendNewStyle);
            }
        }
    }]);

    return XIVDBTooltipsDependencyClass;
})();

var XIVDBTooltipsDeviceClass = (function () {
    function XIVDBTooltipsDeviceClass() {
        _classCallCheck(this, XIVDBTooltipsDeviceClass);

        //
        // If user is on a mobile or not
        //
        this.onMobile = false;

        //
        // Whether to ignore tooltips on mobile or not, mobile does
        // not have a hover state, so by default they're ignored
        // as it causes unnecessary querying and slowness.
        //
        // Maybe in future I can implement a way.
        //
        this.mobileIgnore = xivdb_tooltips_default.mobileIgnore;

        //
        // The size of the browser for mobile to be detect,
        // when the size of the browser is below this point
        // it will be assume the user is on the mobile device.
        //
        this.mobileWidth = xivdb_tooltips_default.mobileWidth;
    }

    //
    // Tooltips DOM class
    //

    //
    // Call this to know if the user is on mobile or not
    //

    _createClass(XIVDBTooltipsDeviceClass, [{
        key: 'isOnMobile',
        value: function isOnMobile() {
            return this.onMobile;
        }

        //
        // Set whether the tooltips should load on mobile
        //
    }, {
        key: 'setOptions',
        value: function setOptions(options) {
            this.mobileIgnore = options.mobileIgnore;
            this.mobileWidth = options.mobileWidth;
        }

        //
        // Handle auto detect of mobile for responsive websites
        //
    }, {
        key: 'handleResponsive',
        value: function handleResponsive() {
            var _this3 = this;

            // if we're ignoring mobile just return
            if (this.mobileIgnore) {
                return;
            }

            // default initial detection
            this.onMobile = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) <= this.mobileWidth ? true : false;

            // update state on window resize
            $(window).resize(function () {
                _this3.onMobile = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) <= _this3.mobileWidth ? true : false;
            });
        }
    }]);

    return XIVDBTooltipsDeviceClass;
})();

var XIVDBTooltipsDOMClass = (function () {
    function XIVDBTooltipsDOMClass() {
        _classCallCheck(this, XIVDBTooltipsDOMClass);
    }

    _createClass(XIVDBTooltipsDOMClass, [{
        key: 'prepare',

        //
        // Prepare the dom with some stuff! Such as tooltips etc.
        //
        value: function prepare() {
            var _this4 = this;

            var xivdbUrl = XIVDBTooltips.getOption('xivdb'),
                xivdbVersion = XIVDBTooltips.getVersion();

            // add the tooltip
            $('head').append('<link href="' + xivdbUrl + '/tooltips.css?v=' + xivdbVersion + '" rel="stylesheet" type="text/css">');

            // append tooltip placeholder
            $('body').append('<div class="xivdb" style="display:none;"></div>');

            // on mouse entering a tooltip
            $('body').on('mouseenter', '[data-xivdb-tooltip]', function (event) {
                var $element = $(event.currentTarget),
                    html = $element.attr('data-xivdb-tooltip');

                // set the html into the xivdb placeholder
                $('.xivdb').html(html);

                // show the tooltip
                _this4.show(event);

                // on mouse move
                $element.unbind('mousemove').mousemove(function (event) {
                    _this4.follow(event);
                });
            }).on('mouseleave', '*[data-xivdb-tooltip]', function (event) {
                var $element = $(event.target);

                // unbind mouse move event
                $element.unbind('mousemove');

                // hide tooltips
                _this4.hide();
            });

            // set 100%
            if (!XIVDBTooltips.getOption('preventHtmlHeight')) {
                $('html').css({ 'height': '100%' });
            }
        }

        //
        // Hide the tooltip
        //
    }, {
        key: 'hide',
        value: function hide() {
            $('.xivdb').hide().html('');
        }

        //
        // Show the tooltip
        //
    }, {
        key: 'show',
        value: function show(event) {
            // follow an event
            this.follow(event);

            // show tooltip
            $('.xivdb').show();
        }

        //
        // Follow mouse
        //
    }, {
        key: 'follow',
        value: function follow(event) {
            // Get x/y position and page positions
            var container = XIVDBTooltips.getOption('linkContainer'),
                left = event.pageX + 12,
                top = event.pageY + 12,
                width = $('.xivdb').outerWidth(true),
                height = $('.xivdb').outerHeight(true),
                topOffset = top + height,
                leftOffset = left + width,
                topLimit = $(container).height() + $(container).scrollTop(),
                leftLimit = $(container).scrollLeft() + $(container).width();

            // Positions based on window boundaries
            if (leftOffset > leftLimit) left = event.pageX - width;
            if (topLimit < topOffset) top = event.pageY - height;

            // tell tooltip to position somewhere
            this.position(left, top);
        }

        //
        // Position the tooltip somewhere
        //
    }, {
        key: 'position',
        value: function position(left, top) {
            $('.xivdb').css({
                top: top + 'px',
                left: left + 'px'
            });
        }

        //
        // Inject tooltips into elements
        //
    }, {
        key: 'inject',
        value: function inject(tooltipsResponse) {
            // loop through types
            for (var type in tooltipsResponse) {
                // go through all tooltips
                for (var i in tooltipsResponse[type]) {
                    // get tooltip
                    var tooltip = tooltipsResponse[type][i],
                        data = tooltip.data,
                        html = tooltip.html,
                        key = 'xivdb_' + type + '_' + data.id,
                        container = XIVDBTooltips.getOption('linkContainer'),
                        $html = this.getFrame(),
                        $link = $(container + ' [data-xivdb-key="' + key + '"]:visible');

                    // if no link, continue
                    if (!$link || $link.length == 0) {
                        //console.log('no link, either not visible or removed from dom: ' + key);
                        continue;
                    }

                    // if link already has stuff injected, don't do it again
                    if ($link.attr('data-xivdb-tooltip') && $link.attr('data-xivdb-tooltip').length > 0) {
                        continue;
                    }

                    // inject tooltip html into frame
                    $html.find('.xivdb-fc').html(html);

                    // if to include xivdb credits
                    if (XIVDBTooltips.getOption('includeCredits')) {
                        $html.find('.xivdb-fc').append('<div class="xivdb-copyright">xivdb.com</div>');
                    }

                    // if to remove shadow from the frame
                    if (!XIVDBTooltips.getOption('includeFrameShadow')) {
                        $html.find('.xivdb-frame-shadow').removeClass('xivdb-frame-shadow');
                    }

                    // inject tooltip
                    $link.attr('data-xivdb-tooltip', $html.html());

                    // --------------------------------------------------------------

                    // if to replace name or not
                    if (this.checkLinkSettings($link, ['seturlname', 'replacename'])) {
                        $link.text(data.name);
                    }

                    // if to color name or not
                    if (this.checkLinkSettings($link, ['seturlcolor', 'colorname'])) {
                        var css = XIVDBTooltips.getOption('seturlcolorDarken') ? 'rarity-' + data.color + '-darken' : 'rarity-' + data.color;

                        $link.addClass(css);
                    }

                    // if to set icon or not
                    if (this.checkLinkSettings($link, ['seturlicon', 'showicon'])) {
                        var css = 'xivdb-ii',
                            iconsize = XIVDBTooltips.getOption('iconSize');

                        // if to circle the icon
                        if (XIVDBTooltips.getOption('iconCircle')) {
                            css = css + ' xivdb-iir';
                        }

                        $link.prepend('<img src="' + data.icon + '" class="' + css + '" height="' + iconsize + '">');
                    }
                }
            }
        }

        //
        // Check the settings on a link
        //
    }, {
        key: 'checkLinkSettings',
        value: function checkLinkSettings($link, settings) {
            // go through each setting, if any fail, then it cannot pass!
            for (var i in settings) {
                var option = settings[i],
                    attr = 'data-xivdb-' + option;

                // IF the settings are false, then pass is false
                if (XIVDBTooltips.getOption(option) === false) {
                    return false;
                }

                // IF the attribute is not undefined
                // AND the attribute is false
                if ($link.attr(attr) && ($link.attr(attr) == '0' || $link.attr(attr).toLowerCase() == 'false')) {
                    return false;
                }
            }

            return true;
        }

        //
        // Get tooltip frame
        //
    }, {
        key: 'getFrame',
        value: function getFrame() {
            return $('<div></div>').html('<table class="xivdb-frame xivdb-frame-shadow" width="0" border="0" cellspacing="0" cellpadding="0"><tr><td class="xivdb-fw xivdb-ftl"></td><td class="xivdb-fh xivdb-ft"></td><td class="xivdb-fw xivdb-ftr"></td></tr><tr><td class="xivdb-fw xivdb-fml"></td><td class="xivdb-fc" valign="top"></td><td class="xivdb-fw xivdb-fmr"></td></tr><tr><td class="xivdb-fw xivdb-fbl"></td><td class="xivdb-fh xivdb-fb"></td><td class="xivdb-fw xivdb-fbr"></td></tr></table>');
        }
    }]);

    return XIVDBTooltipsDOMClass;
})();

var XIVDBTooltipsUrlsClass = (function () {
    function XIVDBTooltipsUrlsClass() {
        _classCallCheck(this, XIVDBTooltipsUrlsClass);

        this.links = {};
    }

    //
    // Get urls
    //

    _createClass(XIVDBTooltipsUrlsClass, [{
        key: 'getLinks',
        value: function getLinks() {
            return this.links.length > 0 ? this.links : false;
        }

        //
        // Parse links in the page
        //
    }, {
        key: 'parse',
        value: function parse() {
            // reset links (existing ones will have already been processed)
            this.links = {};

            // go through all links and find XIVDB links
            $(XIVDBTooltips.getOption('linkContainer') + ' a').each(function (i, element) {
                var $link = $(element),
                    href = $link.attr('href');

                // check if the link is ignored
                if ($link.attr('data-xivdb-ignore')) {
                    return;
                }

                // ignore if already processed before
                if ($link.attr('data-xivdb-tooltip')) {
                    return;
                }

                // is the link empty?
                if (typeof href === 'undefined' || href.length < 1) {
                    return;
                }

                // check for hidden link condition
                if (!XIVDBTooltips.getOption('includeHiddenLinks') && !$link.is(':visible')) {
                    return;
                }

                // remove any double slashes
                href = href.toString().toLowerCase().replace('//', '/').replace('http:', '').replace('https:', '').toString();

                // is the link not an XIVDB link (and not local)
                if (href[0] != '/' && href.indexOf(XIVDBTooltips.getOption('xivdb')) == -1) {
                    return;
                }
                
                
                // remove url
                var baseurl = XIVDBTooltips.getOption("xivdb").replace("http://","").replace("https://","");
                href = href.replace(baseurl, '');

                // split up the link and clean it
                href = href.split('/').filter(function (n) {
                    return n.toString().length > 0;
                });

                // does a valid type exist
                if (xivdb_tooltips_valid_types.indexOf(href[0]) == -1) {
                    return;
                }

                // get type and ID
                var type = href[0].replace('?', ''),
                    id = href[1];

                // create a sort of cache key
                var key = 'xivdb_' + type + '_' + id;

                // if url length below two, it isn't valid, as
                // 2 = TYPE and ID
                if (typeof href == 'undefined' || href.length < 2) {
                    return;
                }

                // fix dated links
                if (href.indexOf('xivdb.com/?') > -1) {
                    href = href.replace('xivdb.com/?', 'xivdb.com/');
                    $link.attr('href', href.toString());
                }

                // attach the key to the element, (or the parent element)
                // we also check we havent added the key before
                if ($link.attr('data-xivdb-parent') && !$link.attr('data-xivdb-key')) {
                    // add the key to the parent element
                    return $link.parents($link.attr('data-xivdb-parent')).attr('data-xivdb-key', key);
                } else if (!$link.attr('data-xivdb-parent')) {
                    // add the key to the element
                    return $link.attr('data-xivdb-key', key);
                }
            });

            // if including hidden links, we just get all
            // else we have to filter via visibility
            this.links = XIVDBTooltips.getOption('includeHiddenLinks') ? $(XIVDBTooltips.getOption('linkContainer') + ' [data-xivdb-key]') : $(XIVDBTooltips.getOption('linkContainer') + ' [data-xivdb-key]:visible');
        }
    }]);

    return XIVDBTooltipsUrlsClass;
})();

var XIVDBTooltipsQueryClass = (function () {
    function XIVDBTooltipsQueryClass() {
        _classCallCheck(this, XIVDBTooltipsQueryClass);
    }

    _createClass(XIVDBTooltipsQueryClass, [{
        key: 'get',

        //
        // Get links to query
        //
        value: function get(links, callback) {
            // if on mobile, stop
            if (XIVDBTooltipsDevice.isOnMobile()) {
                return;
            }

            // Organise links into types to be sent with the form data
            var list = {};

            // organize all links
            links.each(function (i, element) {
                var key = $(element).attr('data-xivdb-key').split('_'),
                    type = key[1].toString(),
                    id = parseInt(key[2]);

                // if empty for whatever reason..
                if (type.length == 0 || !id) {
                    return;
                }

                // if type does not exist in list, add it
                if (typeof list[type] === 'undefined') {
                    list[type] = [];
                }

                // add to list
                list[type].push(id);
            });

            // join all lists
            for (var i in list) {
                list[i] = list[i].join(',');
            }

            // query tooltips
            this.query(list, callback);
        }

        //
        // Query for tooltips
        //
    }, {
        key: 'query',
        value: function query(list, callback) {
            // if on mobile, stop
            if (XIVDBTooltipsDevice.isOnMobile()) {
                return;
            }

            // query tooltips
            $.ajax({
                url: XIVDBTooltips.getOption('xivdb') + '/tooltip',
                method: 'POST',
                dataType: 'json',
                cache: true,
                data: {
                    list: list,
                    language: XIVDBTooltips.getOption('language')
                },

                // on success
                success: function success(tooltips) {
                    // if empty
                    if (!tooltips) {
                        console.error('Tooltips returned no response');
                        return;
                    }

                    // if not an object
                    if (typeof tooltips !== 'object') {
                        console.error('Tooltips response was not an object');
                        return;
                    }

                    // callback
                    if (callback) {
                        callback(tooltips);
                    }
                },

                // on error
                error: function error(data, status, code) {
                    console.error('----------------');
                    console.error('Error loading tooltips!');
                    console.error(data.responseText);
                    console.error(status, code);
                    console.error('----------------');
                }
            });
        }
    }]);

    return XIVDBTooltipsQueryClass;
})();

var xivdb_tooltips_default = {
    xivdb: 'http://xivdb.com',
    language: 'en',
    jqueryEmbed: true,
    fontAwsomeEmbed: true,

    seturlname: true,
    seturlcolor: true,
    seturlcolorDarken: true,
    seturlicon: true,

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

    event_tooltipsLoaded: null
};

var xivdb_tooltips_valid_types = ['item', 'achievement', 'action', 'gathering', 'instance', 'leve', 'enemy', 'emote', 'placename', 'status', 'title', 'recipe', 'quest', 'shop', 'npc', 'minion', 'mount', 'weather', 'fate'];

// initialize classes
var XIVDBTooltips = new XIVDBTooltipsClass(typeof xivdb_tooltips !== 'undefined' ? xivdb_tooltips : xivdb_tooltips_default),
    XIVDBTooltipsDevice = new XIVDBTooltipsDeviceClass(),
    XIVDBTooltipsUrls = new XIVDBTooltipsUrlsClass(),
    XIVDBTooltipsQuery = new XIVDBTooltipsQueryClass(),
    XIVDBTooltipsDependency = new XIVDBTooltipsDependencyClass(),
    XIVDBTooltipsDOM = new XIVDBTooltipsDOMClass();

// start XIVDB Tooltips
document.addEventListener("DOMContentLoaded", function (event) {
    XIVDBTooltips.initialize();
});
