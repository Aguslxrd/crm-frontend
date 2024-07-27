import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from './storage-service.service';
import { Observable } from 'rxjs';
import { AdminInterface } from '../interfaces/IAdminUsers';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly apiUrl = 'http://localhost:8080/api/admin';

  constructor(private http: HttpClient, private storageService: StorageService) {}
  

  getAdminUsers(): Observable<AdminInterface[]> {
    const token = this.storageService.getToken();
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get<AdminInterface[]>(this.apiUrl + '/users', { headers });
    } else {
      console.error('No token found in localStorage');
      return new Observable<AdminInterface[]>(); 
    }
  }

  
}
