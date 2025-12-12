<script>
  import { widgetRefreshCounter, pageLoads } from '../stores/appStore.js';
  
  export let itemCount = 0;
</script>

<div class="stats">
  <span>Total Items: <span id="item-count">{itemCount}</span></span>
  <span>Widgets Active: 25</span>
  <span>Widget Refreshes: <span id="widget-refresh-count">{$widgetRefreshCounter}</span></span>
  <span>Page Loads: <span id="page-count">{$pageLoads}</span></span>
</div>
