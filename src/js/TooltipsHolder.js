//
// Tooltips DOM class
//
class XIVDBTooltipsHolderClass
{
	constructor()
	{
		this.tooltips = {};
	}

	add(id, html)
	{
		this.tooltips[id] = html;
	}

	get(id)
	{
		return this.tooltips[id];
	}

	exists(id)
	{
		return this.tooltips[id] ? true : false;
	}
}
