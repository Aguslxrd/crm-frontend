import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './core/pages/home/home.component';
import { LoginComponent } from './core/pages/login/login.component';
import { authGuard } from './core/guards/auth-guard.guard';

const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: "home", component: HomeComponent, canActivate: [authGuard]},
  {path: "login", component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
