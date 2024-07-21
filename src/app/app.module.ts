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
    UserCasesComponent
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
    
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
