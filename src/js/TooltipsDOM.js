//
// Tooltips DOM class
//
class XIVDBTooltipsDOMClass
{
    constructor()
    {
        this.isActive = false;
    }

    //
    // Prepare the dom with some stuff! Such as tooltips etc.
    //
    prepare()
    {
        var xivdbUrl = XIVDBTooltips.getOption('xivdb'),
            xivdbVersion = XIVDBTooltips.getVersion();

        // add the tooltip
        $('head').append(`<link href="${xivdbUrl}/tooltips.css?v=${xivdbVersion}" rel="stylesheet" type="text/css">`);

        // append tooltip placeholder
        $('body').append('<div class="xivdb" style="display:none;"></div>');

        // on mouse entering a tooltip
        $('body').on('mouseenter', '[data-xivdb-key]', (event) =>
        {
            this.isActive = true;
            var $element = $(event.currentTarget),
                key = $element.attr('data-xivdb-key'),
                html = XIVDBTooltipsHolder.get(key);

            // if element is being dragged, don't show any tooltips
            if ($('.ui-draggable-dragging').length > 0) {
                return;
            }

            // set the html into the xivdb placeholder
            $('.xivdb').html(html);

            // show the tooltip
            this.show(event);
        })
        .on('mouseleave', '*[data-xivdb-key]', (event) => {
            this.isActive = false;
            var $element = $(event.target);

            // hide tooltips
            this.hide();
        });

        // on mouse move
        $('body').on('mousemove', (event) => {
            if (this.isActive) {
                this.follow(event);
            }
        });

        // set 100%
        if (!XIVDBTooltips.getOption('preventHtmlHeight')) {
            $('html').css({ 'height' : '100%' });
        }
    }

    //
    // Hide the tooltip
    //
    hide()
    {
        $('.xivdb').hide().html('');
    }

    //
    // Show the tooltip
    //
    show(event)
    {
        // follow an event
        this.follow(event);

        // show tooltip
        $('.xivdb').show();
    }

    //
    // Follow mouse
    //
    follow(event)
    {
        // Get x/y position and page positions
        var container = XIVDBTooltips.getOption('linkContainer'),
            left = event.pageX + 30,
            top = event.pageY + 30,
            width = $('.xivdb').outerWidth(true),
            height = $('.xivdb').outerHeight(true),
            topOffset = top + height,
            leftOffset = left + width,
            topLimit = $(window).height() + $(window).scrollTop(),
            leftLimit = $(window).scrollLeft() + $(window).width();

        // Positions based on window boundaries
        if (leftOffset > leftLimit) left = event.pageX - width;
        if (topLimit < topOffset) top = event.pageY - height;

        // tell tooltip to position somewhere
        this.position(left, top);
    }

    //
    // Position the tooltip somewhere
    //
    position(left, top)
    {
        $('.xivdb').css({
            top: top + 'px',
            left: left + 'px',
        });
    }

    //
    // Inject tooltips into elements
    //
    inject(tooltipsResponse)
    {
        // loop through types
        for(var type in tooltipsResponse)
        {
            // go through all tooltips
            for(var i in tooltipsResponse[type])
            {
                // get tooltip
                var tooltip = tooltipsResponse[type][i],
                    data = tooltip.data,
                    html = tooltip.html,
                    key = `xivdb_${type}_${data.id}`,
                    container = XIVDBTooltips.getOption('linkContainer'),
                    $link = $(`${container} [data-xivdb-key="${key}"]`);

                // inject tooltip
                XIVDBTooltipsHolder.add(key, html);

                // --------------------------------------------------------------

                // if to replace name or not
                if (this.checkLinkSettings($link, ['noreplace', 'seturlname', 'replacename'])) {
                    $link.text(data.name);
                }

                // if to color name or not
                if (this.checkLinkSettings($link, ['noreplace', 'seturlcolor', 'colorname'])) {
                    var css = XIVDBTooltips.getOption('seturlcolorDarken')
                        ? `rarity-${data.color}-darken`
                        : `rarity-${data.color}`;

                    $link.addClass(css);
                }

                // if to set icon or not
                if (this.checkLinkSettings($link, ['noreplace', 'seturlicon', 'showicon'])) {
                    var css = 'xivdb-ii',
                        iconsize = XIVDBTooltips.getOption('iconSize');

                    // if to circle the icon
                    if (XIVDBTooltips.getOption('iconCircle')) {
                        css = `${css} xivdb-iir`;
                    }

                    $link.prepend(`<img src="${data.icon}" class="${css}">`);
                }
            }
        }
    }

    //
    // Check the settings on a link
    //
    checkLinkSettings($link, settings)
    {
        // go through each setting, if any fail, then it cannot pass!
        for(var i in settings)
        {
            var option = settings[i],
                attr = `data-xivdb-${option}`;

            // IF the settings are false, then pass is false
            if (XIVDBTooltips.getOption(option) === false) {
                return false;
            }

            // IF the attribute is not undefined
            // AND the attribute is false
            if (typeof $link.attr(attr) !== 'undefined' && ($link.attr(attr) == '0' || $link.attr(attr).toLowerCase() == 'false')) {
                return false;
            }
        }

        return true;
    }

    //
    // Get tooltip frame
    //
    getFrame()
    {
        return $('<div></div>').html(``);
    }
}
