import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, LoginInterface } from '../../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData: LoginInterface = {
    email: '',
    passwd: ''
  };

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  onSubmit() {
    this.authService.authenticate(this.loginData).subscribe({
      next: (response) => {
        console.log('Autenticación exitosa', response);
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Error en la autenticación', error);
      }
    });
  }
}