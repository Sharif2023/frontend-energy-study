

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.58f3503c.js","_app/immutable/chunks/scheduler.4254ac95.js","_app/immutable/chunks/index.bc8d4372.js","_app/immutable/chunks/stores.67f144f6.js","_app/immutable/chunks/singletons.86268139.js","_app/immutable/chunks/index.8efa1a15.js"];
export const stylesheets = [];
export const fonts = [];
