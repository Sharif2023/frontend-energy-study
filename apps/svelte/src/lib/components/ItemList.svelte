<script>
  import { createEventDispatcher } from 'svelte';
  
  export let items = [];
  
  const dispatch = createEventDispatcher();
  
  let filterQuery = '';
  let sortBy = 'id';
  let addAmount = 100;
  
  $: filteredAndSortedItems = (() => {
    let result = [...items];
    
    if (filterQuery) {
      result = result.filter(item =>
        item.name.toLowerCase().includes(filterQuery.toLowerCase())
      );
    }
    
    if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      result.sort((a, b) => a.id - b.id);
    }
    
    return result;
  })();
  
  function handleAdd() {
    dispatch('addItems', addAmount);
  }
  
  function handleRemove() {
    dispatch('removeItems', 50);
  }
  
  function handleFilter() {
    filterQuery = filterQuery === 'item' ? '' : 'item';
  }
  
  function handleSort() {
    sortBy = sortBy === 'id' ? 'name' : 'id';
  }
</script>

<div>
  <div class="controls">
    <input
      id="item-input"
      type="number"
      bind:value={addAmount}
      min="10"
      max="500"
    />
    <button id="add-btn" on:click={handleAdd}>Add {addAmount} Items</button>
    <button id="remove-btn" on:click={handleRemove}>Remove 50 Items</button>
    <button id="filter-btn" on:click={handleFilter}>
      {filterQuery ? 'Clear Filter' : 'Filter "Item"'}
    </button>
    <button id="sort-btn" on:click={handleSort}>
      Sort by {sortBy === 'id' ? 'Name' : 'ID'}
    </button>
  </div>

  <div class="item-list">
    <h3>
      Dynamic Items (<span id="list-count">{filteredAndSortedItems.length}</span>)
    </h3>
    <ul id="item-list">
      {#each filteredAndSortedItems as item (item.id)}
        <li class="item">
          <span>ID: {item.id}</span>
          <span>{item.name}</span>
        </li>
      {/each}
    </ul>
  </div>
</div>
