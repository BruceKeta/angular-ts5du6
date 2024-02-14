import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChartsModule } from '@progress/kendo-angular-charts';

import { AppComponent } from './app.component';

import 'hammerjs';

@NgModule({
    imports: [BrowserModule, BrowserAnimationsModule, ChartsModule],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule {}
