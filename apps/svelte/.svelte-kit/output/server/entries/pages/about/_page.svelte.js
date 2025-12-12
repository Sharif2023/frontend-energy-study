import { c as create_ssr_component } from "../../../chunks/ssr.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<div class="page" data-svelte-h="svelte-1660e5x"><div class="about-page"><h1>About</h1> <p>This application is part of a research study on energy consumption comparison
      of modern JavaScript frameworks: React, Vue, Angular, and Svelte.</p> <h2>Research Objectives</h2> <ul><li>Measure energy consumption across different frameworks</li> <li>Analyze performance metrics (render time, memory usage, DOM mutations)</li> <li>Compare framework efficiency at different workload scales</li> <li>Provide empirical data for green computing practices</li></ul> <h2>Methodology</h2> <p>The study uses RAPL-compatible tools (Scaphandre, Joulemeter, or external power meters)
      to collect energy measurements. Test applications are built identically across all frameworks
      to ensure fair comparison.</p></div></div>`;
});
export {
  Page as default
};
