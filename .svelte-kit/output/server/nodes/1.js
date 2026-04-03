

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.efe3c602.js","_app/immutable/chunks/scheduler.dfe21b3d.js","_app/immutable/chunks/index.d8e63cd2.js","_app/immutable/chunks/stores.cad09f9d.js","_app/immutable/chunks/singletons.816d7212.js","_app/immutable/chunks/index.6f6508f3.js"];
export const stylesheets = [];
export const fonts = [];
