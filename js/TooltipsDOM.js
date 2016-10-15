//
// Tooltip DOM class
//
class XIVDBTooltipsDOMClass
{
	constructor()
    {
        this.isActive = false;
    }

	// get the site ready for tooltips
    prepare()
    {
		let source = XIVDBTooltips.getOption('source'),
			cachetime = XIVDBTooltips.cachetime();

		// add the tooltip
        $('head').append(`<link href="${source}/tooltips.css?v=${cachetime}" rel="stylesheet" type="text/css">`);

		// append tooltip placeholder
        $('body').append('<div class="xivdb" style="display:none;"></div>');

		// on mouse entering a tooltip
        $('html').on('mouseenter', '[data-xivdb-key]', (event) =>
        {
            this.isActive = true;
            let $element = $(event.currentTarget),
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
            let $element = $(event.target);

            // hide tooltips
            this.hide();
        });

        // on mouse move
        $('html').on('mousemove', (event) => {
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
	// Inject tooltips
	//
	inject(tooltips)
	{
		// loop through types
        for(let type in tooltips)
        {
            // go through all tooltips
            for(let i in tooltips[type])
            {
				// get tooltip
                let tooltip = tooltips[type][i];
				if (!tooltip) {
					console.log('false tooltip');
					continue;
				}

                let data = tooltip.data,
                    html = tooltip.html,
                    key = `xivdb_${type}_${data.id}`,
                    $link = $(`[data-xivdb-key="${key}"]`);

                // inject tooltip
                XIVDBTooltipsHolder.add(key, html);

				// --------------------------------------------------------------

				// if attribute: data-xivdb-replace="0" is set, don't replace anything.
				if (this.checkLinkSettings($link, ['replace']))
				{
	                // if to replace name or not
	                if (this.checkLinkSettings($link, ['seturlname', 'replacename'])) {
	                    $link.text(data.name);
	                }

	                // if to color name or not
	                if (this.checkLinkSettings($link, ['seturlcolor', 'colorname'])) {
	                    let css = XIVDBTooltips.getOption('seturlcolorDarken')
	                        ? `rarity-${data.color}-darken`
	                        : `rarity-${data.color}`;

	                    $link.addClass(css);
	                }

	                // if to set icon or not
	                if (this.checkLinkSettings($link, ['seturlicon', 'showicon'])) {
	                    let css = 'xivdb-ii',
	                        iconsize = parseInt($('a[data-xivdb-key]').css('font-size'), 10) + 6;

						console.log(data.icon);
						if (data.icon.indexOf('finalfantasyxiv.com') == -1 && data.icon.indexOf('secure.xivdb') == -1) {
							data.icon = 'https://secure.xivdb.com' + data.icon;
						}

	                    $link.prepend(`<img src="${data.icon}" style="height:${iconsize}px;" class="${css}">`);
	                }
				}
			}
		}

		console.log('finished', (new Date() - XIVDBTooltips.startTimestamp));
	}

	//
    // Check the settings on a link
    //
    checkLinkSettings($link, settings)
    {
        // go through each setting, if any fail, then it cannot pass!
        for(let i in settings)
        {
            let option = settings[i],
                attr = `data-xivdb-${option}`;

            // IF the settings are false, then pass is false
            if (XIVDBTooltips.getOption(option) === false) {
                return false;
            }

            // if option "replace" exists, ignore completely
            if ($link.attr('data-xivdb-replace')) {
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
        let left = event.pageX + XIVDBTooltips.getOption('tooltipDistanceX'),
            top = event.pageY + XIVDBTooltips.getOption('tooltipDistanceY'),
            width = $('.xivdb').outerWidth(true),
            height = $('.xivdb').outerHeight(true),
            topOffset = top + height,
            leftOffset = left + width,
            topLimit = $(window).height() + $(window).scrollTop(),
            leftLimit = $(window).scrollLeft() + $(window).width();

        // Positions based on window boundaries
        if (leftOffset > leftLimit) left = event.pageX - (width + XIVDBTooltips.getOption('tooltipDistanceX'));
        if (topLimit < topOffset) top = event.pageY - (height + XIVDBTooltips.getOption('tooltipDistanceY'));

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

}
