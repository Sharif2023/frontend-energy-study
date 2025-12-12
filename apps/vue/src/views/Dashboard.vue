<template>
  <div class="page">
    <StatsPanel :item-count="items.length" />
    
    <div class="controls">
      <button id="refresh-widgets" @click="handleRefreshWidgets">
        Refresh Widgets
      </button>
    </div>

    <div class="dashboard" id="widget-grid">
      <WeatherWidget />
      <PlaceholderWidget 
        v-for="i in 24" 
        :key="i + 1" 
        :id="i + 1" 
      />
    </div>

    <ItemList 
      :items="items" 
      @add-items="handleAddItems"
      @remove-items="handleRemoveItems"
    />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { store } from '../store'
import StatsPanel from '../components/StatsPanel.vue'
import ItemList from '../components/ItemList.vue'
import WeatherWidget from '../components/WeatherWidget.vue'
import PlaceholderWidget from '../components/PlaceholderWidget.vue'

export default {
  name: 'Dashboard',
  components: {
    StatsPanel,
    ItemList,
    WeatherWidget,
    PlaceholderWidget
  },
  setup() {
    const items = ref([])

    onMounted(() => {
      store.incrementPageLoads()
    })

    const handleAddItems = (amount) => {
      const newItems = Array.from({ length: amount }, (_, i) => ({
        id: Date.now() + i,
        name: `Item ${items.value.length + i + 1}`
      }))
      items.value.push(...newItems)
      store.incrementItemCounter(amount)
    }

    const handleRemoveItems = (amount) => {
      const removed = items.value.splice(0, amount)
      store.decrementItemCounter(removed.length)
    }

    const handleRefreshWidgets = () => {
      store.refreshWidgets()
    }

    return {
      items,
      handleAddItems,
      handleRemoveItems,
      handleRefreshWidgets
    }
  }
}
</script>
