var xivdb_tooltips_default = {
    language: 'en',
    jqueryCheck: true,
    jqueryCheckDuration: 500,
    fontAwsomeEmbed: true,

    setUrlName: true,
    setUrlColor: true,
    setUrlColorDarken: true,
    setUrlIcon : true,

    iconSize: 20,
    iconCircle: true,

    tooltipFixed: false,
    tooltipFixedBottom: false,

    targetBlank: true,
    includeHiddenLinks: true,
    includeCredits: true,

    container: window,
}

//
// XIVDB tooltips
//
class XIVDBTooltipsClass
{
    constructor(options) {
        this.version = '0.5';
        this.xivdb = 'http://xivdb.dev';
        this.jquery = 'https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js';
        this.fa = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.5.0/css/font-awesome.min.css';
        this.options = options;
        this.ids = {};
        this.urls = {};
    }

    //
    // Initialize
    //
    initialize()
    {
        if (this.options.jqueryCheck) {
            var _this = this;
            if (!this.jqueryCheck()) {
                setTimeout(function() {
                    _this.initialize();
                }, _this.options.jqueryCheckDuration);

                return;
            }
        } else if (typeof $ === 'undefined') {
            console.error('The variable $ cannot be found, this script assumes jQuery is embeded, enable the option: jqueryCheck or embed jquery into your site');
            return;
        }

        // if window location is on xivdb, then remove credit
        if (window.location.href.indexOf(this.xivdb) > -1) {
            this.options.includeCredits = false;
        }

        this.setDefaults();
        this.getLinksData();
        this.getTooltipsIdList();
        this.recurrsiveTooltipsHandler(this.ids);
    }

    //
    // Change an option
    //
    setOption(option, value)
    {
        this.options[option] = value;
    }

    //
    // Check for jquery
    //
    jqueryCheck()
    {
        if (!window.jQuery) {
            var jq = document.createElement('script'); jq.type = 'text/javascript';
            jq.src = this.jquery;
            document.getElementsByTagName('head')[0].appendChild(jq);
            return false;
        }

        if (!$) {
            return false;
        }

        return true;
    }

    //
    // Set defaults for missing options
    //
    setDefaults()
    {
        for(var option in xivdb_tooltips_default) {
            var value = xivdb_tooltips_default[option];

            if (typeof this.options[option] === 'undefined') {
                this.options[option] = value;
            }
        }
    }

    //
    // Detect XIVDB Links
    //
    getLinksData()
    {
        var _this = this;
        $('body a').each(function() {
            var link = $(this).attr('href'),
                linkdata = [];

            if (!_this.options.includeHiddenLinks) {
                // if link is not visible continue
                if (!$(this).is(':visible')) {
                    return;
                }
            }


            // if to ignore tooltip
            if ($(this).attr('data-xivdb-ignore') == '1') {
                return;
            }

            // if contains xivdb url
            if (link.indexOf('xivdb.com') > -1) {
                link = link.split('/').filter(function(e){return e});

                // get language
                var lang = 'en';
                if (link[1].split('.').length == 3) {
                    lang = link[1].split('.')[0];
                }

                var type = link[2], id = parseInt(link[3]);

                // if no type and id
                if (!type || !id) {
                    return;
                }

                // class key
                var key = `xivdbtt_${type}_${id}`;

                // push
                _this.urls[key] = {
                    type: type,
                    id: id,
                    key: key,
                };

                // add class to link
                $(this).addClass(key);
            }
        });
    }

    //
    // get Tooltips ID list
    //
    getTooltipsIdList()
    {
        // generate list of IDs based on type
        var list = {};
        for(var key in this.urls) {
            var data = this.urls[key];

            // create type if not exists
            if (typeof list[data.type] === 'undefined') {
                list[data.type] = [];
            }

            list[data.type].push(data.id);
        }

        // join all ids
        for(var i in list) {
            list[i] = list[i].join(',');
        }

        this.ids = list;
    }

    //
    // recurrsive tooltip funciton
    //
    recurrsiveTooltipsHandler(list)
    {
        var _this = this,
            first = Object.keys(list)[0],
            ids = {};

        // delete first as its being processed
        ids[first] = list[first];
        delete list[first];

        // get tooltip and recurrsively call back
        this.getTooltipHtml(ids, function() {
            if (Object.keys(list).length > 0) {
                _this.recurrsiveTooltipsHandler(list);
            } else {
                _this.setDom();
            }
        });
    }

