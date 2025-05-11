import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { NavMenu } from './nav-menu/nav-menu.component';
import { About } from './about/about.component';
import { AppComponent } from './app.component';
import { AuthPage } from './auth/auth.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenu,
    About,
    AuthPage
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
