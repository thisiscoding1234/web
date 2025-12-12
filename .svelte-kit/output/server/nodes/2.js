

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.c659338c.js","_app/immutable/chunks/scheduler.dfe21b3d.js","_app/immutable/chunks/index.d8e63cd2.js","_app/immutable/chunks/Footer.a010ea1e.js"];
export const stylesheets = ["_app/immutable/assets/2.af20883d.css","_app/immutable/assets/Footer.4e8c418e.css"];
export const fonts = [];
