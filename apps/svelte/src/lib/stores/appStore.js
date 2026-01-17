import { writable } from 'svelte/store';

export const itemCounter = writable(0);
export const widgetRefreshCounter = writable(0);
export const pageLoads = writable(0);

export function incrementItemCounter(amount) {
  itemCounter.update(n => n + amount);
}

export function decrementItemCounter(amount) {
  itemCounter.update(n => Math.max(0, n - amount));
}

export function refreshWidgets() {
  widgetRefreshCounter.update(n => n + 1);
}

export function incrementPageLoads() {
  pageLoads.update(n => n + 1);
}
