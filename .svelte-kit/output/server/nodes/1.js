

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.adfb1a09.js","_app/immutable/chunks/scheduler.dfe21b3d.js","_app/immutable/chunks/index.d8e63cd2.js","_app/immutable/chunks/stores.f0e58cd8.js","_app/immutable/chunks/singletons.a37bdec6.js","_app/immutable/chunks/index.6f6508f3.js"];
export const stylesheets = [];
export const fonts = [];
