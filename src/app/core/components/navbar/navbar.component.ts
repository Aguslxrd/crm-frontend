import { Component } from '@angular/core';
import { StorageService } from '../../services/storage-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(private storageService: StorageService, private router: Router){}

  public logout(): void{
    this.storageService.clearAuth();
    this.router.navigate(['/login']);
  }
}
