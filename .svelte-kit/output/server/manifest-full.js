export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["backgrounds/bg-1.jpg","icons/android-chrome-192x192.png","icons/android-chrome-256x256.png","icons/android-chrome-384x384.png","icons/apple-touch-icon.png","icons/browserconfig.xml","icons/favicon-16x16.png","icons/favicon-32x32.png","icons/favicon.ico","icons/logo.svg","icons/mstile-150x150.png","icons/safari-pinned-tab.svg","iphones.webm","iphones.webp","js/bootstrap.bundle.min.js","js/bootstrap.bundle.min.js.map","js/jquery-3.7.1.min.js","js/jquery-ui/AUTHORS.txt","js/jquery-ui/LICENSE.txt","js/jquery-ui/external/jquery/jquery.js","js/jquery-ui/images/ui-icons_444444_256x240.png","js/jquery-ui/images/ui-icons_555555_256x240.png","js/jquery-ui/images/ui-icons_777620_256x240.png","js/jquery-ui/images/ui-icons_777777_256x240.png","js/jquery-ui/images/ui-icons_cc0000_256x240.png","js/jquery-ui/images/ui-icons_ffffff_256x240.png","js/jquery-ui/index.html","js/jquery-ui/jquery-ui.css","js/jquery-ui/jquery-ui.js","js/jquery-ui/jquery-ui.min.css","js/jquery-ui/jquery-ui.min.js","js/jquery-ui/jquery-ui.structure.css","js/jquery-ui/jquery-ui.structure.min.css","js/jquery-ui/jquery-ui.theme.css","js/jquery-ui/jquery-ui.theme.min.css","js/jquery-ui/package.json","js/lazysizes-5.3.2.min.js","misc/chat.webp","site.webmanifest"]),
	mimeTypes: {".jpg":"image/jpeg",".png":"image/png",".xml":"application/xml",".svg":"image/svg+xml",".webm":"video/webm",".webp":"image/webp",".js":"application/javascript",".map":"application/json",".txt":"text/plain",".html":"text/html",".css":"text/css",".json":"application/json",".webmanifest":"application/manifest+json"},
	_: {
		client: {"start":"_app/immutable/entry/start.48567966.js","app":"_app/immutable/entry/app.545dac46.js","imports":["_app/immutable/entry/start.48567966.js","_app/immutable/chunks/scheduler.dfe21b3d.js","_app/immutable/chunks/singletons.c2550fe8.js","_app/immutable/chunks/index.6f6508f3.js","_app/immutable/entry/app.545dac46.js","_app/immutable/chunks/scheduler.dfe21b3d.js","_app/immutable/chunks/index.d8e63cd2.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js')),
			__memo(() => import('./nodes/6.js')),
			__memo(() => import('./nodes/7.js')),
			__memo(() => import('./nodes/8.js')),
			__memo(() => import('./nodes/9.js')),
			__memo(() => import('./nodes/10.js')),
			__memo(() => import('./nodes/11.js')),
			__memo(() => import('./nodes/12.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/authenticate",
				pattern: /^\/authenticate\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/authenticate/callback",
				pattern: /^\/authenticate\/callback\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/chat",
				pattern: /^\/chat\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/chat/view",
				pattern: /^\/chat\/view\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/policies/privacy",
				pattern: /^\/policies\/privacy\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/policies/technical",
				pattern: /^\/policies\/technical\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/policies/terms",
				pattern: /^\/policies\/terms\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/policies/terms/legal",
				pattern: /^\/policies\/terms\/legal\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 10 },
				endpoint: null
			},
			{
				id: "/profile",
				pattern: /^\/profile\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 11 },
				endpoint: null
			},
			{
				id: "/tests/infinite_scrollbars",
				pattern: /^\/tests\/infinite_scrollbars\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 12 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
}
})();
