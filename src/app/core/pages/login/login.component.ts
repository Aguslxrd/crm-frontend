import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, LoginInterface } from '../../services/authentication.service';
import { ToastrService } from 'ngx-toastr';

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
    private router: Router,
    private toastr: ToastrService
  ) {}

  onSubmit() {
    this.authService.authenticate(this.loginData).subscribe({
      next: (response) => {
        this.toastr.success('Inicio de sesion correcto!', 'ArcticCRM');
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.toastr.error('Error en la autenticacion, revisa tus credenciales o contacta un administrador!', 'ArcticCRM');
      }
    });
  }
}