class XIVDBTooltipsDeviceClass
{
    constructor()
    {
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
    // Call this to know if the user is on mobile or not
    //
    isOnMobile()
    {
        return this.onMobile;
    }

    //
    // Set whether the tooltips should load on mobile
    //
    setOptions(options)
    {
        this.mobileIgnore = options.mobileIgnore;
        this.mobileWidth = options.mobileWidth;
    }

    //
    // Handle auto detect of mobile for responsive websites
    //
    handleResponsive()
    {
        // if we're ignoring mobile just return
        if (this.mobileIgnore) {
            return;
        }

        // default initial detection
        this.onMobile = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) <= this.mobileWidth ? true : false;

        // update state on window resize
        $(window).resize(() => {
            this.onMobile = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) <= this.mobileWidth ? true : false;
        });
    }
}