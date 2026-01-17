import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private itemCounterSubject = new BehaviorSubject<number>(0);
  private widgetRefreshCounterSubject = new BehaviorSubject<number>(0);
  private pageLoadsSubject = new BehaviorSubject<number>(0);

  itemCounter$ = this.itemCounterSubject.asObservable();
  widgetRefreshCounter$ = this.widgetRefreshCounterSubject.asObservable();
  pageLoads$ = this.pageLoadsSubject.asObservable();

  get itemCounter() {
    return this.itemCounterSubject.value;
  }

  get widgetRefreshCounter() {
    return this.widgetRefreshCounterSubject.value;
  }

  get pageLoads() {
    return this.pageLoadsSubject.value;
  }

  incrementItemCounter(amount: number): void {
    this.itemCounterSubject.next(this.itemCounter + amount);
  }

  decrementItemCounter(amount: number): void {
    this.itemCounterSubject.next(Math.max(0, this.itemCounter - amount));
  }

  refreshWidgets(): void {
    this.widgetRefreshCounterSubject.next(this.widgetRefreshCounter + 1);
  }

  incrementPageLoads(): void {
    this.pageLoadsSubject.next(this.pageLoads + 1);
  }
}
