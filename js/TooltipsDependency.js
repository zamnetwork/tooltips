//
// XIVDB tooltips
//
class XIVDBTooltipsDependencyClass
{
    constructor()
    {
        // Version of jquery to include
        this.jquery = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js';
    }

	pass(callback)
	{
        if (typeof jQuery !== 'undefined') {
            return callback();
        }

        setTimeout(() => {
            if (typeof jQuery === 'undefined') {
    			this.loadScript(this.jquery, () => {
                    if (!$) {
                        var $ = jQuery;
                    }
                    return callback();
                });
    		}
        }, XIVDBTooltips.getOption('jqueryCheckDelay'));
	}

    loadScript(url, callback)
    {
        var script = document.createElement( "script" )
        script.type = "text/javascript";

        if (script.readyState) {
            script.onreadystatechange = function() {
                if ( script.readyState === "loaded" || script.readyState === "complete" ) {
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else {
            script.onload = function() {
                callback();
            };
        }

        script.src = url;
        document.getElementsByTagName('head')[0].appendChild(script);
    }
}
