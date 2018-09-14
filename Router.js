import Route from './Route.js';
import View from 'https://oxo.fenzland.com/OvO/0.1/View.js';
import { resolve, traceBack, dirname, } from 'https://oxo.fenzland.com/OsO/0.1/path.js';

const BASE_PATH= Symbol( 'BASE_PATH', );
const PAGE_DIR= Symbol( 'PAGE_DIR', );
const ROUTES= Symbol( 'ROUTES', );
const VIEW= Symbol( 'VIEW', );
const DISPATCH= Symbol( 'DISPATCH', );

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
				return route;
			}
		}
		
		// 404
	}
}
