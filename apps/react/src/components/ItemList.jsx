import React, { useState, useMemo } from 'react';

const ItemList = React.memo(({ items, onAddItems, onRemoveItems }) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [sortBy, setSortBy] = useState('id'); // 'id' or 'name'
  const [addAmount, setAddAmount] = useState(100);

  const filteredAndSortedItems = useMemo(() => {
    let result = items;

    // Filter
    if (filterQuery) {
      result = result.filter(item =>
        item.name.toLowerCase().includes(filterQuery.toLowerCase())
      );
    }

    // Sort - only create new array if we need to sort by name
    if (sortBy === 'name') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }
    // If sorting by ID, items are already in order, no need to sort

    return result;
  }, [items, filterQuery, sortBy]);

  // Only render last 1000 items for performance, but keep all in state
  const displayedItems = useMemo(() => {
    const startIndex = Math.max(0, filteredAndSortedItems.length - 1000);
    return filteredAndSortedItems.slice(startIndex);
  }, [filteredAndSortedItems]);

  const handleAdd = () => {
    onAddItems(addAmount);
  };

  const handleRemove = () => {
    onRemoveItems(50);
  };

  const handleFilter = () => {
    setFilterQuery(filterQuery === 'item' ? '' : 'item');
  };

  const handleSort = () => {
    setSortBy(sortBy === 'id' ? 'name' : 'id');
  };

  return (
    <div>
      <div className="controls">
        <input
          id="item-input"
          type="number"
          value={addAmount}
          onChange={(e) => setAddAmount(parseInt(e.target.value) || 100)}
          min="10"
          max="500"
        />
        <button id="add-btn" onClick={handleAdd}>
          Add {addAmount} Items
        </button>
        <button id="remove-btn" onClick={handleRemove}>
          Remove 50 Items
        </button>
        <button id="filter-btn" onClick={handleFilter}>
          {filterQuery ? 'Clear Filter' : 'Filter "Item"'}
        </button>
        <button id="sort-btn" onClick={handleSort}>
          Sort by {sortBy === 'id' ? 'Name' : 'ID'}
        </button>
      </div>

      <div className="item-list">
        <h3>
          Dynamic Items (<span id="list-count">{filteredAndSortedItems.length}</span>)
        </h3>
        <ul id="item-list">
          {displayedItems.map((item) => (
            <li key={item.id} className="item">
              <span>ID: {item.id}</span>
              <span>{item.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
});

export default ItemList;
