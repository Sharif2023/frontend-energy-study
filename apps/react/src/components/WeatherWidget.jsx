import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

const WeatherWidget = () => {
  const { widgetRefreshCounter } = useApp();
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch real weather data for Dhaka, Bangladesh
        const API_KEY = 'e893f42ec11b61eb51029f5e25e96f60'; // OpenWeatherMap API key
        const city = 'Dhaka';
        const country = 'BD'; // Bangladesh country code

        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${API_KEY}&units=metric`
        );

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        setWeatherData(data);
      } catch (err) {
        setError('Failed to fetch weather');
        console.error('Weather API error:', err);

        // Fallback to mock data if API fails
        const mockWeather = {
          name: 'Dhaka',
          main: {
            temp: (Math.random() * 10 + 25).toFixed(1), // 25-35°C typical for Bangladesh
            humidity: Math.floor(Math.random() * 30 + 60) // 60-90% typical humidity
          },
          weather: [{
            description: ['clear sky', 'few clouds', 'scattered clouds', 'broken clouds'][Math.floor(Math.random() * 4)]
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
      <h3>Weather</h3>
      <div id="weather-data">
        {loading && <div>Loading...</div>}
        {error && <div>{error}</div>}
        {weatherData && (
          <div>
            <div><strong>{weatherData.name}</strong></div>
            <div>Temp: {weatherData.main.temp}°C</div>
            <div>Humidity: {weatherData.main.humidity}%</div>
            <div>{weatherData.weather[0].description}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherWidget;
