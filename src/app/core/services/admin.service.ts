import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from './storage-service.service';
import { Observable } from 'rxjs';
import { AdminInterface } from '../interfaces/IAdminUsers';
import { AdminRegisterInterface } from '../interfaces/IAdminRegister';
import { AdminChangeRoleInterface } from '../interfaces/IAdminChangeRoleInterface';
import { AdminEditInterface } from '../interfaces/IAdminEditInterface';
import { ILogsInterface } from '../interfaces/ILoggsInterface';
import { CaseInterface } from '../interfaces/ICase';
import { UserInterface } from '../interfaces/IUser';

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

  getSystemLogs(): Observable<ILogsInterface[]> {
    const token = this.storageService.getToken();
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get<ILogsInterface[]>(this.apiUrl + '/logs', { headers });
    } else {
      console.error('No token found in localStorage');
      return new Observable<ILogsInterface[]>(); 
    }
  }

  getAllClosedCases(): Observable<CaseInterface[]> {
    const token = this.storageService.getToken();
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get<CaseInterface[]>(this.apiUrl + '/closedcases', { headers });
    } else {
      console.error('No token found in localStorage');
      return new Observable<CaseInterface[]>(); 
    }
  }

  getAllSoftDeletedUsers(): Observable<UserInterface[]> {
    const token = this.storageService.getToken();
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get<UserInterface[]>(this.apiUrl + '/softdeletedusers', { headers });
    } else {
      console.error('No token found in localStorage');
      return new Observable<UserInterface[]>(); 
    }
  }

  saveAdminData(userData: AdminRegisterInterface): Observable<AdminRegisterInterface> {
    const token = this.storageService.getToken();
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.post<AdminRegisterInterface>(this.apiUrl + '/register', userData, { headers });
    } else {
      console.error('No token found in localStorage');
      return new Observable<AdminRegisterInterface>();
    }
  }

  changeAdminRole(userData: AdminChangeRoleInterface): Observable<AdminChangeRoleInterface> {
    const token = this.storageService.getToken();
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.put<AdminChangeRoleInterface>(this.apiUrl + '/users/changerole', userData, { headers });
    } else {
      console.error('No token found in localStorage');
      return new Observable<AdminChangeRoleInterface>();
    }
  }

  deleteAdminById(adminId: number){
    const token = this.storageService.getToken();
    if(token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.delete(`${this.apiUrl}/users/${adminId}`, {headers});
    }else{
      console.error("No token found in localStorage");
      return new Observable<AdminInterface[]>();
    }
  }

  editAdmin(userData: AdminEditInterface): Observable<AdminEditInterface> {
    const token = this.storageService.getToken();
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.patch<AdminEditInterface>(this.apiUrl + '/users/edit', userData, { headers });
    } else {
      console.error('No token found in localStorage');
      return new Observable<AdminEditInterface>();
    }
  }

}
