OrO
================================

This is a routing solution work with OvO.

## Usage

### Over view

```js
import Router from 'https://oxo.fenzland.com/OrO/0.1/Router.js';

// create a router
const router= new Router();
// Here, we have omitted two parameters.
// the same as `new Router( '/', '/pages', )`.
// the 1st parameter is base url path for routing.
// the 2nd parameter is base path of pages.

// declare routes
router.route( {
	// ...
}, );

// set a container DOM.
router.showIn( document.body, );

// listen to a window.
router.listen( window, );

```

### Declare routes

```js
router.route( {
	
	// simple case
	home: '/',
	// here register a route 
	//   named 'home',
	//   with path '/',
	//   with page 'home.js',
	//   with title 'home',
	
	// page and title different with name
	foo_bar: {
		path: '/foo-bar',
		page: 'foo-bar.page',
		title: 'Foo Bar'
	},
	// here register a route 
	//   named 'foo_bar',
	//   with path '/foo-bar',
	//   with page 'foo-bar.page.js',
	//   with title 'Foo Bar,
	
	// with parameters
	article: '/articles/{articleId:Int}',
	// this route matches /articles/0, /articles/1, and so on.
	
	// nesting
	user: {
		path: '/user',
		
		follows: {
			
			info: '-info',
			// here register a route 
			//   named 'user.info',
			//   with path '/user-info',
			//   with page 'user/info.js',
			//   with title 'info',
		},
	},
	
	// a complex example
	posts: {
		path: '/posts',
		follows: {
			post: {
				path: '/{postId:Int}',
				follows: {
					edit: '/edit',
					reply: '/reply',
					report: '/report',
					replies: {
						path: '/replies',
						reply: {
							path: '/{postId:Int}',
							follows: {
								edit: '/edit',
								reply: '/reply',
								report: '/report',
								replies: '/replies',
							},
						},
					},
				},
			},
		},
	},
	
	// you can define your 404 page like this [optional].
	404: {
		page: 'not-found',
	},
}, );

```


### Links

```js
// build links
const home_link= router.linkTo( 'home', );
const article_1= router.linkTo( 'article', { articleId: 1, }, );
const user_info= router.linkTo( 'user.info', );

// to string
console.log( `${home_link}`, );       // 'https://some.domain/'
console.log( article_1.toString(), ); // 'https://some.domain/articles/1'

// work with OvO
a( { href: home_link, }, 'Home', );
form( { action: article_1, }, 'Home', );
map(
	area( { href: user_info, }, ),
);

// act manually
home_link();
article_1.active();
router.goto( user_info, );

```
