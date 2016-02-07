//
// XIVDB tooltips
//
class XIVDBTooltipsDependencyClass
{
    constructor()
    {
        // Version of jquery to include
        this.jquery = 'https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js';

        // Version of Font Awesome to include (they're used in the tooltip)
        this.fa = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.5.0/css/font-awesome.min.css';
    }

    //
    // When tooltips pass
    //
    passed(callback)
    {
        // check for jquery, if it does not exist this will
        // embed it into the head using the version above.
        this.checkForJquery();


        // if jquery has not loaded, delay initialize
        if (typeof $ === 'undefined')
        {
            return setTimeout(() =>
            {
                if (typeof $ === 'undefined') {
                    return console.error('jquery could not be embedded, tooltips cannot run');
                }

                // check for font awesome
                this.checkForFontAwesome();

                return callback();
            }, 500);
        }

        return callback();
    }

    //
    // Check for jquery
    //
    checkForJquery()
    {
        if (typeof $ === 'undefined' || !window.jQuery) {
            var jq = document.createElement('script');
            jq.type = 'text/javascript';
            jq.src = this.jquery;
            document.getElementsByTagName('head')[0].appendChild(jq);
            return true;
        }

        // return true of false
        return $ ? true : false;
    }

    //
    // Check for font awesome
    //
    checkForFontAwesome()
    {
        // check for FA link
        if ($(`link[href="${this.fa}"]`).length == 0)
        {
            var AppendNewStyle = document.createElement('link');
            AppendNewStyle.setAttribute('href', this.fa);
            AppendNewStyle.setAttribute('rel', 'stylesheet');
            AppendNewStyle.setAttribute('type', 'text/css');
            $('head')[0].appendChild(AppendNewStyle);
        }
    }
}