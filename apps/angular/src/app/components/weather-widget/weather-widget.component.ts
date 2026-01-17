import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppService } from '../../app.service';

interface WeatherData {
  name: string;
  main: {
    temp: string;
    humidity: number;
  };
  weather: Array<{
    description: string;
  }>;
}

@Component({
  selector: 'app-weather-widget',
  templateUrl: './weather-widget.component.html',
  styleUrls: ['./weather-widget.component.css']
})
export class WeatherWidgetComponent implements OnInit, OnDestroy {
  weatherData: WeatherData | null = null;
  loading = true;
  error: string | null = null;
  private subscription?: Subscription;

  constructor(private appService: AppService) { }

  ngOnInit(): void {
    this.fetchWeather();
    this.subscription = this.appService.widgetRefreshCounter$.subscribe(() => {
      this.fetchWeather();
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  // Weather code to description mapping (WMO codes)
  private getWeatherDescription(code: number): string {
    const descriptions: { [key: number]: string } = {
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
  }

  async fetchWeather(): Promise<void> {
    this.loading = true;
    this.error = null;

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
      this.weatherData = {
        name: 'Dhaka, Bangladesh',
        main: {
          temp: data.current_weather.temperature.toFixed(1),
          humidity: data.hourly.relative_humidity_2m[0]
        },
        weather: [{
          description: this.getWeatherDescription(data.current_weather.weathercode)
        }]
      };
    } catch (err) {
      console.warn('Weather API error:', err);
      this.error = 'Failed to fetch weather';

      // Fallback to mock data
      this.weatherData = {
        name: 'Dhaka (Offline)',
        main: {
          temp: (Math.random() * 10 + 25).toFixed(1),
          humidity: Math.floor(Math.random() * 30 + 60)
        },
        weather: [{
          description: 'Data unavailable'
        }]
      };
    } finally {
      this.loading = false;
    }
  }
}
