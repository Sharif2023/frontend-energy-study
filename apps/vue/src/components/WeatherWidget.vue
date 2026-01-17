<template>
  <div class="widget weather">
    <h3>🌤️ Weather</h3>
    <div id="weather-data">
      <div v-if="loading">Loading...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else-if="weatherData">
        <div><strong>{{ weatherData.name }}</strong></div>
        <div>🌡️ Temp: {{ weatherData.main.temp }}°C</div>
        <div>💧 Humidity: {{ weatherData.main.humidity }}%</div>
        <div>☁️ {{ weatherData.weather[0].description }}</div>
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

    // Weather code to description mapping (WMO codes)
    const getWeatherDescription = (code) => {
      const descriptions = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Foggy',
        48: 'Depositing rime fog',
        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Dense drizzle',
        61: 'Slight rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        71: 'Slight snow',
        73: 'Moderate snow',
        75: 'Heavy snow',
        80: 'Slight rain showers',
        81: 'Moderate rain showers',
        82: 'Violent rain showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with hail',
        99: 'Thunderstorm with heavy hail'
      }
      return descriptions[code] || 'Unknown'
    }

    const fetchWeather = async () => {
      loading.value = true
      error.value = null

      try {
        // Open-Meteo API - Free, no API key required
        // Coordinates for Dhaka, Bangladesh
        const latitude = 23.8103
        const longitude = 90.4125

        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relative_humidity_2m`
        )

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        const data = await response.json()

        // Transform Open-Meteo data to our format
        weatherData.value = {
          name: 'Dhaka, Bangladesh',
          main: {
            temp: data.current_weather.temperature.toFixed(1),
            humidity: data.hourly.relative_humidity_2m[0]
          },
          weather: [{
            description: getWeatherDescription(data.current_weather.weathercode)
          }]
        }
      } catch (err) {
        console.warn('Weather API error:', err.message)
        error.value = 'Failed to fetch weather'

        // Fallback to mock data
        weatherData.value = {
          name: 'Dhaka (Offline)',
          main: {
            temp: (Math.random() * 10 + 25).toFixed(1),
            humidity: Math.floor(Math.random() * 30 + 60)
          },
          weather: [{
            description: 'Data unavailable'
          }]
        }
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
