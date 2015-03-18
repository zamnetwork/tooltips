Generating Good XIVDB Links
====================

If you generate your XIVDB links it makes it easier for Google to search your site and provides the best SEO. We would appreciate tooltips not being just "xivdb.com/?item/123".

You can use the a hashed API json to get a list of ID's related to a hashed name, below is an example.

```php
// get dump of hashed ID's
$xivdb = json_decode(file_get_contents('http://45.56.73.127/api/?type=item&name=all'), true);

// function to get real id from item name
function getItemId($string)
{
        global $xivdb;
        $string = trim(strip_tags(htmlspecialchars_decode(trim($string), ENT_QUOTES)));
        $string = strtolower($string);
        $string = preg_replace('/[^\w]/', null, $string);
        $string = sha1($string);

        if (isset($xivdb[$string])) {
                return $xivdb[$string];
        }
        
        return false;
}

$id = getItemId('X-Potion');
```

Alternatively, you could try something like this which fetches a lot of information:

```php
function getItemId($string)
{
        $string = urlencode($string);
        $data = file_get_contents('http://45.56.73.127/api/?type=item&name='. $string);
        return json_decode($data, true);
}

$item = getItemId('X-Potion');
$id = $item['id'];
```

After that, you have the ``` $id ```, you just need to use it, eg:

``` http://xivdb.com/?item/<?=$id;?>/<?=urlencode($itemName);?> ```

