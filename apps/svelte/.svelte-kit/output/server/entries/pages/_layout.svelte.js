import { c as create_ssr_component, a as subscribe, v as validate_component } from "../../chunks/ssr.js";
import { p as page } from "../../chunks/stores.js";
const app = "";
const Navigation_svelte_svelte_type_style_lang = "";
const css = {
  code: ".active.svelte-zw9lbq{background-color:#555}",
  map: null
};
const Navigation = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $$result.css.add(css);
  $$unsubscribe_page();
  return `<nav><a href="/" class="${["svelte-zw9lbq", $page.url.pathname === "/" ? "active" : ""].join(" ").trim()}" data-svelte-h="svelte-1cyizk9">Home</a> <a href="/about" class="${["svelte-zw9lbq", $page.url.pathname === "/about" ? "active" : ""].join(" ").trim()}" data-svelte-h="svelte-i3o4jt">About</a> <a href="/contact" class="${["svelte-zw9lbq", $page.url.pathname === "/contact" ? "active" : ""].join(" ").trim()}" data-svelte-h="svelte-10w9tle">Contact</a> </nav>`;
});
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(Navigation, "Navigation").$$render($$result, {}, {}, {})} ${slots.default ? slots.default({}) : ``}`;
});
export {
  Layout as default
};
