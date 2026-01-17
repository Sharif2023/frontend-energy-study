import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { StatsPanelComponent } from './components/stats-panel/stats-panel.component';
import { ItemListComponent } from './components/item-list/item-list.component';
import { WeatherWidgetComponent } from './components/weather-widget/weather-widget.component';
import { PlaceholderWidgetComponent } from './components/placeholder-widget/placeholder-widget.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    DashboardComponent,
    AboutComponent,
    ContactComponent,
    StatsPanelComponent,
    ItemListComponent,
    WeatherWidgetComponent,
    PlaceholderWidgetComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
