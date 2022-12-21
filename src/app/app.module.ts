import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './view/home/home.component';
import { TimelineComponent } from './view/timeline/timeline.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction'; 

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TimelineComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyB13Cty9mQqYcg4KHr-aefHxSbupuGhGoo',
      libraries: ['places','geometry']
    }),
    AgmDirectionModule,     // agm-direction
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
