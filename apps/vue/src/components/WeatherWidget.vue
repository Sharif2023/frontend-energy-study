<template>
  <div class="widget weather">
    <h3>Weather</h3>
    <div id="weather-data">
      <div v-if="loading">Loading...</div>
      <div v-else-if="error">{{ error }}</div>
      <div v-else-if="weatherData">
        <div><strong>{{ weatherData.name }}</strong></div>
        <div>Temp: {{ weatherData.main.temp }}°C</div>
        <div>Humidity: {{ weatherData.main.humidity }}%</div>
        <div>{{ weatherData.weather[0].description }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import { store } from '../store'

export default {
  name: 'WeatherWidget',
  setup() {
    const weatherData = ref(null)
    const loading = ref(true)
    const error = ref(null)

    const fetchWeather = async () => {
      loading.value = true
      error.value = null

      try {
        // Mock weather API call
        await new Promise(resolve => setTimeout(resolve, 500))

        const mockWeather = {
          name: 'London',
          main: {
            temp: (Math.random() * 30 + 10).toFixed(1),
            humidity: Math.floor(Math.random() * 40 + 40)
          },
          weather: [{
            description: ['sunny', 'cloudy', 'rainy', 'clear'][Math.floor(Math.random() * 4)]
          }]
        }

        weatherData.value = mockWeather
      } catch (err) {
        error.value = 'Failed to fetch weather'
        console.error('Weather API error:', err)
      } finally {
        loading.value = false
      }
    }

    watch(() => store.widgetRefreshCounter, () => {
      fetchWeather()
    }, { immediate: true })

    return {
      weatherData,
      loading,
      error
    }
  }
}
</script>
