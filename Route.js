
const NAME= Symbol( 'NAME', );
const TITLE= Symbol( 'TITLE', );
const PATTERN= Symbol( 'PATTERN', );
const PAGE= Symbol( 'PAGE', );

export default class Route
{
	/**
	 * @param String name
	 * @param String title
	 * @param String pattern
	 * @param String page
	 */
	constructor( name, title, pattern, page, )
	{
		this[NAME]= name;
		this[TITLE]= title;
		this[PATTERN]= pattern;
		this[PAGE]= page;
	}
	
	get name()
	{
		return this[NAME];
	}
	
	get title()
	{
		return this[TITLE];
	}
	
	get page()
	{
		return this[PAGE];
	}
}
