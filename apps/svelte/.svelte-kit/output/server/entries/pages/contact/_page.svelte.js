import { c as create_ssr_component, i as add_classes, d as add_attribute, e as escape } from "../../../chunks/ssr.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let formData = { name: "", email: "", message: "" };
  let errors = {};
  return `<div class="page"><div class="contact-page"><h1 data-svelte-h="svelte-tbczl2">Contact</h1> <form class="contact-form"><div><input type="text" name="name" placeholder="Your Name"${add_classes((errors.name ? "error" : "").trim())}${add_attribute("value", formData.name, 0)}> ${errors.name ? `<div class="error-message">${escape(errors.name)}</div>` : ``}</div> <div><input type="email" name="email" placeholder="Your Email"${add_classes((errors.email ? "error" : "").trim())}${add_attribute("value", formData.email, 0)}> ${errors.email ? `<div class="error-message">${escape(errors.email)}</div>` : ``}</div> <div><textarea name="message" placeholder="Your Message" rows="5"${add_classes((errors.message ? "error" : "").trim())}>${escape("")}</textarea> ${errors.message ? `<div class="error-message">${escape(errors.message)}</div>` : ``}</div> <button type="submit" data-svelte-h="svelte-7fuxb2">Send Message</button> ${``}</form></div></div>`;
});
export {
  Page as default
};
