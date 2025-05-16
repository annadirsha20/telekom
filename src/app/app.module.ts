import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { NavMenu } from './nav-menu/nav-menu.component';
import { About } from './about/about.component';
import { AppComponent } from './app.component';
import { AuthPage } from './auth/auth.component';
import { LkClientPage } from './lk-client/lk-client.component';
import { LkManagerAppsPage } from './lk-manager-apps/lk-manager-apps.component';
import { LkManagerAppsAllPage } from './lk-manager-apps-all/lk-manager-apps-all.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenu,
    About,
    AuthPage,
    LkClientPage,
    LkManagerAppsPage,
    LkManagerAppsAllPage
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
