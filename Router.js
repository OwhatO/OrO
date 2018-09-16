import Route from './Route.js';
import View from 'https://oxo.fenzland.com/OvO/0.1/View.js';
import { resolve, traceBack, dirname, current, } from 'https://oxo.fenzland.com/OsO/0.1/path.js';

const BASE_PATH= Symbol( 'BASE_PATH', );
const PAGE_DIR= Symbol( 'PAGE_DIR', );
const ROUTES= Symbol( 'ROUTES', );
const VIEW= Symbol( 'VIEW', );
const WINDOW= Symbol( 'WINDOW', );
const DISPATCH= Symbol( 'DISPATCH', );
const CURRENT= Symbol( 'CURRENT', );
const RENDER= Symbol( 'RENDER', );

export default class Router
{
	constructor( basePath, pageDIr, )
	{
		const baseOn= dirname( traceBack(), );
		
		this[BASE_PATH]= new URL( resolve( baseOn, basePath, ), ).pathname.replace( /\/$/, '', );
		this[PAGE_DIR]= resolve( baseOn, pageDIr, );
		this[ROUTES]= new Map;
	}
	
	/**
	 * Set a DOM as route container. and create a VIEW.
	 * 
	 * @param String params.[name]
	 * @param String params.*.path
	 * @param String params.*.page
	 * @param String params.*.title
	 * @param Object params.*.follow
	 * 
	 * @param String options.*.preName
	 * @param String options.*.prePath
	 * @param String options.*.prePage
	 * 
	 * @return void
	 */
	route( params, { preName='', prePath=this[BASE_PATH], prePage='', }={}, )
	{
		for( let name in params )
		{
			const param= params[name];
			let { path, page=name, title=name, follow, }= typeof param ==='string'? { path:param, } : param;
			
			if( preName ) name= `${preName}.${name}`;
			if( prePath ) path= `${prePath}${path}`;
			if( prePage ) page= resolve( prePage, page, );
			
			const route= new Route( name, title, path, page, );
			
			this[ROUTES].set( name, route, );
			
			if( follow )
				this.route( follow, { preName:name, prePath:path, prePage:page, }, );
		}
	}
	
	/**
	 * Set a DOM as route container. and create a VIEW.
	 * 
	 * @param Element container
	 * 
	 * @return void
	 */
	showIn( container, )
	{
		this[VIEW]= new View( container, );
	}
	
	/**
	 * Listen to the BOM window.
	 * 
	 * @param Window window
	 * 
	 * @return void
	 */
	listen( window, )
	{
		const route= this[DISPATCH]( window.location.pathname, window.location.search, window.location.hash, );
		
		this[WINDOW]= window;
	}
	
	/**
	 * Build a link to route.
	 * 
	 * @param String routeName
	 * @param Object params
	 * 
	 * @return Link
	 */
	linkTo( routeName, params, )
	{
		if( routeName.startsWith( '.', ) )
			routeName= this.resolve( this[CURRENT].name, routeName, );
		
		const route= this[ROUTES].get( routeName, )
		
		if(!( route ))
			throw `Route ${routeName} is not defiend.`;
		
		return route.buildLink( this, params, );
	}
	
	resolve( base, name, )
	{
		if( name.startsWith( '..', ) )
			return this.resolve( base.replace( /(?:^|\.)\w+$/, '', ), name.replace( /^\./, '', ), );
		else
		if( name.startsWith( '.', ) )
			return `${base}${name}`;
		else
			return name;
	}
	
	reload()
	{
		this[DISPATCH]( this[WINDOW].location.pathname, this[WINDOW].location.search, this[WINDOW].location.hash, );
	}
	
	get current()
	{
		return this[CURRENT];
	}
	
	/**
	 * Dispatch with url.
	 * 
	 * @private
	 */
	[DISPATCH]( path, query, anchor, )
	{
		for( let [ name, route, ] of this[ROUTES] )
		{
			let matches= route.match( path, );
			
			if( matches )
			{
				this[CURRENT]= route;
				
				this[RENDER]( route, matches, query, anchor, );
				
				return route;
			}
		}
		
		// 404
		{
			const route404= this[ROUTES].achieve(
				'404',
				()=> new Route( '404', 'Not Found', '', resolve( dirname( current(), ), './404.page', ), ),
			);
			
			this[CURRENT]= route404;
			
			this[RENDER]( route404, {}, query, anchor, );
			
			return route404;
		}
	}
	
	async [RENDER]( route, params, query, anchor, )
	{
		const pageName= route.page;
		
		// Render the PAGE and update the VIEW (async)
		const page= await import(resolve( this[PAGE_DIR], pageName.replace( /^\//, '', )+'.js'))
		
		if(!( page.render && page.render instanceof Function ))
			throw new Error( 'A page must export function render()', );
		
		this[VIEW].update(
			page.render( { params, query, anchor, }, ),
		);
	}
}
