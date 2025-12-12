import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { Item } from '../../components/item-list/item-list.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  items: Item[] = [];
  widgetIds = Array.from({ length: 24 }, (_, i) => i + 2);

  constructor(private appService: AppService) {}

  ngOnInit(): void {
    this.appService.incrementPageLoads();
  }

  handleAddItems(amount: number): void {
    const newItems: Item[] = Array.from({ length: amount }, (_, i) => ({
      id: Date.now() + i,
      name: `Item ${this.items.length + i + 1}`
    }));
    this.items.push(...newItems);
    this.appService.incrementItemCounter(amount);
  }

  handleRemoveItems(amount: number): void {
    const removed = this.items.splice(0, amount);
    this.appService.decrementItemCounter(removed.length);
  }

  handleRefreshWidgets(): void {
    this.appService.refreshWidgets();
  }
}
