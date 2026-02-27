

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/authenticate/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.c8446f87.js","_app/immutable/chunks/scheduler.dfe21b3d.js","_app/immutable/chunks/index.d8e63cd2.js","_app/immutable/chunks/stores.95b0f47e.js","_app/immutable/chunks/singletons.a0ca814d.js","_app/immutable/chunks/index.6f6508f3.js","_app/immutable/chunks/auth.816a7469.js","_app/immutable/chunks/supabase.ed06c84b.js","_app/immutable/chunks/_commonjsHelpers.23102255.js"];
export const stylesheets = ["_app/immutable/assets/3.2652f4dd.css"];
export const fonts = [];
