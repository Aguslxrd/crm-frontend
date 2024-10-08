import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './core/components/navbar/navbar.component';
import { HomeComponent } from './core/pages/home/home.component';
import { LoginComponent } from './core/pages/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UserlistComponent } from './core/components/userlist/userlist.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NewUserFormModalComponent } from './core/components/new-user-form-modal/new-user-form-modal.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { EditUserFormModalComponent } from './core/components/edit-user-form-modal/edit-user-form-modal.component';
import { UserDetailsComponent } from './core/components/user-details/user-details.component';
import { NewCaseFormModalComponent } from './core/components/new-case-form-modal/new-case-form-modal.component';
import { MatSelectModule } from '@angular/material/select';
import { UserCasesComponent } from './core/components/user-cases/user-cases.component';
import { NewInteractionFormModalComponent } from './core/components/new-interaction-form-modal/new-interaction-form-modal.component';
import { EditCaseFormModalComponent } from './core/components/edit-case-form-modal/edit-case-form-modal.component';
import { EditInteractionFormModalComponent } from './core/components/edit-interaction-form-modal/edit-interaction-form-modal.component';
import { CommonModule } from '@angular/common';
import { CaseListComponent } from './core/components/cases-list/cases-list.component';
import { CaseDetailsComponent } from './core/components/cases-details/cases-details.component';
import { EnterprisesListComponent } from './core/components/enterprises-list/enterprises-list.component';
import { NewEnterpriseFormModalComponent } from './core/components/new-enterprise-form-modal/new-enterprise-form-modal.component';
import { EditEnterpriseFormModalComponent } from './core/components/edit-enterprise-form-modal/edit-enterprise-form-modal.component';
import { EnterpriseDetailsComponent } from './core/components/enterprise-details/enterprise-details.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { AdminManagementComponent } from './core/components/admin-management/admin-management.component';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    LoginComponent,
    UserlistComponent,
    NewUserFormModalComponent,
    EditUserFormModalComponent,
    UserDetailsComponent,
    NewCaseFormModalComponent,
    UserCasesComponent,
    NewInteractionFormModalComponent,
    EditCaseFormModalComponent,
    EditInteractionFormModalComponent,
    CaseListComponent,
    CaseDetailsComponent,
    EnterprisesListComponent,
    NewEnterpriseFormModalComponent,
    EditEnterpriseFormModalComponent,
    EnterpriseDetailsComponent,
    AdminManagementComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatSelectModule,
    CommonModule,
    NgSelectModule,
    ToastrModule.forRoot()
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
