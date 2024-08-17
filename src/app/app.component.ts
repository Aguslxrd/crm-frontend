import { Component } from '@angular/core';
import { AuthenticationService } from './core/services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private authService: AuthenticationService) {}

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn(); 
  }

  title = 'crm-frontend';
}
