

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/about/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.8cd350f2.js","_app/immutable/chunks/scheduler.4254ac95.js","_app/immutable/chunks/index.bc8d4372.js"];
export const stylesheets = [];
export const fonts = [];
