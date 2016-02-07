//
// XIVDB tooltips
//
class XIVDBTooltipsClass
{
    constructor(options)
    {
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
    // Start XIVDB tooltips
    //
    initialize()
    {
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
        XIVDBTooltipsDependency.passed(() =>
        {
            // Handle responsiveness
            XIVDBTooltipsDevice.handleResponsive();

            // prepare the dom
            XIVDBTooltipsDOM.prepare();

            // we've initialized
            this.hasInitialized = true;

            // get tooltips
            this.get();
        });
    }

    //
    // Get version
    //
    getVersion()
    {
        return this.version;
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
        for(var option in xivdb_tooltips_default)
        {
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
    get()
    {
        if (!this.hasInitialized || XIVDBTooltipsDevice.isOnMobile()) {
            return;
        }

        // Begin
        XIVDBTooltipsUrls.parse();

        // get links, and verify its length
        if (links = XIVDBTooltipsUrls.getLinks())
        {
            // get tooltips for the links
            XIVDBTooltipsQuery.get(links, (tooltips) =>
            {
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
    hide()
    {
        XIVDBTooltipsDOM.hide();
    }
}