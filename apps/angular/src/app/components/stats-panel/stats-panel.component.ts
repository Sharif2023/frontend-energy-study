import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AppService } from '../../app.service';

@Component({
  selector: 'app-stats-panel',
  templateUrl: './stats-panel.component.html',
  styleUrls: ['./stats-panel.component.css']
})
export class StatsPanelComponent implements OnInit {
  @Input() itemCount = 0;
  widgetRefreshCounter$!: Observable<number>;
  pageLoads$!: Observable<number>;

  constructor(private appService: AppService) {}

  ngOnInit(): void {
    this.widgetRefreshCounter$ = this.appService.widgetRefreshCounter$;
    this.pageLoads$ = this.appService.pageLoads$;
  }
}
