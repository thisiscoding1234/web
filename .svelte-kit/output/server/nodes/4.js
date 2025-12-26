import * as universal from '../entries/pages/authenticate/callback/_page.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/authenticate/callback/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/authenticate/callback/+page.js";
export const imports = ["_app/immutable/nodes/4.57ba1237.js","_app/immutable/chunks/scheduler.dfe21b3d.js","_app/immutable/chunks/index.d8e63cd2.js","_app/immutable/chunks/singletons.9b56f17a.js","_app/immutable/chunks/index.6f6508f3.js","_app/immutable/chunks/supabase.ed06c84b.js","_app/immutable/chunks/_commonjsHelpers.23102255.js"];
export const stylesheets = ["_app/immutable/assets/4.906ebe38.css"];
export const fonts = [];
