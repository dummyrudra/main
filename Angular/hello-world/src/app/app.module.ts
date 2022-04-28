import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoursesComponent } from './courses.component';
import { CourseComponent } from './course/course.component';
import { CoursesService } from './courses.services';
import {FormsModule} from '@angular/forms';
import { SummaryPipe } from './summary.pipe';
import { TitlePipe } from './titlecase.pipe';
import { FavoriteComponent } from './favorite/favorite.component';
import { CounterComponent } from './counter/counter.component';
import { TestPipe } from './test.pipe';
import { CardComponent } from './card/card.component';

@NgModule({
  declarations: [
    AppComponent,
    CoursesComponent,
    CourseComponent,
    SummaryPipe,
    TitlePipe,
    FavoriteComponent,
    CounterComponent,
    TestPipe,
    CardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
  ],
  providers: [
    CoursesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
