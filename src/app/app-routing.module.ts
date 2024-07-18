import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './core/pages/home/home.component';
import { LoginComponent } from './core/pages/login/login.component';
import { authGuard } from './core/guards/auth-guard.guard';
import { UserDetailsComponent } from './core/components/user-details/user-details.component';

const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: "home", component: HomeComponent, canActivate: [authGuard]},
  {path: "user/details/:userId", component: UserDetailsComponent, canActivate: [authGuard]},
  {path: "login", component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
