//
// Tooltips DOM class
//
class XIVDBTooltipsDOMClass
{
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
        $('body').on('mouseenter', '[data-xivdb-tooltip]', (event) =>
        {
            var $element = $(event.currentTarget),
                html = $element.attr('data-xivdb-tooltip');

            // set the html into the xivdb placeholder
            $('.xivdb').html(html);

            // show the tooltip
            this.show(event);

            // on mouse move
            $element.unbind('mousemove').mousemove((event) => {
                this.follow(event);
            });
        }).on('mouseleave', '*[data-xivdb-tooltip]', (event) => {
            var $element = $(event.target);

            // unbind mouse move event
            $element.unbind('mousemove');

            // hide tooltips
            this.hide();
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
                    $html = this.getFrame(),
                    $link = $(`${container} [data-xivdb-key="${key}"]:visible`);

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
                    var css = XIVDBTooltips.getOption('seturlcolorDarken')
                        ? `rarity-${data.color}-darken`
                        : `rarity-${data.color}`;

                    $link.addClass(css);
                }

                // if to set icon or not
                if (this.checkLinkSettings($link, ['seturlicon', 'showicon'])) {
                    var css = 'xivdb-ii',
                        iconsize = XIVDBTooltips.getOption('iconSize');

                    // if to circle the icon
                    if (XIVDBTooltips.getOption('iconCircle')) {
                        css = `${css} xivdb-iir`;
                    }

                    $link.prepend(`<img src="${data.icon}" class="${css}" height="${iconsize}">`);
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
            if ($link.attr(attr) && ($link.attr(attr) == '0' || $link.attr(attr).toLowerCase() == 'false')) {
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
        return $('<div></div>').html(`<table class="xivdb-frame xivdb-frame-shadow" width="0" border="0" cellspacing="0" cellpadding="0"><tr><td class="xivdb-fw xivdb-ftl"></td><td class="xivdb-fh xivdb-ft"></td><td class="xivdb-fw xivdb-ftr"></td></tr><tr><td class="xivdb-fw xivdb-fml"></td><td class="xivdb-fc" valign="top"></td><td class="xivdb-fw xivdb-fmr"></td></tr><tr><td class="xivdb-fw xivdb-fbl"></td><td class="xivdb-fh xivdb-fb"></td><td class="xivdb-fw xivdb-fbr"></td></tr></table>`);
    }
}