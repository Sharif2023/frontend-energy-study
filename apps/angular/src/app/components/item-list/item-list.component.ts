import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

export interface Item {
  id: number;
  name: string;
}

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {
  @Input() items: Item[] = [];
  @Output() addItems = new EventEmitter<number>();
  @Output() removeItems = new EventEmitter<number>();

  filterQuery = '';
  sortBy: 'id' | 'name' = 'id';
  addAmount = 100;

  get filteredAndSortedItems(): Item[] {
    let result = [...this.items];

    if (this.filterQuery) {
      result = result.filter(item =>
        item.name.toLowerCase().includes(this.filterQuery.toLowerCase())
      );
    }

    if (this.sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      result.sort((a, b) => a.id - b.id);
    }

    return result;
  }

  ngOnInit(): void {}

  handleAdd(): void {
    this.addItems.emit(this.addAmount);
  }

  handleRemove(): void {
    this.removeItems.emit(50);
  }

  handleFilter(): void {
    this.filterQuery = this.filterQuery === 'item' ? '' : 'item';
  }

  handleSort(): void {
    this.sortBy = this.sortBy === 'id' ? 'name' : 'id';
  }
}
