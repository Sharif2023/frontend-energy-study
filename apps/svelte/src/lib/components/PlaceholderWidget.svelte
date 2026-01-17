<script>
  import { onMount } from 'svelte';
  import { widgetRefreshCounter } from '../stores/appStore.js';
  
  export let id;
  
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7', '#a29bfe'];
  const color = colors[id % colors.length];
  
  let number = Math.floor(Math.random() * 1000);
  
  function updateNumber() {
    number = Math.floor(Math.random() * 1000);
  }
  
  $: $widgetRefreshCounter, updateNumber();
</script>

<div class="widget" data-id={id} style="border-top: 4px solid {color}">
  <h3>Widget {id}</h3>
  <div style="font-size: 32px; font-weight: bold; color: {color}">
    {number}
  </div>
</div>
