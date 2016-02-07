class XIVDBTooltipsQueryClass
{
    //
    // Get links to query
    //
    get(links, callback)
    {
        // if on mobile, stop
        if (XIVDBTooltipsDevice.isOnMobile()) {
            return;
        }

        // Organise links into types to be sent with the form data
        var list = {};

        // organize all links
        links.each((i, element) =>
        {
            var key = $(element).attr('data-xivdb-key').split('_'),
                type = key[1].toString(), id = parseInt(key[2]);

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
        this.query(list, callback);
    }

    //
    // Query for tooltips
    //
    query(list, callback)
    {
        // if on mobile, stop
        if (XIVDBTooltipsDevice.isOnMobile()) {
            return;
        }

        // query tooltips
        $.ajax({
            url: `${XIVDBTooltips.getOption('xivdb')}/tooltip`,
            method: 'POST',
            dataType: 'json',
            cache: true,
            data: {
                list: list,
                language: XIVDBTooltips.getOption('language'),
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