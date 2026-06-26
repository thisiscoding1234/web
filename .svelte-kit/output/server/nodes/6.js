import * as universal from '../entries/pages/chat/view/_page.js';

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/chat/view/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/chat/view/+page.js";
export const imports = ["_app/immutable/nodes/6.10a7ee0f.js","_app/immutable/chunks/scheduler.dfe21b3d.js","_app/immutable/chunks/index.d8e63cd2.js","_app/immutable/chunks/each.048f5106.js","_app/immutable/chunks/stores.c350bd7a.js","_app/immutable/chunks/singletons.02012ff2.js","_app/immutable/chunks/index.6f6508f3.js","_app/immutable/chunks/Skeleton.160977ac.js","_app/immutable/chunks/supabase.ed06c84b.js","_app/immutable/chunks/_commonjsHelpers.23102255.js"];
export const stylesheets = ["_app/immutable/assets/6.4c3fe0eb.css","_app/immutable/assets/Skeleton.1338545b.css"];
export const fonts = [];
