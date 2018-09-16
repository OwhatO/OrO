import Route from './Route.js';
import History from './History.js';
import View from 'https://oxo.fenzland.com/OvO/0.1/View.js';
import { resolve, traceBack, dirname, current, } from 'https://oxo.fenzland.com/OsO/0.1/path.js';

const BASE_PATH= Symbol( 'BASE_PATH', );
const PAGE_DIR= Symbol( 'PAGE_DIR', );
const HISTORY= Symbol( 'HISTORY', );
const ROUTES= Symbol( 'ROUTES', );
const VIEW= Symbol( 'VIEW', );
const WINDOW= Symbol( 'WINDOW', );
const DISPATCH= Symbol( 'DISPATCH', );
const CURRENT= Symbol( 'CURRENT', );
const RENDER= Symbol( 'RENDER', );

export default class Router
{
	constructor( basePath='/', pageDIr='/pages', )
	{
		const baseOn= dirname( traceBack(), );
		
		this[BASE_PATH]= uniformPath( new URL( basePath, baseOn, ).pathname, );
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
	 * @param Object params.*.follows
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
			let { path, page=name, title=name, follows, }= typeof param ==='string'? { path:param, } : param;
			
			if( preName ) name= `${preName}.${name}`;
			if( prePath ) path= uniformPath( `${prePath.replace( /\/$/, '', )}${path}`, );
			if( prePage ) page= resolve( prePage, page, );
			
			const route= new Route( name, title, path, page, );
			
			this[ROUTES].set( name, route, );
			
			if( follows )
				this.route( follows, { preName:name, prePath:path, prePage:page, }, );
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
		this[HISTORY]= new History( window, route.name, );
		
		window.addEventListener( 'popstate', e=>{
			this[HISTORY].moveTo( e.state, );
			this[DISPATCH]( window.location.pathname, window.location.search, window.location.hash, );
		}, );
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
	
	/**
	 * Goto another page.
	 * 
	 * @param Link link
	 * 
	 * @return void
	 */
	goto( link, )
	{
		const route= this[DISPATCH]( link.path, '', '', );
		
		if(!( route )) return false;
		
		
		this[HISTORY].push( route.name, link.url, );
		
		return true;
	}
	
	reload()
	{
		this[DISPATCH]( this[WINDOW].location.pathname, this[WINDOW].location.search, this[WINDOW].location.hash, );
	}
	
	get history()
	{
		return this[HISTORY];
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
		path= uniformPath( path, );
		
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

function uniformPath( path, )
{
	return path.replace( /(?:^(\/)|\/$)/g, '$1', );
}
