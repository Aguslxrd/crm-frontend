import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from './storage-service.service';
import { Observable, throwError } from 'rxjs';
import { AdminInterface } from '../interfaces/IAdminUsers';
import { AdminRegisterInterface } from '../interfaces/IAdminRegister';
import { AdminChangeRoleInterface } from '../interfaces/IAdminChangeRoleInterface';
import { AdminEditInterface } from '../interfaces/IAdminEditInterface';
import { ILogsInterface } from '../interfaces/ILoggsInterface';
import { CaseInterface } from '../interfaces/ICase';
import { UserInterface } from '../interfaces/IUser';
import { EnterprisesInterface } from '../interfaces/IEnterprises';
import { LogsResponse } from '../interfaces/ILogsResponse';
import { AdminEnterpriseResponse } from '../interfaces/IAdminEnterpriseResponse';
import { UserResponse } from '../interfaces/IUserResponse';
import { CaseResponse } from '../interfaces/ICaseResponse';

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

  getSystemLogs(page: number, size: number): Observable<LogsResponse> {
    const token = this.storageService.getToken();
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
      return this.http.get<LogsResponse>(`${this.apiUrl}/logs`, { headers, params });
    } else {
      console.error('No token found in localStorage');
      return new Observable<LogsResponse>();
    }
  }
  

  getAllClosedCases(page: number, size: number): Observable<CaseResponse> {
    const token = this.storageService.getToken();
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
      return this.http.get<CaseResponse>(`${this.apiUrl}/closedcases`, { headers, params });
    } else {
      console.error('No token found in localStorage');
      return new Observable<CaseResponse>();
    }
  }

  getAllSoftDeletedUsers(page: number, size: number): Observable<UserResponse> {
    const token = this.storageService.getToken();
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
      return this.http.get<UserResponse>(`${this.apiUrl}/softdeletedusers`, { headers, params });
    } else {
      console.error('No token found in localStorage');
      return new Observable<UserResponse>();
    }
  }

  saveAdminData(userData: AdminRegisterInterface): Observable<AdminRegisterInterface> {
    const token = this.storageService.getToken();
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.post<AdminRegisterInterface>(this.apiUrl + '/users/register', userData, { headers });
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
      return this.http.patch<AdminEditInterface>(`${this.apiUrl}/users/edit`, userData, { headers });
    } else {
      console.error('No token found in localStorage');
      return new Observable<AdminEditInterface>();
    }
  }

  getAllSoftDeletedEnterprises(page: number, size: number): Observable<AdminEnterpriseResponse> {
    const token = this.storageService.getToken();
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
      return this.http.get<AdminEnterpriseResponse>(`${this.apiUrl}/softdeletedenterprises`, { headers, params });
    } else {
      console.error('No token found in localStorage');
      return new Observable<AdminEnterpriseResponse>();
    }
  }

  activateEnterpriseById(enterpriseId: number) {
    const token = this.storageService.getToken();
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.put(`${this.apiUrl}/enterprises/activate/${enterpriseId}`, {}, { headers });
    } else {
      console.error("No token found in localStorage");
      return throwError(() => new Error('No token found'));
    }
  }

}
