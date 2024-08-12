import { Component } from '@angular/core';
import { StorageService } from '../../services/storage-service.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(private storageService: StorageService, private router: Router, private toastr: ToastrService){}

  public logout(): void{
    this.storageService.clearAuth();
    this.router.navigate(['/login']);
  }

  developmentFeatureAlert(): void{
    this.toastr.info('Bajo desarrollo!', 'ArcticCRM')
  }
}
