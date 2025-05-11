import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { About } from './about/about.component';
import { AuthPage } from './auth/auth.component';

const routes: Routes = [
  { path: 'about', component: About },
  { path: 'auth', component: AuthPage },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
