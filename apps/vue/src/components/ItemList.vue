<template>
  <div>
    <div class="controls">
      <input
        id="item-input"
        type="number"
        v-model.number="addAmount"
        min="10"
        max="500"
      />
      <button id="add-btn" @click="handleAdd">Add {{ addAmount }} Items</button>
      <button id="remove-btn" @click="handleRemove">Remove 50 Items</button>
      <button id="filter-btn" @click="handleFilter">
        {{ filterQuery ? 'Clear Filter' : 'Filter "Item"' }}
      </button>
      <button id="sort-btn" @click="handleSort">
        Sort by {{ sortBy === 'id' ? 'Name' : 'ID' }}
      </button>
    </div>

    <div class="item-list">
      <h3>
        Dynamic Items (<span id="list-count">{{ filteredAndSortedItems.length }}</span>)
      </h3>
      <ul id="item-list">
        <li v-for="item in filteredAndSortedItems" :key="item.id" class="item">
          <span>ID: {{ item.id }}</span>
          <span>{{ item.name }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'ItemList',
  props: {
    items: {
      type: Array,
      default: () => []
    }
  },
  emits: ['add-items', 'remove-items'],
  setup(props, { emit }) {
    const filterQuery = ref('')
    const sortBy = ref('id')
    const addAmount = ref(100)

    const filteredAndSortedItems = computed(() => {
      let result = [...props.items]

      if (filterQuery.value) {
        result = result.filter(item =>
          item.name.toLowerCase().includes(filterQuery.value.toLowerCase())
        )
      }

      if (sortBy.value === 'name') {
        result.sort((a, b) => a.name.localeCompare(b.name))
      } else {
        result.sort((a, b) => a.id - b.id)
      }

      return result
    })

    const handleAdd = () => {
      emit('add-items', addAmount.value)
    }

    const handleRemove = () => {
      emit('remove-items', 50)
    }

    const handleFilter = () => {
      filterQuery.value = filterQuery.value === 'item' ? '' : 'item'
    }

    const handleSort = () => {
      sortBy.value = sortBy.value === 'id' ? 'name' : 'id'
    }

    return {
      filterQuery,
      sortBy,
      addAmount,
      filteredAndSortedItems,
      handleAdd,
      handleRemove,
      handleFilter,
      handleSort
    }
  }
}
</script>
