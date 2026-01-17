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

  constructor(private appService: AppService) {}

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

  async fetchWeather(): Promise<void> {
    this.loading = true;
    this.error = null;

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const mockWeather: WeatherData = {
        name: 'London',
        main: {
          temp: (Math.random() * 30 + 10).toFixed(1),
          humidity: Math.floor(Math.random() * 40 + 40)
        },
        weather: [{
          description: ['sunny', 'cloudy', 'rainy', 'clear'][Math.floor(Math.random() * 4)]
        }]
      };

      this.weatherData = mockWeather;
    } catch (err) {
      this.error = 'Failed to fetch weather';
      console.error('Weather API error:', err);
    } finally {
      this.loading = false;
    }
  }
}
