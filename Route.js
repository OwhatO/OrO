
const NAME= Symbol( 'NAME', );
const TITLE= Symbol( 'TITLE', );
const PATTERN= Symbol( 'PATTERN', );
const REG_PATTERN= Symbol( 'REG_PATTERN', );
const ATTRIBUTES= Symbol( 'ATTRIBUTES', );
const PAGE= Symbol( 'PAGE', );

const typesReg= {
	Int: '\\d+',
	Num: '\\d+(?:.\\d+)?',
	Wrd: '\\w+',
	Alf: '\\a+',
};

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
		[ this[REG_PATTERN], this[ATTRIBUTES], ]= parsePattern( pattern, );
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

function parsePattern( pattern, )
{
	const attributes= [];
	
	const regPattern= new RegExp(
		'^'
	+
		pattern.replace(
			/\{(\w+)(?:\:(\w+))?\}/g,
			( replaced, name, type='Any', )=> (
				attributes.push( { name, type, }, )
			,
				`(?<${name}>${(type?typesReg[type]:null)||'[^\\/]+?'})`
			),
		)
	+
		'$',
	);
	
	return [ regPattern, attributes, ];
}
