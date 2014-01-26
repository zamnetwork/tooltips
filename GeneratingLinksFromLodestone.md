Generating Links from Lodestone Profiles
==============

If parse the Lodestone for profile data (using something like my Lodestone API: https://github.com/viion/XIVPads-LodestoneAPI) then you may need way to generate the correct ID based on the item name. This is very simple to do but requires a bit of ID looking up to get correct. The process below is the one I use on XIVPads:

On XIVPads I host a json file that contains all items in MD5 format, with their respective ID's, it is a simple array with the MD5 as the index and the ID as the value, this can be found here:

- http://xivpads.com/items.json

**Getting started**

Obtain the list of IDs

```php
// Obtain the array: [MD] => ID
$itemids = json_deocde(file_get_contents("items.json"), true);

// Format the item name from Lodestone into MD5
$mdname = md5(strtolower($item_name));

// Get the real id that can be used for XIVDB
$realid = $itemids[$mdname];
```

If you use our best practices for generating an XIVDB link found here: [Generating Good XIVDB Links](https://github.com/viion/XIVDB-Tooltips/blob/master/GeneratingLinks.md) you can then do the following:

```php
echo '<a href="'. xivdb_link('item', [$realid, $item_name]) .'">'. $item_name .'</a>';
```

