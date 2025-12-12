<template>
  <div class="stats">
    <span>Total Items: <span id="item-count">{{ itemCount }}</span></span>
    <span>Widgets Active: 25</span>
    <span>Widget Refreshes: <span id="widget-refresh-count">{{ store.widgetRefreshCounter }}</span></span>
    <span>Page Loads: <span id="page-count">{{ store.pageLoads }}</span></span>
  </div>
</template>

<script>
import { store } from '../store'

export default {
  name: 'StatsPanel',
  props: {
    itemCount: {
      type: Number,
      default: 0
    }
  },
  setup() {
    return {
      store
    }
  }
}
</script>
