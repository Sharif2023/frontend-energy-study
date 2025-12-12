

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.06913667.js","_app/immutable/chunks/scheduler.4254ac95.js","_app/immutable/chunks/index.bc8d4372.js","_app/immutable/chunks/index.8efa1a15.js"];
export const stylesheets = [];
export const fonts = [];
