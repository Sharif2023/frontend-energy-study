

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/contact/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/4.3e46b5d1.js","_app/immutable/chunks/scheduler.4254ac95.js","_app/immutable/chunks/index.bc8d4372.js"];
export const stylesheets = [];
export const fonts = [];
