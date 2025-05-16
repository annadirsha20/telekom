import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { About } from './about/about.component';
import { AuthPage } from './auth/auth.component';
import { NavMenu } from './nav-menu/nav-menu.component';
import { LkClientPage } from './lk-client/lk-client.component';
import { LkManagerAppsPage } from './lk-manager-apps/lk-manager-apps.component';
import { LkManagerAppsAllPage } from './lk-manager-apps-all/lk-manager-apps-all.component';

const routes: Routes = [
  { path: 'about', component: About },
  { path: 'auth', component: AuthPage },
  { path: 'nav', component: NavMenu},
  { path: 'lk-client', component: LkClientPage },
  { path: 'lk-manager-apps', component: LkManagerAppsPage },
  { path: 'lk-manager-apps-all', component: LkManagerAppsAllPage },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
