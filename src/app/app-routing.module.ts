import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './core/pages/home/home.component';
import { LoginComponent } from './core/pages/login/login.component';
import { authGuard } from './core/guards/auth-guard.guard';
import { UserDetailsComponent } from './core/components/user-details/user-details.component';
import { UserCasesComponent } from './core/components/user-cases/user-cases.component';
import { UserlistComponent } from './core/components/userlist/userlist.component';
import { CaseListComponent } from './core/components/cases-list/cases-list.component';
import { CaseDetailsComponent } from './core/components/cases-details/cases-details.component';
import { EnterprisesListComponent } from './core/components/enterprises-list/enterprises-list.component';

const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: 'users', component: UserlistComponent, canActivate: [authGuard] },
  {path: 'cases', component: CaseListComponent, canActivate: [authGuard] },
  {path: "home", component: HomeComponent, canActivate: [authGuard]},
  {path: "enterprises", component: EnterprisesListComponent, canActivate: [authGuard]},
  {path: "user/details/:userId", component: UserDetailsComponent, canActivate: [authGuard]},
  {path: "details/cases/:caseId", component: CaseDetailsComponent, canActivate: [authGuard]},
  {path: "user/details/cases/interactions/:caseId", component: UserCasesComponent, canActivate: [authGuard]},
  {path: "login", component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
