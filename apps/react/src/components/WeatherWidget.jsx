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
        // Using OpenWeatherMap API (free tier)
        // Replace with your API key or use a mock for testing
        const API_KEY = 'demo_key'; // Replace with actual key or use mock
        const city = 'London';
        
        // For research purposes, we'll use a mock response to avoid API dependencies
        // In real deployment, use: `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        
        // Mock weather API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const mockWeather = {
          name: city,
          main: {
            temp: (Math.random() * 30 + 10).toFixed(1),
            humidity: Math.floor(Math.random() * 40 + 40)
          },
          weather: [{
            description: ['sunny', 'cloudy', 'rainy', 'clear'][Math.floor(Math.random() * 4)]
          }]
        };
        
        setWeatherData(mockWeather);
      } catch (err) {
        setError('Failed to fetch weather');
        console.error('Weather API error:', err);
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