    //
    // Get tooltips html
    //
    getTooltipHtml(list, callback)
    {
        // get tooltip data
        var _this = this;
        $.ajax({
            url: `${this.xivdb}/tooltip`,
            method: 'POST',
            dataType: 'json',
            data: {
                list: list,
                language: _this.options.language,
            },
            success: function(data)
            {
                _this.injectTooltips(data);

                if (callback) {
                    callback();
                }
            },
            error: function(data, status, code)
            {
                console.error('----------------');
                console.error('Error loading tooltips!');
                console.error(data.responseText);
                console.error(status, code);
                console.error('----------------');
            },
            complete: function()
            {
                //tooltips.hide();
            }
        });
    }

    //
    // Inject tooltips
    //
    injectTooltips(data)
    {
        for(var i in data) {
            var tooltip = data[i],
                cached = tooltip[0],
                type = tooltip[1],
                id = tooltip[2],
                html = tooltip[3],
                content = tooltip[4],
                key = `xivdbtt_${type}_${id}`;

            // if removing copyright
            if (this.options.includeCredits) {
                var $html = $('<div></div>').html(html);
                    $html.find('.xivdbtt-frame-contents').append('<div class="xivdbtt-copyright">xivdb.com</div>');
                    html = $html.html();
            }

            var $element = $(`.${key}`);
            $element.attr('data-xivdb-tt', html);

            // if setting name or not
            if (this.options.setUrlName && content) {
                $element.text(content.name);
            }

            // if coloring
            if (this.options.setUrlColor && content) {
                if (this.options.setUrlColorDarken) {
                    $element.addClass(`rarity-${content.color}-darken`);
                } else {
                    $element.addClass(`rarity-${content.color}`);
                }
            }

            // if icon
            if (this.options.setUrlIcon && content) {
                var css = 'xivdbtt-inline-icon';
                if (this.options.iconCircle) {
                    css = `${css} xivdbtt-inline-icon-round`;
                }

                $element.prepend(`<img src="${content.icon}" class="${css}" height="${this.options.iconSize}">`);
            }
        }
    }

    //
    // Set DOM
    //
    setDom()
    {
        var _this = this;

        // js
        $('head').append(`<link href="${this.xivdb}/tooltips.css?v=${this.version}" rel="stylesheet" type="text/css">`);

        // font awsome
        if (this.options.fontAwsomeEmbed) {
            $('head').append(`<link href="${this.fa}?v=${this.version}" rel="stylesheet" type="text/css">`);
        }

        // html
        $('body').append('<div class="xivdbtt"></div>').on('mouseenter', '*[data-xivdb-tt]', function(event) {
            $('.xivdbtt').html($(this).attr('data-xivdb-tt'));
            _this.show(event);

            // if target blank all urls
            if (_this.options.targetBlank) {
                $(this).attr('target', '_blank');
            }

            if (_this.options.tooltipFixed) {
                var position = $(this).offset(),
                    left = position.left,
                    top = position.top;

                // if position to bottom
                if (_this.options.tooltipFixedBottom) {
                    top = top + $(this).outerHeight() * 2;
                } else {
                    top = top - ($('.xivdbtt').outerHeight() + $(this).outerHeight());
                }

                _this.position(left, top);
            } else {
                $(this).unbind('mousemove').mousemove(function(event) {
                    _this.follow(event);
                });
            }
        }).on('mouseleave', '*[data-xivdb-tt]', function() {
            _this.hide();
        });

        // set 100%
        $('body').css({ 'height' : '100%' });
    }

    //
    // show the tooltips (also positions tooltip at the mouse)
    //
    show(event)
    {
        this.follow(event);
        $('.xivdbtt').show();
    }

    //
    // follow mouse
    //
    follow(event)
    {
        if (!this.options.tooltipFixed) {
            // Get x/y position and page positions
            var left = event.pageX + 12,
                top = event.pageY + 12,
                width = $('.xivdbtt').outerWidth(true),
                height = $('.xivdbtt').outerHeight(true),
                topOffset = top + height,
                leftOffset = left + width,
                topLimit = $(this.options.container).height() + $(this.options.container).scrollTop(),
                leftLimit = $(this.options.container).scrollLeft() + $(this.options.container).width();

            // Positions based on window boundaries
            if (leftOffset > leftLimit) left = event.pageX - width;
            if (topLimit < topOffset) top = event.pageY - height;

            this.position(left, top);
        }
    }

    //
    // hide tooltips
    //
    hide()
    {
        $('.xivdbtt').html('').empty().hide();
        this.position(0,0);
    }

    //
    // position the tooltip somewhere
    //
    position(left, top)
    {
        $('.xivdbtt').css({
            top: top + 'px',
            left: left + 'px',
        });
    }
}

var XIVDBTooltips = new XIVDBTooltipsClass(typeof xivdb_tooltips !== 'undefined' ? xivdb_tooltips : xivdb_tooltips_default);

XIVDBTooltips.initialize();
