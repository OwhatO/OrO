import { resolve, traceBack, dirname, } from 'https://oxo.fenzland.com/OsO/0.1/path.js';

const BASE_PATH= Symbol( 'BASE_PATH', );
const PAGE_DIR= Symbol( 'PAGE_DIR', );
const ROUTES= Symbol( 'ROUTES', );

export default class Router
{
	constructor( basePath, pageDIr, )
	{
		const baseOn= dirname( traceBack(), );
		
		this[BASE_PATH]= new URL( resolve( baseOn, basePath, ), ).pathname.replace( /\/$/, '', );
		this[PAGE_DIR]= resolve( baseOn, pageDIr, );
		this[ROUTES]= new Map;
	}
}
