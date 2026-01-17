import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

const WeatherWidget = () => {
  const { widgetRefreshCounter } = useApp();
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    };
    return descriptions[code] || 'Unknown';
  };

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);

      try {
        // Open-Meteo API - Free, no API key required
        // Coordinates for Dhaka, Bangladesh
        const latitude = 23.8103;
        const longitude = 90.4125;

        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relative_humidity_2m`
        );

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        // Transform Open-Meteo data to our format
        const weatherInfo = {
          name: 'Dhaka, Bangladesh',
          main: {
            temp: data.current_weather.temperature.toFixed(1),
            humidity: data.hourly.relative_humidity_2m[0] // Current hour's humidity
          },
          weather: [{
            description: getWeatherDescription(data.current_weather.weathercode)
          }],
          wind: {
            speed: data.current_weather.windspeed
          }
        };

        setWeatherData(weatherInfo);
      } catch (err) {
        console.warn('Weather API error:', err.message);
        setError('Failed to fetch weather');

        // Fallback to mock data
        const mockWeather = {
          name: 'Dhaka (Offline)',
          main: {
            temp: (Math.random() * 10 + 25).toFixed(1),
            humidity: Math.floor(Math.random() * 30 + 60)
          },
          weather: [{
            description: 'Data unavailable'
          }]
        };
        setWeatherData(mockWeather);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [widgetRefreshCounter]);

  return (
    <div className="widget weather">
      <h3>🌤️ Weather</h3>
      <div id="weather-data">
        {loading && <div>Loading...</div>}
        {error && <div className="error">{error}</div>}
        {weatherData && (
          <div>
            <div><strong>{weatherData.name}</strong></div>
            <div>🌡️ Temp: {weatherData.main.temp}°C</div>
            <div>💧 Humidity: {weatherData.main.humidity}%</div>
            <div>☁️ {weatherData.weather[0].description}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherWidget;
