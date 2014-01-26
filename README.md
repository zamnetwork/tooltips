XIVDB-Tooltips
==============

This repository is to supply code examples and help bug report the XIVDB Tooltips: http://xivdb.com/?tooltip

**Info**
- Version: 1.6
- Live: http://xivdb.com/tooltips.js?v=1.6
- Dev: http://xivtooltips.com/tooltips.js?v=1.6

**Requirements**
- The ability to link to a hosted javascript file OR insert javascript into the <body> section of a web page
- JQuery 1.8 or higher or non (if non, our tooltip will embed it.)

**Adding the tooltips to your website**
The script has to be included into the <body> section for it to be able to grab link information

```HTML
<html>
	<head>
	...
	</head>
	<body>
		<script type="text/javascript" src="http://xivdb.com/tooltips.js?v=1.6"></script>
		...
	</body>
</html>
```

**Global Options*
You can supply an xivdb_tooltips object with settings that define the initial global setup of how the tooltips should function.

```JS
<script>
// Optional - Change settings (these are defaults)
var xivdb_tooltips =
{
	// The language of the tooltip, please use (in quotes) capitalized abreviations. 
	// Options: 'EN' 'FR' 'DE' and 'JP'
	'language' : 'EN',
	
	// If you want your link to be replaced with the full item name.
	'replaceName' : true,
	
	// If you want the link to be colored to the items rarity, so blue items go blue, rare items go 
	// green, and so on. You might not want this if it conflicts with your website theme.
	'colorName' : true,
	
	// If you want an small icon to appear next to the link. (If you have lots and lots of tooltips
	// being automatically generated, I don't really recommend this as it can increase page load itmes.)
	'showIcon' : true,
}
</script>
```

**Per Link options**
If you dynamically generate links in some way, and you want links to appear differently based on the type, for example on XIVPads I want global settings to be the normal tooltip for comments/chat but on pages where I show gearsets and achievements I only care about the tooltip, you can assign "data" attributes on links to specific how they should look
- data-replacename
- data-colorname
- data-showicon

```HTML
<a href="http://xivdb.com/?item/123/hello-world" data-replacename="0" data-colorname="0" data-showicon="0" >hello world</a>
```

You can also adjust the style of tooltips if you want to tweak the look and feel of the actual tooltip itself. This can be done by simply just modifying the tooltips CSS class tags, here are some examples (I will add them all later on)
```CSS
// Removing the box shadow from the tooltip frame
.xivdb-tooltip-frame { box-shadow: none; }
// Force the color white on the title of the tooltip
.xivdb-tooltip-content-header-data-title { color: #fff !important; }
```



