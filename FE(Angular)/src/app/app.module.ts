import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AgGridModule } from 'ag-grid-angular';
import { HttpClientModule } from '@angular/common/http';
import { MatExpansionModule } from '@angular/material/expansion';
import { GitHubInitComponent } from './components/github-integration/github-init.component';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from './services/auth.service';
import { UserStatsComponent } from './components/user-stats/user-stats.component';

@NgModule({
  declarations: [
    AppComponent,
    GitHubInitComponent,
    UserStatsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AgGridModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatExpansionModule,
    AgGridModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
