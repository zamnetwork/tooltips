//
// Handle links
//
class XIVDBTooltipsLinksClass
{
	constructor()
	{
		this.links = null;
	}

	//
	// Detect links onthe page
	//
	detect()
	{
		// tooltip container
        let container = XIVDBTooltips.getOption('linkContainer');

		$(`a, *[data-tooltip-id]`).each((i, element) => {
			let $link = $(element),
                href = $link.attr('href'),
                dataId = $link.attr('data-tooltip-id'),
				type = false,
				id = false;

			if (!dataId) {
                // Skip if:
                // 	 if ignored
                // 	 undefined
                // 	 or too short
                if ($link.attr('data-xivdb-ignore')
					|| typeof href === 'undefined'
					|| href.length < 1) {
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

			if (!dataId)
			{
				// remove any double slashes
                href = href
                    .toString()
                    .toLowerCase()
					.replace('http://', '')
                    .replace('https://', '')
                    .replace('//', '/')
					.replace('?', '')
                    .toString();

				// is the link not an XIVDB link (and not local)
                if (href[0] != '/' && href.indexOf('xivdb.com') == -1) {
                    return;
                }

				// remove url
				href = href.replace('fr.','').replace('de.','').replace('ja.','').replace('cns.','');
				href = href.replace('xivdb.com', '');

				// split up the link and clean it
				href = href.split('/').filter(n => n.toString().length > 0);

				// does a valid type exist
				if (xivdb_tooltips_valid_types.indexOf(href[0]) == -1) {
					return;
				}

				// get type and ID
                type = href[0];
				id = href[1];

				// if url length below two, it isn't valid, as
                // 2 = TYPE and ID
                if (typeof href == 'undefined' || href.length < 2) {
                    return;
                }
			} else {
				dataId = dataId.split('/');

				type = dataId[0];
				id = dataId[1];
            }

			// create a sort of cache key
            let key = `xivdb_${type}_${id}`;

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

		// links will be anything with xivdb key
        this.links = $(`[data-xivdb-key]`);
	}
}
