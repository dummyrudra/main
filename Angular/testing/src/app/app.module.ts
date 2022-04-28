import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { VoterComponent } from './Tests/Voter/voter.component';
import { IntegrationTestComponent } from './integration-test/integration-test.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { UsersComponent } from './users/users.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { HighlightDirective } from './directive/highlight.directive';
@NgModule({
  declarations: [
    AppComponent,
    VoterComponent,
    IntegrationTestComponent,
    UserDetailsComponent,
    UsersComponent,
    NotFoundComponent,
    HighlightDirective,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
