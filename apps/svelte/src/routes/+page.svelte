<!-- IDENTICAL HTML STRUCTURE REQUIRED -->
<div id="app">
  <!-- Navigation -->
  <nav>
    <a href="/">Home</a>
    <a href="/about">About</a> 
    <a href="/contact">Contact</a>
  </nav>

  <!-- Stats Panel -->
  <div class="stats">
    <span>Total Items: <span id="item-count">0</span></span>
    <span>Widgets Active: 25</span>
    <span>Page Loads: <span id="page-count">0</span></span>
  </div>

  <!-- Controls -->
  <div class="controls">
    <input id="item-input" type="number" value="100" min="10" max="500">
    <button id="add-btn">Add Items</button>
    <button id="remove-btn">Remove 50 Items</button>
    <button id="filter-btn">Filter "Item"</button>
    <button id="sort-btn">Sort by Name</button>
    <button id="refresh-widgets">Refresh Widgets</button>
  </div>

  <!-- Dashboard Grid (25 widgets) -->
  <div class="dashboard" id="widget-grid">
    <!-- Widget 1: Live Weather API -->
    <div class="widget weather">
      <h3>Weather</h3>
      <div id="weather-data">Loading...</div>
    </div>
    <!-- Widgets 2-25: Placeholders -->
    <div class="widget" data-id="2">...</div>
    <!-- ... repeat 24x with random colors/numbers -->
  </div>

  <!-- Item List -->
  <div class="item-list">
    <h3>Dynamic Items (<span id="list-count">0</span>)</h3>
    <ul id="item-list"></ul>
  </div>
</div>
