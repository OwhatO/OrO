import { h1, } from '../view/HTML.js';

export function render()
{
	document.title= '404 Not Found';
	
	return [
		h1( '404 Not Found', ),
	];
}
