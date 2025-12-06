import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess({

	}),
	kit: {
		// Using adapter-static for GitHub Pages deployment
		// See https://kit.svelte.dev/docs/adapter-static for more information
		adapter: adapter({
			// GitHub Pages serves from the root or a subdirectory
			pages: 'build',
			assets: 'build',
			fallback: 'index.html',
			precompress: false,
			strict: false
		}),
		paths: {
			// Set base path for GitHub Pages (empty for custom domain or username.github.io)
			base: process.env.BASE_PATH || ''
		}
	}
};

export default config;
