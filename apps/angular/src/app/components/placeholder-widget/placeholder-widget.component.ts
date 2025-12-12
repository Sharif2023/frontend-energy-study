import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppService } from '../../app.service';

@Component({
  selector: 'app-placeholder-widget',
  templateUrl: './placeholder-widget.component.html',
  styleUrls: ['./placeholder-widget.component.css']
})
export class PlaceholderWidgetComponent implements OnInit, OnDestroy {
  @Input() id!: number;
  number = 0;
  color = '';
  private subscription?: Subscription;
  private colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7', '#a29bfe'];

  constructor(private appService: AppService) {}

  ngOnInit(): void {
    this.color = this.colors[this.id % this.colors.length];
    this.updateNumber();

    this.subscription = this.appService.widgetRefreshCounter$.subscribe(() => {
      this.updateNumber();
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  updateNumber(): void {
    this.number = Math.floor(Math.random() * 1000);
  }
}
