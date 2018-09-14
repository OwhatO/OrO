
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
	
	/**
	 * Chack if the path matches to this route.
	 * 
	 * @param String path
	 * 
	 * @return Boolean
	 */
	match( path, )
	{
		const matches= this[REG_PATTERN].exec( path, );
		
		if(!( matches ))
			return false;
		
		const params= {};
		
		this[ATTRIBUTES].forEach( attr=> params[attr.name]= conversionType( matches.groups[attr.name]||null, attr.type, ), );
		
		return params;
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

function conversionType( value, type, )
{
	if( type === 'Int' || type === 'Num' )
		return +value;
	else
		return `${value}`;
}
