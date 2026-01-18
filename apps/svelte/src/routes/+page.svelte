<script>
  import { onMount } from 'svelte';
  import { incrementPageLoads, incrementItemCounter, decrementItemCounter, refreshWidgets } from '../lib/stores/appStore.js';
  import StatsPanel from '../lib/components/StatsPanel.svelte';
  import ItemList from '../lib/components/ItemList.svelte';
  import WeatherWidget from '../lib/components/WeatherWidget.svelte';
  import PlaceholderWidget from '../lib/components/PlaceholderWidget.svelte';
  
  let items = [];
  let itemIdCounter = 0;
  const widgetIds = Array.from({ length: 24 }, (_, i) => i + 2);
  
  onMount(() => {
    incrementPageLoads();
  });
  
  function handleAddItems(event) {
    const amount = event.detail;
    const currentLength = items.length;
    const newItems = Array.from({ length: amount }, (_, i) => ({
      id: ++itemIdCounter,
      name: `Item ${currentLength + i + 1}`
    }));
    items = [...items, ...newItems];
    incrementItemCounter(amount);
  }
  
  function handleRemoveItems(event) {
    const amount = event.detail;
    const removed = items.slice(0, amount);
    items = items.slice(amount);
    decrementItemCounter(removed.length);
  }
  
  function handleRefreshWidgets() {
    refreshWidgets();
  }
</script>

<div class="page">
  <StatsPanel itemCount={items.length} />
  
  <div class="controls">
    <button id="refresh-widgets" on:click={handleRefreshWidgets}>
      Refresh Widgets
    </button>
  </div>

  <div class="dashboard" id="widget-grid">
    <WeatherWidget />
    {#each widgetIds as id}
      <PlaceholderWidget {id} />
    {/each}
  </div>

  <ItemList 
    {items}
    on:addItems={handleAddItems}
    on:removeItems={handleRemoveItems}
  />
</div>