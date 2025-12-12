

export const index = 12;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/tests/infinite_scrollbars/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/12.fb50b1f9.js","_app/immutable/chunks/scheduler.dfe21b3d.js","_app/immutable/chunks/each.048f5106.js","_app/immutable/chunks/index.d8e63cd2.js","_app/immutable/chunks/_commonjsHelpers.23102255.js"];
export const stylesheets = ["_app/immutable/assets/12.7bcf4acc.css"];
export const fonts = [];
