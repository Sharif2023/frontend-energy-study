<script>
  import { onMount } from 'svelte';
  import { widgetRefreshCounter } from '../stores/appStore.js';
  
  let weatherData = null;
  let loading = true;
  let error = null;
  
  async function fetchWeather() {
    loading = true;
    error = null;
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      weatherData = {
        name: 'London',
        main: {
          temp: (Math.random() * 30 + 10).toFixed(1),
          humidity: Math.floor(Math.random() * 40 + 40)
        },
        weather: [{
          description: ['sunny', 'cloudy', 'rainy', 'clear'][Math.floor(Math.random() * 4)]
        }]
      };
    } catch (err) {
      error = 'Failed to fetch weather';
      console.error('Weather API error:', err);
    } finally {
      loading = false;
    }
  }
  
  $: $widgetRefreshCounter, fetchWeather();
</script>

<div class="widget weather">
  <h3>Weather</h3>
  <div id="weather-data">
    {#if loading}
      <div>Loading...</div>
    {:else if error}
      <div>{error}</div>
    {:else if weatherData}
      <div>
        <div><strong>{weatherData.name}</strong></div>
        <div>Temp: {weatherData.main.temp}°C</div>
        <div>Humidity: {weatherData.main.humidity}%</div>
        <div>{weatherData.weather[0].description}</div>
      </div>
    {/if}
  </div>
</div>
