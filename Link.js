
const ROUTER= Symbol( 'ROUTER', );
const URL_OBJ= Symbol( 'URL_OBJ', );

export default class Link extends Function
{
	constructor( router, url, )
	{
		super();
		
		this[ROUTER]= router;
		this[URL_OBJ]= new URL( url, window.location, );
		
		return new Proxy( this, {
			apply( target, context, args, )
			{
				return target.active();
			}
		}, );
	}
	
	toString()
	{
		return this.url;
	}
	
	get urlObj()
	{
		return this[URL_OBJ];
	}
	
	get url()
	{
		return this[URL_OBJ].href;
	}
	
	get path()
	{
		return this[URL_OBJ].pathname;
	}
	
	get query()
	{
		return this[URL_OBJ].searchParams;
	}
	
	get anchor()
	{
		return this[URL_OBJ].hash;
	}
	
	active()
	{
		return this[ROUTER].goto( this, );
	}
}
