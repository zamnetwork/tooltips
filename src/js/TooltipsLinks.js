class XIVDBTooltipsUrlsClass
{
    constructor()
    {
        this.links = {};
    }

    //
    // Get urls
    //
    getLinks()
    {
        return this.links.length > 0 ? this.links : false;
    }

    //
    // Parse links in the page
    //
    parse()
    {
        // reset links (existing ones will have already been processed)
        this.links = {};

        // tooltip container
        var container = XIVDBTooltips.getOption('linkContainer');

        // go through all links and find XIVDB links
        $(`${container} a, ${container} *[data-tooltip-id]`).each((i, element) => {
            var $link = $(element),
                href = $link.attr('href'),
                dataId = $link.attr('data-tooltip-id');

            if (!dataId) {
                // check if the link is ignored
                if ($link.attr('data-xivdb-ignore')) {
                    return;
                }

                // is the link empty?
                if (typeof href === 'undefined' || href.length < 1) {
                    return;
                }
            }

            // ignore if already processed before
            if ($link.attr('data-xivdb-tooltip')) {
                return;
            }

            // check for hidden link condition
            if (!XIVDBTooltips.getOption('includeHiddenLinks') && !$link.is(':visible')) {
                return;
            }

            if (!dataId) {
                // remove any double slashes
                href = href
                    .toString()
                    .toLowerCase()
                    .replace('//', '/')
                    .replace('http:', '')
                    .replace('https:', '')
                    .toString();

                // is the link not an XIVDB link (and not local)
                if (href[0] != '/' && href.indexOf(XIVDBTooltips.getOption('xivdb')) == -1) {
                    return;
                }

                // remove url
                href = href.replace('fr.','').replace('de.','').replace('ja.','');
                href = href.replace('xivdb.com', '');

                // split up the link and clean it
                href = href.split('/').filter(n => n.toString().length > 0);

                // does a valid type exist
                if (xivdb_tooltips_valid_types.indexOf(href[0]) == -1) {
                    return;
                }

                // get type and ID
                var type = href[0].replace('?', ''),
                    id = href[1];

                // fix dated links
                if (href.indexOf('.com/?') > -1) {
                    href = href.replace('.com/?', '.com/');
                    $link.attr('href', href.toString());
                }

                // if url length below two, it isn't valid, as
                // 2 = TYPE and ID
                if (typeof href == 'undefined' || href.length < 2) {
                    return;
                }
            } else {
                var dataId = dataId.split('/'),
                    type = dataId[0],
                    id = dataId[1];
            }

            // create a sort of cache key
            var key = `xivdb_${type}_${id}`;

            // attach the key to the element, (or the parent element)
            // we also check we havent added the key before
            if ($link.attr('data-xivdb-parent') && !$link.attr('data-xivdb-key'))
            {
                // add the key to the parent element
                return $link.parents($link.attr('data-xivdb-parent')).attr('data-xivdb-key', key);
            }
            else if (!$link.attr('data-xivdb-parent'))
            {
                // add the key to the element
                return $link.attr('data-xivdb-key', key);
            }
        });

        // if including hidden links, we just get all
        // else we have to filter via visibility
        this.links = XIVDBTooltips.getOption('includeHiddenLinks')
            ? $(`${XIVDBTooltips.getOption('linkContainer')} [data-xivdb-key]`)
            : $(`${XIVDBTooltips.getOption('linkContainer')} [data-xivdb-key]:visible`);
    }
}
