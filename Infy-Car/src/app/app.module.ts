import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http'
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { CarComponent } from './car/car.component';
import { StoreModule } from '@ngrx/store';
import { carReducer } from '../app/car/Store/cars.reducer';

@NgModule({
  declarations: [
    AppComponent,
    CarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forRoot({cars: carReducer}),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
