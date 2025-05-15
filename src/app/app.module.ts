import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http';

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
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
