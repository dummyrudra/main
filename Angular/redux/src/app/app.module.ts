import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// import { NgRedux, NgReduxModule } from '@angular-redux/store';
import { IAppState, rootReducer } from './store';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule /* NgReduxModule*/],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  // constructor(ngRedux: NgRedux<IAppState>) {
  //   ngRedux.configureStore(rootReducer, {});
  // }
}
