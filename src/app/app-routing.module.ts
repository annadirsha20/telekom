import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { About } from './about/about.component';
import { AuthPage } from './auth/auth.component';
import { NavMenu } from './nav-menu/nav-menu.component';

const routes: Routes = [
  { path: 'about', component: About },
  { path: 'auth', component: AuthPage },
  { path: 'nav', component: NavMenu}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
