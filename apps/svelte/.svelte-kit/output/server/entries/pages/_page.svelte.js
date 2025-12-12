import { c as create_ssr_component, a as subscribe, e as escape, b as createEventDispatcher, d as add_attribute, f as each, v as validate_component } from "../../chunks/ssr.js";
import { w as writable } from "../../chunks/index.js";
const widgetRefreshCounter = writable(0);
const pageLoads = writable(0);
const StatsPanel = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $widgetRefreshCounter, $$unsubscribe_widgetRefreshCounter;
  let $pageLoads, $$unsubscribe_pageLoads;
  $$unsubscribe_widgetRefreshCounter = subscribe(widgetRefreshCounter, (value) => $widgetRefreshCounter = value);
  $$unsubscribe_pageLoads = subscribe(pageLoads, (value) => $pageLoads = value);
  let { itemCount = 0 } = $$props;
  if ($$props.itemCount === void 0 && $$bindings.itemCount && itemCount !== void 0)
    $$bindings.itemCount(itemCount);
  $$unsubscribe_widgetRefreshCounter();
  $$unsubscribe_pageLoads();
  return `<div class="stats"><span>Total Items: <span id="item-count">${escape(itemCount)}</span></span> <span data-svelte-h="svelte-7qy55k">Widgets Active: 25</span> <span>Widget Refreshes: <span id="widget-refresh-count">${escape($widgetRefreshCounter)}</span></span> <span>Page Loads: <span id="page-count">${escape($pageLoads)}</span></span></div>`;
});
const ItemList = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let filteredAndSortedItems;
  let { items = [] } = $$props;
  createEventDispatcher();
  let addAmount = 100;
  if ($$props.items === void 0 && $$bindings.items && items !== void 0)
    $$bindings.items(items);
  filteredAndSortedItems = (() => {
    let result = [...items];
    {
      result.sort((a, b) => a.id - b.id);
    }
    return result;
  })();
  return `<div><div class="controls"><input id="item-input" type="number" min="10" max="500"${add_attribute("value", addAmount, 0)}> <button id="add-btn">Add ${escape(addAmount)} Items</button> <button id="remove-btn" data-svelte-h="svelte-ef0j8s">Remove 50 Items</button> <button id="filter-btn">${escape('Filter "Item"')}</button> <button id="sort-btn">Sort by ${escape("Name")}</button></div> <div class="item-list"><h3>Dynamic Items (<span id="list-count">${escape(filteredAndSortedItems.length)}</span>)</h3> <ul id="item-list">${each(filteredAndSortedItems, (item) => {
    return `<li class="item"><span>ID: ${escape(item.id)}</span> <span>${escape(item.name)}</span> </li>`;
  })}</ul></div></div>`;
});
const WeatherWidget = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_widgetRefreshCounter;
  $$unsubscribe_widgetRefreshCounter = subscribe(widgetRefreshCounter, (value) => value);
  let weatherData = null;
  let loading = true;
  let error = null;
  async function fetchWeather() {
    loading = true;
    error = null;
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      weatherData = {
        name: "London",
        main: {
          temp: (Math.random() * 30 + 10).toFixed(1),
          humidity: Math.floor(Math.random() * 40 + 40)
        },
        weather: [
          {
            description: ["sunny", "cloudy", "rainy", "clear"][Math.floor(Math.random() * 4)]
          }
        ]
      };
    } catch (err) {
      error = "Failed to fetch weather";
      console.error("Weather API error:", err);
    } finally {
      loading = false;
    }
  }
  {
    fetchWeather();
  }
  $$unsubscribe_widgetRefreshCounter();
  return `<div class="widget weather"><h3 data-svelte-h="svelte-1fje5vi">Weather</h3> <div id="weather-data">${loading ? `<div data-svelte-h="svelte-194gxkm">Loading...</div>` : `${error ? `<div>${escape(error)}</div>` : `${weatherData ? `<div><div><strong>${escape(weatherData.name)}</strong></div> <div>Temp: ${escape(weatherData.main.temp)}°C</div> <div>Humidity: ${escape(weatherData.main.humidity)}%</div> <div>${escape(weatherData.weather[0].description)}</div></div>` : ``}`}`}</div></div>`;
});
const PlaceholderWidget = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_widgetRefreshCounter;
  $$unsubscribe_widgetRefreshCounter = subscribe(widgetRefreshCounter, (value) => value);
  let { id } = $$props;
  const colors = [
    "#ff6b6b",
    "#4ecdc4",
    "#45b7d1",
    "#f9ca24",
    "#f0932b",
    "#eb4d4b",
    "#6c5ce7",
    "#a29bfe"
  ];
  const color = colors[id % colors.length];
  let number = Math.floor(Math.random() * 1e3);
  function updateNumber() {
    number = Math.floor(Math.random() * 1e3);
  }
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  {
    updateNumber();
  }
  $$unsubscribe_widgetRefreshCounter();
  return `<div class="widget"${add_attribute("data-id", id, 0)} style="${"border-top: 4px solid " + escape(color, true)}"><h3>Widget ${escape(id)}</h3> <div style="${"font-size: 32px; font-weight: bold; color: " + escape(color, true)}">${escape(number)}</div></div>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let items = [];
  const widgetIds = Array.from({ length: 24 }, (_, i) => i + 2);
  return `<div class="page">${validate_component(StatsPanel, "StatsPanel").$$render($$result, { itemCount: items.length }, {}, {})} <div class="controls"><button id="refresh-widgets" data-svelte-h="svelte-g9byf1">Refresh Widgets</button></div> <div class="dashboard" id="widget-grid">${validate_component(WeatherWidget, "WeatherWidget").$$render($$result, {}, {}, {})} ${each(widgetIds, (id) => {
    return `${validate_component(PlaceholderWidget, "PlaceholderWidget").$$render($$result, { id }, {}, {})}`;
  })}</div> ${validate_component(ItemList, "ItemList").$$render($$result, { items }, {}, {})}</div>`;
});
export {
  Page as default
};
