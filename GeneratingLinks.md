Generating Good XIVDB Links
====================

If you generate your XIVDB links it makes it easier for Google to search your site and provides the best SEO. We would appreciate tooltips not being just "xivdb.com/?item/123".

Here a function which you could use to create a very good link:

**Function xivdb_link**

```php
// Returns a well formed XIVDB Link
function xivdb_link($Page, $Arguments = NULL)
{
	$Link = "http://xivdb.com/?". strtolower($Page);
	if ($Arguments && is_array($Arguments))
	{
		$i = 0;
		foreach($Arguments as $A)
		{
			$Arguments[$i] = str_ireplace(" ", "-", $A);
			$i++;	
		}
		if ($Arguments) { $Link .= '/'. implode("/", $Arguments); }
	}
	return $Link;	
}
```

**Usage**

```php
// Data about the link
$id = 1234;
$name = 'Hello World';
$type = 'item';

// Print the link
echo '<a href="'. xivdb_link($type, [$id, $name]) .'">'. $name .'</a>';
// > http://xivdb.com/?item/1234/Hello-World
```

