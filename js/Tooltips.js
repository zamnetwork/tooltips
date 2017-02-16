//
// XIVDB tooltips
//
class XIVDBTooltipsClass
{
	constructor()
    {
		this.version = 1;

		// timer delay
		this.tooltipsTimer = false;
		this.tooltipsDelay = 1000;

		// tooltips queue
		this.queueTimer = false;
		this.queueDelay = 500;

		// vars
		this.onMobile = false;
		this.startTimestamp = null;
	}

	init()
	{
		this.startTimestamp = new Date();

		// validate tooltips
		this.validateTooltipOptions();

		// check for jquery then run get
		XIVDBTooltipsDependency.pass(() => {
			// mobile check
			this.onMobile = $(window).width() <= this.getOption('mobileMinimumWidth') ? true : false;

			// prepare
			XIVDBTooltipsDOM.prepare();

			// get tooltips
			this.get();
		});
	}

	get()
	{
		this.startTimestamp = new Date();

		clearTimeout(this.queue);
		this.queue = setTimeout(() => {
			// detect links
			XIVDBTooltipsLinks.detect();
			let links = XIVDBTooltipsLinks.links;

			if (links) {
				this.query(links, (tooltips) => {
					// tooltip completed event
                    if (CompletedEvent = XIVDBTooltips.getOption('event_tooltipsLoaded')) {
                        CompletedEvent(tooltips);
                    }

					// inject tooltips into dom
                    XIVDBTooltipsDOM.inject(tooltips);
				});
			}

		}, this.queueDelay);
	}

	//
	// Query for tooltips
	//
	query(links, callback)
	{
		var list = {};

		// organize all links
        links.each((i, element) =>
        {
            var original = $(element).attr('data-xivdb-key'),
				isset = $(element).attr('data-xivdb-isset'),
                key = original.split('_'),
                type = key[1].toString(),
                id = parseInt(key[2]);

            // if key already processed, don't query it
            if (XIVDBTooltipsHolder.exists(original) && isset) {
                return;
            }

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
        for(var i in list) {
            list[i] = list[i].join(',');
        }

		// query tooltips
        if (Object.keys(list).length > 0)
		{
			// query tooltips
	        $.ajax({
	            url: `${XIVDBTooltips.getOption('source')}/tooltip?t=${Date.now()}`,
				method: 'POST',
				dataType: 'json',
				cache: true,
				data: {
	                list: list,
	                language: this.getOption('language'),
	            },

				// on success
	            success: (tooltips) =>
	            {
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
	            error: (data, status, code) =>
	            {
	                console.error('----------------');
	                console.error('Error loading tooltips!');
	                console.error(data.responseText);
	                console.error(status, code);
	                console.error('----------------');
	            },
			});
		}
	}

	//
    // Get delayed
    //
    getDelayed()
    {
        clearTimeout(this.tooltipsTimer);
        this.tooltipsTimer = setTimeout(() => {
            XIVDBTooltips.get();
        }, this.tooltipsDelay);
    }

	//
    // Hide tooltips
    //
    hide()
    {
        XIVDBTooltipsDOM.hide();
    }

	// ------------------------------------------------------------------

	//
	// Get a cache time
	//
	cachetime()
	{
		let date = new Date();
		return `${date.getFullYear()}${date.getDate()}`;
	}

	//
    // Set the options
    //
    setOptions(options)
    {
        // Options passed
        this.options = options;

        // if window location is on xivdb, then remove credit
        if (window.location.href.indexOf(this.xivdb) > -1) {
            this.options.includeCredits = false;
        }

		return this;
    }

    //
    // Get an option
    //
    getOption(setting)
    {
        return this.options[setting];
    }

    //
    // Verifies tooltips options and sets the default on missing ones
    //
    validateTooltipOptions()
    {
        for(var option in xivdb_tooltips_default) {
            if (typeof this.options[option] === 'undefined') {
                this.options[option] = xivdb_tooltips_default[option];
            }
        }
    }
}
